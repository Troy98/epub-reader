import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, PenTool } from 'react-feather';
import ePub from 'epubjs';
import WebFont from 'webfontloader';
import { hyphenateHTMLSync } from 'hyphen/nl';
import { getLayoutActionAsync } from '../actions/userActionCreator';
import IconButton from './IconButton';
import OnClickButton from './OnClickButton';
import '../Reader.css';
import '../fonts/fonts.css';
import Loader from './Loader';
import ScreenNotification from './ScreenNotification';
import useScrollPosition from '../hooks/useScrollPosition';
import ChangeTextLayout from './LayoutPanels/ChangeTextLayout';
import ChangeColorLayout from './LayoutPanels/ChangeColorLayout';
import LayoutContainer from './LayoutPanels/LayoutContainer';
import Icon from './Panel/Icon';

const serverURL = process.env.REACT_APP_API_URL;

function Book() {
  const [HTMLBook, setHTMLBook] = useState('');
  const {
    fontSize, lineHeight, backgroundColor, textColor,
    accentColorTailwindFormat, accentColorHexFormat, fontFamily, letterSpacing,
  } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const scrollPosition = useScrollPosition();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [scrollPositionState, setScrollPositionState] = useState('');
  const [scrollPositionDBState, setScrollPositionDBState] = useState('');
  const { deletedEbookID } = useSelector((state) => state.ebooks);
  const [showModal, setShowModal] = useState(false);
  const [ebook, setEBook] = useState(undefined);
  const { id } = useParams();
  const [changeTextToggled, setChangeTextToggled] = useState(false);
  const [changeColorToggled, setChangeColorToggled] = useState(false);
  const isHelper = localStorage.getItem('isHelper');
  const fontSizetoNumber = fontSize.replace('px', '');

  useEffect(() => {
    if (!isHelper) {
      setScrollPositionState(scrollPosition);
    }
  }, [scrollPosition]);

  const screenNotificationHandler = () => {
    navigate('/bibliotheek');
    setShowModal(false);
  };

  useEffect(() => {
    if (id === deletedEbookID) {
      setShowModal(true);
    }
  }, [deletedEbookID]);

  useEffect(() => {
    const getEbookFromUrlId = async () => {
      const response = await fetch(`${serverURL}/api/v1/reader/books/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const book = await response.json();
      setScrollPositionDBState(book.scrollPosition);
      setEBook(ePub(`${serverURL}/${book.path}`));
    };
    getEbookFromUrlId()
      .catch(/* Displaying an error to the user has no effect */);
  }, [id]);

  const renderBookLayout = async () => {
    if (await ebook.ready) {
      dispatch(getLayoutActionAsync());
    }

    WebFont.load({
      google: {
        families: ['Overpass', 'Source Serif Pro', 'Atkinson Hyperlegible', 'Comic Neue'],
      },
      custom: {
        families: ['OpenDyslexic', 'KlinicSlab'],
        urls: ['../fonts/fonts.css'],
      },
      context: window.frames[0],
    });
  };

  useEffect(() => {
    if (scrollPositionState) {
      fetch(`${serverURL}/api/v1/reader/books/${id}`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scrollPosition: scrollPositionState,
        }),
      }).catch(/* Displaying an error to the user has no effect */);
    }
  }, [scrollPositionState]);

  useEffect(() => {
    if (ebook) {
      const render = async () => {
        await renderBookLayout();
      };
      render().catch(/* Displaying an error to the user has no effect */);
    }
  }, [ebook]);

  useEffect(() => {
    if (ebook) {
      ebook.destroy();
    }
  }, []);

  const toggleRender = (type) => {
    if (type === 'text') {
      setChangeTextToggled(!changeTextToggled);
      setChangeColorToggled(false);
    } else if (type === 'color') {
      setChangeColorToggled(!changeColorToggled);
      setChangeTextToggled(false);
    }
  };

  /**
   * Changes a style option in the database
   * @param {*} changedStyle The style that is changed (for example: 'fontSize, lineHeight, etc')
   * @param {*} value The value of the style (for example: '1.5')
   * @param {*} valueType The type of value (for example: 'rem')
   */
  const changeStyleInDb = async (changedStyle, value, valueType) => {
    try {
      await fetch(`${serverURL}/api/v1/helper/users/layout`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value,
          valueType,
          typeOfLayout: changedStyle,
        }),
      });
    } catch { /* Displaying an error to the user has no effect */ }
  };

  // Sometimes the urls in the html won't match the urls in the book object, this regex fixes that
  const regex = /\/|\.|\?/g;

  /**
   * Gets the replacement urls from the book object
   * @returns {object} urls - object with urls as keys and replacement urls as values
   */
  const getReplacementUrls = async () => {
    const urls = {};
    const promise = ebook.resources.urls.map(async (url, i) => {
      const newUrl = url.replace(regex, '');
      urls[newUrl] = ebook.resources.replacementUrls[i];
    });
    await Promise.all(promise);
    return urls;
  };

  /**
   * Replaces the attributes of the elements with the replacement urls
   * @param {*} elements The elements to replace the attributes of
   * @param {*} replacements The object with the replacements
   * @param {*} attribute The attribute to replace
   */
  const replaceElementAttributes = async (elements, replacements, attribute) => {
    for (let i = 0; i < elements.length; i += 1) {
      const src = elements[i].getAttribute(attribute);
      const newSrc = src.replace(regex, '');
      elements[i].setAttribute(attribute, replacements[newSrc]);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const removeLinks = (html) => {
    const links = html.getElementsByTagName('a');
    for (let i = 0; i < links.length; i += 1) {
      links[i].removeAttribute('href');
    }
  };

  /**
   * Modifies the stylesheet of the book so that a links don't have styling
   * @param {*} html The html to remove the styling from
   */
  const removeStylingFromLinks = (html) => {
    const links = html.getElementsByTagName('a');
    for (let i = 0; i < links.length; i += 1) {
      links[i].style.color = 'initial';
      links[i].style.backgroundColor = 'initial';
      links[i].style.textDecoration = 'unset';
    }
  };

  /**
   * Replaces the images in the html with the replacement urls
   * @param {*} html The html to replace the images in
   */
  const replaceImagesUrl = async (html) => {
    const imgs = html.getElementsByTagName('img');
    const images = html.getElementsByTagName('image');
    const replacementUrls = await getReplacementUrls();
    await replaceElementAttributes(imgs, replacementUrls, 'src');
    await replaceElementAttributes(images, replacementUrls, 'xlink:href');
  };

  /**
   * Adds a stylesheet to the document
   * @param {*} styleSheet The stylesheet to add to the document
   */
  const addStyleSheet = (styleSheet) => {
    const { head } = document;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = styleSheet;
    head.appendChild(link);
  };

  /**
   * Gets the stylesheets from the book object and adds them to the document
   */
  // eslint-disable-next-line no-unused-vars
  const setStyleSheets = async () => {
    const styleSheets = Object.keys(ebook.archive.urlCache).filter((key) => key.endsWith('.css'));
    styleSheets.forEach((styleSheet) => {
      addStyleSheet(ebook.archive.urlCache[styleSheet]);
    });
  };

  const removeStyleSheets = () => {
    const { head } = document;
    const links = head.getElementsByTagName('link');
    for (let i = 0; i < links.length; i += 1) {
      head.removeChild(links[i]);
    }
  };

  const hyphenateText = async (contents) => {
    setIsLoading(true);
    const allElements = contents.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span');
    for (let i = 0; i < allElements.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      allElements[i].innerText = await hyphenateHTMLSync(allElements[i].innerText, { minWordLength: 1 });
    }
  };

  const formatBook = async () => {
    let html = '';

    await ebook.ready;
    const spine = await ebook.loaded.spine;
    const promise = spine.items.map(async (section) => {
      const sectionObj = await ebook.section(section.href);
      const contents = await sectionObj.load(ebook.load.bind(ebook));
      await replaceImagesUrl(contents);
      removeLinks(contents);
      removeStylingFromLinks(contents);
      await hyphenateText(contents);
      setIsLoading(false);

      // Remove the spaces
      const filteredContents = contents.innerHTML.replace(/&nbsp;/g, '');
      html += filteredContents;
    });

    await Promise.all(promise);
    return html;
  };

  useEffect(() => {
    if (ebook) {
      const generateHTMLBook = async () => {
        await ebook.opened;
        await setStyleSheets();
        const html = await formatBook();
        setHTMLBook(html);
      };
      generateHTMLBook();
      setTimeout(() => {
        window.scrollTo(0, scrollPositionDBState);
        setIsLoading(false);
      }, 500);
    }
    return () => {
      removeStyleSheets();
    };
  }, [ebook]);

  return (
    <div id="reader-confirmed">
      {showModal && (
      <ScreenNotification
        onClick={screenNotificationHandler}
        text="Het boek dat u aan het lezen was is zojuist verwijderd."
      />
      )}
      {isLoading && <Loader />}
      <IconButton
        to="/bibliotheek"
        id="reader-back-button"
        style={{ backgroundColor: accentColorHexFormat, color: accentColorTailwindFormat !== 'white' ? 'white' : 'black' }}
        icon={<ChevronLeft className="h-12 w-12 absolute 2xl:left-6 bottom-6 right-6" />}
        color={accentColorTailwindFormat}
        onClick={() => {
          removeStyleSheets();
        }}
      />
      {isHelper && (
      <div className="fixed z-40">
        <OnClickButton
          id="color-config-button"
          type="button"
          disabled={false}
          onClick={() => toggleRender('color')}
          styleString={`relative top-24 z-40 flex justify-center items-center rounded-r-md absolute
          bg-${accentColorTailwindFormat}-500 h-10 w-10 hover:w-11 hover:brightness-90 duration-300`}
          value={<PenTool size={20} className={`text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'}`} />}
        />
        <OnClickButton
          id="text-config-button"
          type="button"
          disabled={false}
          onClick={() => toggleRender('text')}
          styleString={`text-config-button relative bg-${accentColorTailwindFormat}-500 rounded-r-md absolute 
          top-0 h-10 w-10 hover:w-11 hover:brightness-90 duration-300`}
          value={(
            <div
              id="text-config-button-value"
              className={`font-rockwell text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'} text-xl`}
            >
              T
            </div>
          )}
        />
      </div>
      )}
      {isHelper && changeTextToggled && (
      <LayoutContainer
        title="Tekst Configuratie"
        icon={<Icon icon={<p className="absolute font-rockwell text-white left-4 top-3 text-3xl">T</p>} />}
      >
        <ChangeTextLayout
          onFontSizeChange={async (newFontSize) => {
            await changeStyleInDb('fontSize', newFontSize, 'px');
          }}
          onLineHeightChange={async (newLineHeight) => {
            await changeStyleInDb('lineHeight', newLineHeight, '%');
          }}
          onLetterSpacingChange={async (newLetterSpacing) => {
            const actualLetterSpacing = (newLetterSpacing / 1000).toString();
            await changeStyleInDb('letterSpacing', actualLetterSpacing, 'em');
          }}
          onFontFamilyChange={async (newFontFamily) => {
            await changeStyleInDb('fontFamily', newFontFamily, '');
          }}
          defaultFontSize={fontSize.replace(/[^0-9]/g, '')}
          defaultLineHeight={lineHeight.replace(/[^0-9]/g, '')}
          defaultLetterSpacing={(letterSpacing.replace(/[^.0-9]/g, '')) * 1000}
          defaultFontFamily={fontFamily}
          fontFamilyOptions={['Overpass', 'Source Serif Pro', 'Atkinson Hyperlegible', 'Comic Neue', 'KlinicSlab', 'OpenDyslexic']}
        />
      </LayoutContainer>
      )}
      {isHelper && changeColorToggled && (
      <LayoutContainer
        title="Kleurenschema"
        icon={<Icon icon={<PenTool className="absolute font-rockwell text-white left-4 top-3 text-3xl" />} />}
      >
        <ChangeColorLayout
          onChange={async (newColors) => {
            await changeStyleInDb('backgroundColor', newColors.backgroundColor, '');
            await changeStyleInDb('textColor', newColors.textColor, '');
            await changeStyleInDb('accentColor', JSON.stringify(newColors.accentColor), '');
          }}
          defaultValue={{
            textColor,
            backgroundColor,
            accentColor: {
              tailwindFormat: accentColorTailwindFormat,
              hexFormat: accentColorHexFormat,
            },
          }}
        />
      </LayoutContainer>
      )}
      <div
        style={{
          backgroundColor,
          color: textColor,
          fontSize,
          fontFamily,
          lineHeight,
          letterSpacing,
          wordWrap: fontSizetoNumber <= 300 ? 'normal' : 'break-word',
        }}
        id="reader123"
        className="reader px-11 overflow-hidden"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: HTMLBook }}
      />
    </div>
  );
}

export default Book;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, PenTool } from 'react-feather';
import ePub from 'epubjs';
import WebFont from 'webfontloader';
import { hyphenateHTMLSync } from 'hyphen/nl';
import { getLayoutActionAsync } from '../actions/userActionCreator';
import { setFontSizeAction } from '../actions/userActionCreator';
import { setLineHeightAction } from '../actions/userActionCreator';
import { setBackgroundColorAction } from '../actions/userActionCreator';
import { setTextColorAction } from '../actions/userActionCreator';
import { setAccentColorTailwindFormatAction } from '../actions/userActionCreator';
import { setAccentColorHexFormatAction } from '../actions/userActionCreator';
import { setFontFamilyAction } from '../actions/userActionCreator';
import { setLetterSpacingAction } from '../actions/userActionCreator';
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
// import LocalBook from '../ebooks/AAiW.epub';
import LocalBook from '../ebooks/test3.epub';


const serverURL = process.env.REACT_APP_API_URL;

function Book() {
  const [HTMLBook, setHTMLBook] = useState('');
  const {
    fontSize, lineHeight, backgroundColor, textColor,
    accentColorTailwindFormat, accentColorHexFormat, fontFamily, letterSpacing,
  } = useSelector((state) => state.users);

  console.log('fontSize', fontSize);

  
  const dispatch = useDispatch();

  const scrollPosition = useScrollPosition();
  const navigate = useNavigate();


  const [fontSizeState, setFontSizeState] = useState(fontSize);
  const [lineHeightState, setLineHeightState] = useState(lineHeight);
  const [backgroundColorState, setBackgroundColorState] = useState(backgroundColor);
  const [textColorState, setTextColorState] = useState(textColor);
  const [accentColorTailwindFormatState, setAccentColorTailwindFormatState] = useState(accentColorTailwindFormat);
  const [accentColorHexFormatState, setAccentColorHexFormatState] = useState(accentColorHexFormat);
  const [fontFamilyState, setFontFamilyState] = useState(fontFamily);
  const [letterSpacingState, setLetterSpacingState] = useState(letterSpacing);

  console.log('fontSizeState', fontSizeState);

  const [isLoading, setIsLoading] = useState(true);
  const [ebook, setEBook] = useState(undefined);
  const [changeTextToggled, setChangeTextToggled] = useState(false);
  const [changeColorToggled, setChangeColorToggled] = useState(false);
  const isHelper = localStorage.getItem('isHelper');


  useEffect(() => {
    const book = new ePub(LocalBook);
    book.loaded.navigation.then(() => {
      setEBook(book);
    });
  }, []);

  useEffect(() => {
    dispatch(setFontSizeAction(fontSizeState  + 'px'));
    dispatch(setLineHeightAction(lineHeightState));
    dispatch(setBackgroundColorAction(backgroundColorState));
    dispatch(setTextColorAction(textColorState));
    dispatch(setAccentColorTailwindFormatAction(accentColorTailwindFormatState));
    dispatch(setAccentColorHexFormatAction(accentColorHexFormatState));
    dispatch(setFontFamilyAction(fontFamilyState));
    dispatch(setLetterSpacingAction(letterSpacingState + 'px'));
  }, [fontSizeState, lineHeightState, backgroundColorState, textColorState, accentColorTailwindFormatState, accentColorHexFormatState, fontFamilyState, letterSpacingState]);
  


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
    }
    return () => {
      removeStyleSheets();
    };
  }, [ebook]);

  return (
    <div id="reader-confirmed">
      {isLoading && <Loader />}
      <IconButton
        to="/"
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
          style={{ backgroundColor: accentColorHexFormat, color: accentColorTailwindFormat !== 'white' ? 'white' : 'black' }}
          onClick={() => toggleRender('color')}
          styleString={`relative top-24 z-40 flex justify-center items-center rounded-r-md absolute
          bg-${accentColorTailwindFormat}-500 h-10 w-10 hover:w-11 hover:brightness-90 duration-300`}
          value={<PenTool size={20} className={`text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'}`} />}
          color={accentColorTailwindFormat}
        />
        <OnClickButton
          id="text-config-button"
          type="button"
          disabled={false}
          style={{ backgroundColor: accentColorHexFormat, color: accentColorTailwindFormat !== 'white' ? 'white' : 'black' }}
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
          onFontSizeChange={setFontSizeState}
          onLineHeightChange={setLineHeightState}
          onLetterSpacingChange={setLetterSpacingState}
          onFontFamilyChange={setFontFamilyState}

          defaultFontSize={fontSize.replace(/[^0-9]/g, '')}
          defaultLineHeight={lineHeight.replace(/[^0-9]/g, '')}
          defaultLetterSpacing={(letterSpacing.replace(/[^.0-9]/g, ''))}
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
            setBackgroundColorState(newColors.backgroundColor);
            setTextColorState(newColors.textColor);
            setAccentColorTailwindFormatState(newColors.accentColor.tailwindFormat);
            setAccentColorHexFormatState(newColors.accentColor.hexFormat);
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
        // style={{
        //   backgroundColor,
        //   color: textColor,
        //   fontSize: fontSize,
        //   fontFamily: fontFamilyState,
        //   lineHeight: `${lineHeightState}%`,
        //   letterSpacing: `${letterSpacingState}`,
        //   wordWrap: fontSizeState <= 300 ? 'normal' : 'break-word',
        // }}

        style={{
          backgroundColor,
          color: textColor,
          fontSize: fontSize,
          fontFamily: fontFamily,
          lineHeight: `${lineHeight}%`,
          letterSpacing: letterSpacing,
          wordWrap: fontSize <= 300 ? 'normal' : 'break-word',
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

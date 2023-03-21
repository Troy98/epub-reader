import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, PenTool } from 'react-feather';
import ePub from 'epubjs';
import WebFont from 'webfontloader';
import InlineView from 'epubjs/lib/managers/views/inline';
import { getLayoutActionAsync } from '../actions/userActionCreator';
import IconButton from '../components/IconButton';
import OnClickButton from '../components/OnClickButton';
import '../Reader.css';
import '../fonts/fonts.css';
import Loader from '../components/Loader';
import ScreenNotification from '../components/ScreenNotification';
import useScrollPosition from '../hooks/useScrollPosition';
import useWindowSize from '../hooks/useWindowSize';
import ChangeTextLayout from '../components/LayoutPanels/ChangeTextLayout';
import ChangeColorLayout from '../components/LayoutPanels/ChangeColorLayout';
import LayoutContainer from '../components/LayoutPanels/LayoutContainer';
import Icon from '../components/Panel/Icon';

const serverURL = process.env.REACT_APP_API_URL;

function Reader() {
  const {
    fontSize, lineHeight, backgroundColor, textColor,
    accentColorTailwindFormat, accentColorHexFormat, fontFamily,
  } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const scrollPosition = useScrollPosition();
  const windowSize = useWindowSize();
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
  const bookContainer = useRef(null);
  const isHelper = localStorage.getItem('isHelper');

  // const params = URLSearchParams && new URLSearchParams(document.location.search.substring(1));
  // const currentSectionIndex = (params && params.get('loc')) ? params.get('loc') : undefined;

  useEffect(() => {
    setScrollPositionState(scrollPosition);
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

  // eslint-disable-next-line max-len
  const applyTextLayout = async (newFontSize, newLineHeight, newFontFamily, newBackgroundColor, newTextColor) => {
    document.getElementById('root').style.setProperty('--background-color', newBackgroundColor);
    if (ebook) {
      await ebook.rendition.themes.default({
        '.epub-container *': {
          'font-size': `${newFontSize}`,
          'line-height': `${newLineHeight}`,
          'background-color': `${newBackgroundColor}`,
          color: `${newTextColor}`,
          'font-family': `${newFontFamily}`,
        },
        '.selectedFont': {
          'font-family': `${newFontFamily}`,
        },
      });
    }
  };

  const renderBook = async () => {
    const rendition = await ebook.renderTo(bookContainer.current, {
      manager: 'continuous',
      flow: 'scrolled',
      width: '100%',
      height: '100%',
      view: InlineView,
      spread: 'none',
    });

    if (await ebook.ready) {
      dispatch(getLayoutActionAsync());
      await applyTextLayout(fontSize, lineHeight, fontFamily, backgroundColor, textColor);
      const lastSectionIndex = ebook.spine.items
        ? ebook.spine.items.length - 1
        : 0;

      await rendition.display(lastSectionIndex);

      setTimeout(() => {
        window.scrollTo(0, scrollPositionDBState);
        setIsLoading(false);
      }, 500);
    }

    rendition.on('rendered', () => {
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
    setIsLoading(true);
    if (ebook) {
      const render = async () => {
        await renderBook();
      };
      render()
        .catch(/* Displaying an error to the user has no effect */);
    }
  }, [ebook, windowSize]);

  useEffect(() => {
    const applyLayout = async () => {
      await applyTextLayout(fontSize, lineHeight, fontFamily, backgroundColor, textColor);
    };
    applyLayout()
      .catch(/* Displaying an error to the user has no effect */);
  }, [fontSize, lineHeight, fontFamily, backgroundColor, textColor]);

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

  return (
    <>
      {showModal && (
      <ScreenNotification
        onClick={screenNotificationHandler}
        text="Het boek dat u aan het lezen was is zojuist verwijderd."
      />
      )}
      {isLoading && <Loader />}
      <IconButton
        to="/bibliotheek"
        icon={<ChevronLeft className="h-12 w-12 absolute 2xl:left-6 bottom-6 right-6" />}
      />
      {isHelper && (
        <div className="fixed z-40">
          <OnClickButton
            type="button"
            disabled={false}
            onClick={() => toggleRender('color')}
            styleString={`relative top-24 z-40 flex justify-center items-center bg-${accentColorTailwindFormat}-500 
            rounded-r-md absolute h-10 w-10 hover:w-11 hover:brightness-90 duration-300`}
            value={<PenTool size={20} className={`text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'}`} />}
          />
          <OnClickButton
            type="button"
            disabled={false}
            onClick={() => toggleRender('text')}
            styleString={`relative bg-${accentColorTailwindFormat}-500 rounded-r-md 
            absolute top-0 h-10 w-10 hover:w-11 hover:brightness-90 duration-300`}
            value={<div className={`font-rockwell text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'} text-xl`}>T</div>}
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
            defaultFontSize={fontSize.replace(/[^0-9]/g, '')}
            defaultLineHeight={lineHeight.replace(/[^0-9]/g, '')}
            onFontFamilyChange={(newFontFamily) => { changeStyleInDb('fontFamily', newFontFamily, ''); }}
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
        id="viewer"
        ref={(ref) => { bookContainer.current = ref; }}
      />
    </>
  );
}

export default Reader;

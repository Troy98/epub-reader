import React, {
  createRef, useEffect, useRef, useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { useDispatch, useSelector } from 'react-redux';
import LanguageDetect from 'languagedetect';
import { Link, useNavigate } from 'react-router-dom';
import Hyphenated from 'react-hyphen';
import nl from '@digitalartlab/hyphenated-nl';
import { Volume2, Info } from 'react-feather';
import { useSpeechSynthesis } from 'react-speech-kit';
import toastr from 'toastr';
import { getEBooksActionAsync } from '../actions/ebookActionCreator';
import { getLayoutActionAsync } from '../actions/userActionCreator';
import Header from '../components/Header';
import TextButton from '../components/TextButton';
import ScreenNotification from '../components/ScreenNotification';
import ModalContainer from '../components/ModalContainer';
// eslint-disable-line import/no-default-export
import UploadModal from '../components/Modals/UploadModal';
import OnClickButton from '../components/OnClickButton';
// CSS For swiper
import 'swiper/css'; // eslint-disable-line import/no-unresolved
import 'swiper/css/pagination'; // eslint-disable-line import/no-unresolved
import 'swiper/css/navigation'; // eslint-disable-line import/no-unresolved

const serverURL = process.env.REACT_APP_API_URL;

const showNotification = (bookID, deletedBookID) => (bookID === deletedBookID);

function Library() {
  const {
    speak, supported, voices, cancel,
  } = useSpeechSynthesis();
  const languageDetector = new LanguageDetect();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ebooks, deletedEbookID } = useSelector((state) => state.ebooks);
  const [ebookCount, setEbookCount] = useState(0);
  const [bookID, setBookID] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    accentColorTailwindFormat, lineHeight, fontFamily,
    accentColorHexFormat, backgroundColor, textColor, fontSize, letterSpacing,
  } = useSelector((state) => state.users);
  const libraryRef = createRef();
  const swiperRef = useRef();
  const isHelper = localStorage.getItem('isHelper');

  useEffect(() => {
    if (bookID && deletedEbookID && !isHelper) {
      if (showNotification(bookID, deletedEbookID)) {
        setShowModal(true);
        setBookID('');
      }
    }
  }, [bookID, deletedEbookID]);

  useEffect(() => {
    if (ebooks) {
      setBookID(ebooks[0]?._id);
    }
    if (ebookCount < ebooks.length && ebookCount !== 0) {
      swiperRef.current.swiper.slideTo(ebooks.length + 1, 0);
    }
    setEbookCount(ebooks.length);
  }, [ebooks]);

  useEffect(() => {
    dispatch(getEBooksActionAsync());
    dispatch(getLayoutActionAsync());
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  useEffect(() => {
    document.body.style.setProperty('--accent-color', accentColorHexFormat);
  }, [accentColorHexFormat]);

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleRemoveBookClick = async (ebookId) => {
    try {
      const result = await fetch(`${serverURL}/api/v1/helper/books/${ebookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (result.status === 200) {
        toastr.success('Boek verwijderd');
        dispatch(getEBooksActionAsync());
      }
    } catch { /* Displaying an error to the user has no effect */ }
  };

  const determineSpeechLanguage = (languageArray) => {
    // Remove all languages that are not dutch or english
    const newLanguageArray = languageArray.filter((language) => language[0] === 'dutch' || language[0] === 'english');

    // Default language if no dutch or english is found
    if (newLanguageArray.length === 0) {
      return 'dutch';
    }
    // Return the language that has the highest probability of being correct
    return newLanguageArray[0][0];
  };

  const handleSwitchRole = () => {
    if (isHelper) {
      localStorage.removeItem('isHelper');
    } else {
      localStorage.setItem('isHelper', true);
    }
    navigate('/bibliotheek');
  };

  return (
    <div id="library" className="flex flex-col h-screen w-full overflow-hidden" ref={libraryRef}>
      {showModal && (
        <ScreenNotification
          onClick={() => setShowModal(false)}
          text="Het boek dat u aan het lezen was is zojuist verwijderd."
        />
      )}
      <Header handleSwitchRole={handleSwitchRole} handleUploadClick={handleUploadClick} />
      {ebooks.length > 0 ? (
        <Swiper
          id="swiper"
          ref={swiperRef}
          centeredSlides
          pagination={{
            dynamicBullets: true,
          }}
          onSlideChange={(swiper) => setBookID(swiper.slides[swiper.activeIndex].dataset.id)}
          navigation
          modules={[Pagination, Navigation]}
          className="w-full h-full flex-1"
        >
          {ebooks.map((ebook) => (
            <SwiperSlide
              key={ebook._id}
              className="flex justify-center items-center w-full h-full pt-5 swiper-slide"
              data-id={ebook._id}
              data-title={ebook.title}
            >
              <div
                className="flex flex-col z-10 gap-y-4 w-full h-full items-center overflow-y-auto justify-start"
                id="book-container"
                data-id={ebook._id}
              >
                <Link className="flex flex-col gap-y-4 justify-center sm:px-10 w-full h-fit" id="book-link" to={`/readerhtml/${ebook._id}`}>
                  <div className="w-full flex justify-center">
                    <img src={`${serverURL}/${ebook.coverUrl}`} className="object-cover rounded-xl h-32 xl:h-56 pointer-events-none" alt="cover" />
                  </div>
                  <Hyphenated language={nl}>
                    <div
                      className="w-full h-full gap-y-6 flex flex-col items-center
                      text-justify xl:text-center justify-center overflow-hidden"
                      style={{ color: textColor }}
                    >
                      <h1
                        id="bookTitle"
                        className="selectedFont font-bold select-none w-full h-full text-center"
                        style={{
                          fontSize: `max(60px, ${fontSize})`, fontFamily, lineHeight, letterSpacing,
                        }}
                      >
                        {ebook.title}
                      </h1>
                      <h2
                        className="selectedFont font-light select-none pb-3 w-full h-full text-center"
                        style={{
                          fontSize: `max(40px, ${fontSize})`, fontFamily, lineHeight, letterSpacing,
                        }}
                      >
                        {ebook.author}
                      </h2>
                    </div>
                  </Hyphenated>
                </Link>
                {isHelper && (
                  <TextButton
                    text="Verwijderen"
                    styles="mb-16 !bg-red-500 hover:bg-red-600 select-none focus:ring-red-600"
                    onClick={() => handleRemoveBookClick(ebook._id)}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div id="noBooks" className="flex flex-col h-full min-h-screen z-10 gap-y-10  items-center overflow-y-auto justify-start">
          <div className={`rounded-full flex justify-center items-center p-10 
          bg-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-500`}
          >
            <Info size={80} className="stroke-white" strokeWidth={2} />
          </div>
          <Hyphenated language={nl}>
            <h1
              className="text-4xl selectedFont text-center"
              style={{
                color: textColor, fontSize: `max(60px, ${fontSize})`, lineHeight, fontFamily, letterSpacing,
              }}
            >
              Nog geen boeken in uw bibliotheek
            </h1>
          </Hyphenated>
        </div>
      )}
      {showModal && (
        <ScreenNotification
          onClick={() => setShowModal(false)}
          text="Het boek dat u aan het bekijken was is zojuist verwijderd."
        />
      )}
      {modalOpen && (
        <ModalContainer setModalOpen={setModalOpen}>
          <UploadModal setModalOpen={setModalOpen} />
        </ModalContainer>
      )}
      {supported && (
      <OnClickButton
        type="button"
        onClick={() => {
          cancel();
          const focusedBook = ebooks.find((ebook) => ebook._id === bookID);
          const dutchVoice = voices.find((voice) => voice.lang === 'nl-NL');
          const englishVoice = voices.find((voice) => voice.lang === 'en-US');
          if (focusedBook) {
            const language = determineSpeechLanguage(languageDetector.detect(focusedBook.title));
            const text = `${focusedBook.title}${language === 'dutch' ? ' door ' : ' by '}${focusedBook.author}`;
            speak({
              text,
              voice: language === 'dutch' ? (dutchVoice || englishVoice || voices[0]) : (englishVoice || dutchVoice || voices[0]),
            });
          } else {
            speak({

              text: 'Nog geen boeken in uw bibliotheek',
              voice: dutchVoice || englishVoice || voices[0],
            });
          }
        }}
        styleString={`${isHelper ? 'icon-bottom-left left-0 bottom-0' : 'icon-top-right right-0 top-0'} 
        flex z-20 text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'} 
          w-60 h-60 bg-${accentColorTailwindFormat}-500 fixed p-2`}
        value={<Volume2 className={`h-12 w-12 absolute ${isHelper ? 'bottom-5 left-6' : 'top-6 right-6'}`} />}
        disabled={false}
      />
      )}
    </div>
  );
}

export default Library;

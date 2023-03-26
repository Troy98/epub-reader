import React, {
  createRef, useEffect, useRef, useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { useSelector } from 'react-redux';
import LanguageDetect from 'languagedetect';
import { Link } from 'react-router-dom';
import Hyphenated from 'react-hyphen';
import nl from '@digitalartlab/hyphenated-nl';
import { Volume2 } from 'react-feather';
import { useSpeechSynthesis } from 'react-speech-kit';
import OnClickButton from '../components/OnClickButton';
// import LocalBook from '../ebooks/AAiW.epub';
import LocalBook from '../ebooks/test3.epub';
// CSS For swiper
import ePub from 'epubjs';
import 'swiper/css';
import 'swiper/css/pagination'; 
import 'swiper/css/navigation'; 

function Library() {
  const {
    speak, supported, voices, cancel,
  } = useSpeechSynthesis();
  const languageDetector = new LanguageDetect();
  const [ebooks, setEbooks] = useState([]);
  const [localFontSize, setLocalFontSize] = useState(50);
  const [authorFontSize, setAuthorFontSize] = useState(40);
  const [coverImage, setCoverImage] = useState('');
  const [ebookTitle, setEbookTitle] = useState('');
  const [ebookAuthor, setEbookAuthor] = useState('');
  

  const {
    accentColorTailwindFormat, lineHeight, fontFamily,
    accentColorHexFormat, backgroundColor, textColor, fontSize, letterSpacing,
  } = useSelector((state) => state.users);
  const libraryRef = createRef();
  const swiperRef = useRef();
  const isHelper = localStorage.getItem('isHelper');

  console.log(fontSize)

  useEffect(() => {
    if(fontSize < 60) {
      setLocalFontSize(fontSize)
    } else {
      setLocalFontSize(60)
    }

    if(fontSize < 40) {
      setAuthorFontSize(fontSize)
    } else {
      setAuthorFontSize(40)
    }
  }, [fontSize])



  useEffect(() => {
    if(!isHelper) {
      localStorage.setItem('isHelper', true);
    }
  }, [isHelper]);

  useEffect(() => {
    const book = new ePub(LocalBook);
    book.loaded.navigation.then(() => {
      setEbooks([book]);
      book.coverUrl().then((url) => {
        setCoverImage(url);
      });

      book.loaded.metadata.then((meta) => {
        setEbookTitle(meta.title);
        setEbookAuthor(meta.creator);
      });
    });
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  useEffect(() => {
    document.body.style.setProperty('--accent-color', accentColorHexFormat);
  }, [accentColorHexFormat]);

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
  
  return (
    <div id="library" className="flex flex-col h-screen w-full overflow-hidden" ref={libraryRef}>
      {/* <Header handleSwitchRole={handleSwitchRole} handleUploadClick={handleUploadClick} /> */}
        <Swiper
          id="swiper"
          ref={swiperRef}
          centeredSlides
          pagination={{
            dynamicBullets: true,
          }}
          navigation
          modules={[Pagination, Navigation]}
          className="w-full h-full flex-1"
        >
          {ebooks.map((ebook) => (
            <SwiperSlide
              key={ebook.url.href}
              className="flex justify-center items-center w-full h-full pt-5 swiper-slide"
              data-id={ebook.url.href}
              data-title={ebook.title}
            >
              <div
                className="flex flex-col z-10 gap-y-4 w-full h-full items-center overflow-y-auto justify-start"
                id="book-container"
                data-id={ebook.url.href}
              >
                <Link className="flex flex-col gap-y-4 justify-center sm:px-10 w-full h-fit" id="book-link" to={`/reader`}>
                  <div className="w-full flex justify-center">
                    <img src={coverImage} className="object-cover rounded-xl h-72 xl: pointer-events-none" alt="cover" />
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
                          fontSize: localFontSize, fontFamily, letterSpacing,
                        }}
                      >
                        {ebookTitle}
                      </h1>
                      <h2
                        className="selectedFont font-light select-none pb-3 w-full h-full text-center"
                        style={{
                          fontSize: authorFontSize, fontFamily, letterSpacing,
                        }}
                      >
                        {ebookAuthor}
                      </h2>
                    </div>
                  </Hyphenated>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      {supported && (
      <OnClickButton
        type="button"
        onClick={() => {
          cancel();
          const dutchVoice = voices.find((voice) => voice.lang === 'nl-NL');
          const englishVoice = voices.find((voice) => voice.lang === 'en-US');
          if (ebookTitle && ebookAuthor) {
            const language = determineSpeechLanguage(languageDetector.detect(ebookTitle));
            const text = `${ebookTitle}${language === 'dutch' ? ' door ' : ' by '}${ebookAuthor}`;
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
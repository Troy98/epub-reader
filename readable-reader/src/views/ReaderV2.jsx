import React, {
  useRef,
  useEffect, useState,
} from 'react';
import epubjs from 'epubjs';
import { useParams } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import useScrollPosition from '../hooks/useScrollPosition';
import IconButton from '../components/IconButton';

const serverURL = process.env.REACT_APP_API_URL;

function ReaderV2() {
  const bookContainer = useRef(null);
  const { id } = useParams();
  const [bookUrl, setBookUrl] = useState('');
  const [bookRendition, setBookRendition] = useState(undefined);
  const scrollPosition = useScrollPosition();
  let book;

  useEffect(() => {
    if (bookRendition) {
      bookRendition.on('', (location) => {
        console.log(location);
        console.log(location.start.cfi);
      });
    }
  }, [scrollPosition]);

  const fetchBook = async () => {
    fetch(`${serverURL}/api/v1/reader/books/${id}`, {
      method: 'GET',
      credentials: 'include',
    }).then((response) => {
      response.json().then((data) => {
        setBookUrl(`${serverURL}/${data.path}`);
      });
    }).catch(/* Displaying an error to the user has no effect */);
  };

  useEffect(() => {
    fetchBook().then(() => {
      book = epubjs(bookUrl);

      const rendition = book.renderTo(bookContainer.current, {
        manager: 'continuous',
        flow: 'scrolled',
        width: '100%',
        height: '100%',
      });

      setBookRendition(rendition);

      book.ready.then(() => {
        const lastSectionIndex = book.spine.items
          ? book.spine.items.length - 1
          : 0;

        rendition.display(lastSectionIndex);
      });
    });

    return () => {
      if (book) {
        book.destroy();
      }
    };
  }, []);

  return (
    <>
      <IconButton
        to="/bibliotheek"
        icon={<ChevronLeft className="h-12 w-12 absolute top-12 right-12" />}
      />

      <div
        id="reader"
        className="pt-5 epubviewer"
        ref={(ref) => { bookContainer.current = ref; }}
      />
    </>

  );
}

export default ReaderV2;

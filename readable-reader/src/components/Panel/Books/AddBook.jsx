import React, { useEffect, useState } from 'react';
import {
  Check, Loader, Paperclip, Plus,
} from 'react-feather';
import ePub from 'epubjs';
import Icon from '../Icon';

function AddBook() {
  const [error, setError] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const serverURL = process.env.REACT_APP_API_URL;

  function blobToBase64(blob) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // return the title, author and coverURL form epub file
  const returnResponseBody = async (EBook) => {
    const book = ePub(EBook);

    // Get the book content
    const bookContent = await book.loaded.metadata;
    const { title } = bookContent;
    const author = bookContent.creator;

    // Get the cover image
    const coverURL = await book.coverUrl();

    // Get the cover image as a blob
    const response = await fetch(coverURL);
    const responseToBlob = await response.blob();
    const base64Cover = await blobToBase64(responseToBlob);

    return {
      title,
      author,
      base64Cover,
    };
  };
  // upload the EBook
  const uploadEBook = async (EBook) => {
    const formData = new FormData();
    formData.append('file', EBook);
    setError('');

    const data = await returnResponseBody(EBook);
    formData.append('data', JSON.stringify(data));

    const options = {
      method: 'POST',
      body: formData,
      credentials: 'include',
    };

    setProcessing(true);
    try {
      const response = await fetch(`${serverURL}/api/v1/helper/books`, options);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      return setUploaded(true);
    } catch (err) {
      const message = JSON.parse(err.message);
      return setError(message.error);
    } finally {
      setProcessing(false);
    }
  };

  // setFile in state
  const handleFileInputChange = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    // Check if input is empty
    if (e.target.files.length === 0) {
      return setError('Veld mag niet leeg zijn');
    }

    // Check if file type is right
    if (file.type && file.type !== 'application/epub+zip') {
      return setError('Bestand formaat is niet juist. Formaat moet ".epub" zijn');
    }

    // Check if file too big. 104857600 (Binary) = 100MB
    if (file.size >= 104857600) {
      return setError('Bestand moet kleiner zijn dan 100MB');
    }

    return uploadEBook(file);
  };

  useEffect(() => {
    if (uploaded) {
      setTimeout(() => setUploaded(false), 3000);
    }
  }, [uploaded]);

  const isFileUploaded = !processing && uploaded;
  const isFileProcessing = !processing && !uploaded;

  return (
    <div className="w-full flex flex-col h-full rounded-xl bg-white overflow-hidden relative">
      <div className="grid grid-cols-6">
        <div className="relative h-10 w-10">
          <Icon icon={<Plus className="absolute text-white left-3.5 top-3.5 text-3xl" />} />
        </div>
      </div>
      <div className="p-4 pt-0 h-full">
        <form className="flex flex-col items-center justify-center gap-y-4 w-full h-full">
          <div className="flex flex-col gap-y-2 justify-end content-center items-center w-full h-2/3">
            <div className={`relative flex text-transparent shadow-inner justify-center w-20 h-20 ${processing && 'hover:brightness-100'} ${uploaded ? 'bg-green-100 shadow-green-300' : 'bg-accent-100 shadow-accent-300 hover:brightness-90'} rounded-xl`}>
              {isFileProcessing ? (
                <>
                  <input type="file" name="file" id="upload_file" onChange={handleFileInputChange} className="absolute cursor-pointer opacity-0 w-full h-full" />
                  <Paperclip className="pointer-events-none absolute w-8 h-8 top-1/2 -translate-y-1/2 text-accent-500" />
                </>
              ) : (
                processing ? (
                  <Loader className="animate-spin self-center text-black" />
                ) : (
                  <Check className="pointer-events-none absolute w-8 h-8 top-1/2 -translate-y-1/2 text-green-500" />
                )
              )}
            </div>
            {isFileUploaded ? (
              <p className="text-green-500 text-center">Bestand succesvol geüpload</p>
            ) : (
              processing ? (
                <p className="text-center">Bestand wordt geüpload</p>
              ) : (
                <div className="flex gap-x-1">
                  Voeg hierboven het
                  <span className="text-accent-500">EPub Bestand</span>
                  toe
                </div>
              )
            )}
            <div className={`h-2 text-sm text-red-400 mt-2 pointer-events-none select-none opacity-0 font-bold ${error && 'opacity-100'}`}>{error || 'Geen problemen'}</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;

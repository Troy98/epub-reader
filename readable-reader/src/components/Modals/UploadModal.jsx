import React, { useEffect, useState } from 'react';
import { Plus, X } from 'react-feather';
import toastr from 'toastr';
import LocalUpload from './LocalUpload';
import DropboxUpload from './DropboxUpload';
import Icon from '../Panel/Icon';
import uploadEBook from '../../utils/uploadEpub';

function UploadModal(props) {
  const { setModalOpen } = props;

  const [error, setError] = useState('');

  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [usedMethod, setUsedMethod] = useState();

  const onSuccess = async (files) => {
    const file = files[0].link;
    const { name } = files[0];

    let book;

    try {
      book = await fetch(file);
    } catch (err) {
      toastr.error('Kon het bestand niet ophalen');
    }

    if (!book) return setError('Er is iets fout gegaan. Probeer het opnieuw.');

    const blobFile = await book.blob();
    const result = new File([blobFile], name, { type: 'application/epub+zip' });
    setProcessing(true);

    return uploadEBook(
      result,
      () => setUploaded(true),
      (err) => setError(JSON.parse(err.message).error),
      () => setProcessing(false),
    );
  };

  // setFile in state
  const handleFileInputChange = async (files) => {
    const file = files[0];
    // Check if input is empty
    if (files.length === 0) {
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

    setError('');
    setProcessing(true);
    return uploadEBook(
      file,
      () => setUploaded(true),
      (err) => setError(JSON.parse(err.message).error),
      () => setProcessing(false),
    );
  };

  useEffect(() => {
    if (uploaded) {
      setTimeout(() => {
        setUploaded(false);
        setUsedMethod(undefined);
      }, 1500);
    }
  }, [uploaded]);

  return (
    <div id="upload-modal" className="z-50 w-full h-full flex flex-col lg:rounded-xl bg-white overflow-hidden relative">
      <div className="grid grid-cols-6">
        <div className="relative h-10 w-10">
          <Icon styles="w-56 h-56" icon={<Plus size={40} className="absolute text-white left-6 top-6" />} />
        </div>
        <div className="col-start-6 justify-end items-center p-2 flex lg:hidden w-full h-full">
          <X onClick={() => setModalOpen(false)} size={40} strokeWidth={1} />
        </div>
      </div>
      <div className="p-8 pt-0 lg:pt-16 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center gap-y-4 w-full h-full">
          <DropboxUpload
            processing={processing}
            uploaded={uploaded}
            usedMethod={usedMethod}
            setUsedMethod={setUsedMethod}
            handleFileInputChange={onSuccess}
          />
          <LocalUpload
            processing={processing}
            uploaded={uploaded}
            usedMethod={usedMethod}
            setUsedMethod={setUsedMethod}
            handleFileInputChange={handleFileInputChange}
          />
        </div>
        <div
          id="upload-error"
          className={`h-6 text-center text-sm text-red-400 mt-2 pointer-events-none select-none font-bold 
        ${error ? 'visible' : 'invisible'}`}
        >
          {<span id="upload-error">{error}</span> || 'Geen problemen'}
        </div>
      </div>
    </div>
  );
}

export default UploadModal;

import React from 'react';
import DropboxChooser from 'react-dropbox-chooser';
import { useSelector } from 'react-redux';
import { Check, Loader } from 'react-feather';
// import Dropbox from '../Icons/Dropbox';

const APP_KEY = process.env.REACT_APP_DROPBOX_KEY;

function DropboxUpload(props) {
  const {
    processing, uploaded, handleFileInputChange, setUsedMethod, usedMethod,
  } = props;
  const { accentColorTailwindFormat } = useSelector((state) => state.users);

  const isFileUploaded = !processing && uploaded && usedMethod === 'dropbox';
  const isFileProcessing = processing && !uploaded && usedMethod === 'dropbox';
  const handleUpload = (files) => {
    setUsedMethod('dropbox');
    handleFileInputChange(files);
  };

  return (
    <div className="flex justify-center w-full h-full">
      <div className="flex flex-col gap-y-2 justify-center content-center items-center">
        <div
          className={`relative overflow-hidden flex text-transparent shadow-inner justify-center w-24 h-24 sm:w-32 sm:h-32 3xl:w-44 3xl:h-44 
          ${processing && 'hover:brightness-100'} ${isFileUploaded ? 'bg-green-100 shadow-green-300'
            : `bg-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-100 
            shadow-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-300 
            transition-all hover:brightness-90`} rounded-xl`}
        >
          {(isFileProcessing && isFileUploaded || !isFileProcessing && !isFileUploaded) ? (
            <>
              {(processing || uploaded) && (<div id="dropbox-uploading" className="absolute z-20 top-0 left-0 w-full h-full bg-black/70" />)}
              <DropboxChooser
                appKey={APP_KEY}
                success={handleUpload}
                linkType="direct"
                extensions={['.epub']}
                folderselect
                multiselect
              >
                <button id="dropbox-upload" aria-label="dropbox-label" className="w-full h-full absolute top-0 left-0" />
              </DropboxChooser>
              <Dropbox
                className={`pointer-events-none absolute w-12 h-12 top-1/2 -translate-y-1/2 
                fill-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-500`}
              />
            </>
          ) : (
            isFileUploaded ? (
              <Check className="pointer-events-none absolute w-8 h-8 top-1/2 -translate-y-1/2 text-green-500" />
            ) : (
              <Loader className="animate-spin self-center text-black" />
            )
          )}
        </div>
        {isFileUploaded ? (
          <p className="text-green-500 text-xl text-center">Bestand geüpload</p>
        ) : (
          isFileProcessing ? (
            <p className="text-center text-xl">Uploaden...</p>
          ) : (
            <div className="flex text-xl gap-x-1">
              Dropbox
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default DropboxUpload;

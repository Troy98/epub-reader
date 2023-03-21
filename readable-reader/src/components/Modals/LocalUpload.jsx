import React from 'react';
import { Check, Loader, Paperclip } from 'react-feather';
import { useSelector } from 'react-redux';

function LocalUpload(props) {
  const {
    processing, uploaded, handleFileInputChange, setUsedMethod, usedMethod,
  } = props;
  const { accentColorTailwindFormat } = useSelector((state) => state.users);

  const isFileUploaded = !processing && uploaded && usedMethod === 'local';
  const isFileProcessing = processing && !uploaded && usedMethod === 'local';

  const handleUpload = (e) => {
    setUsedMethod('local');
    handleFileInputChange(e.target.files);
  };

  return (
    <form className="flex justify-center w-full h-full">
      <div className="flex flex-col gap-y-2 justify-center content-center items-center">
        <div
          className={`relative flex overflow-hidden text-transparent shadow-inner justify-center w-24 h-24 sm:w-32 sm:h-32 3xl:w-44 3xl:h-44 
          ${processing && 'hover:brightness-100'} ${isFileUploaded ? 'bg-green-100 shadow-green-300'
            : `bg-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-100 
            shadow-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-300 hover:brightness-90`} rounded-xl`}
        >
          {(isFileProcessing && isFileUploaded || !isFileProcessing && !isFileUploaded) ? (
            <>
              {(processing || uploaded) && (<div id="local-uploading" className="absolute z-20 top-0 left-0 w-full h-full bg-black/70" />)}
              <input
                type="file"
                name="file"
                id="upload_file"
                onChange={handleUpload}
                className="absolute cursor-pointer opacity-0 w-full h-full"
              />
              <Paperclip
                className={`pointer-events-none absolute w-12 h-12 top-1/2 -translate-y-1/2 
                text-${accentColorTailwindFormat !== 'white' ? accentColorTailwindFormat : 'accent'}-500`}
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
          <p id="upload_success" className="text-green-500 text-xl text-center">Bestand geüpload</p>
        ) : (
          isFileProcessing ? (
            <p className="text-center text-xl">Uploaden...</p>
          ) : (
            <div className="flex text-xl gap-x-1">
              Mijn bestanden
            </div>
          )
        )}
      </div>
    </form>
  );
}

export default LocalUpload;

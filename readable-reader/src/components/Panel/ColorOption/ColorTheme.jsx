import React from 'react';
import { Edit2 } from 'react-feather';
import ColorOptions from './ColorOptions';
import Icon from '../Icon';

function ColorTheme() {
  return (
    <div className="w-full flex flex-col h-full rounded-xl bg-white overflow-hidden relative">
      <div className="absolute w-full h-full z-10 bg-gray-500/80" />
      <div className="grid grid-cols-8">
        <div className="relative h-0">
          <Icon icon={<Edit2 className="relative text-white left-3 top-4" />} />
        </div>
        <div className="col-span-7 pt-2 pl-2 sm:pl-3 lg:pl-6 xl:pl-0">
          <div className="pl-2 sm:p-0 font-bold">
            Kleurenschema
          </div>
        </div>
      </div>
      <div className="grid items-center justify-between md:grid-cols-5 p-4 gap-x-5">
        <ColorOptions />
        <div className="rounded-xl mt-4 md:mt-0 col-span-2 p-3 bg-black text-white">
          <span className="text-white text-xs italic">
            Mr. and Mrs. Dursley, of number four, Privet Drive, were
            proud to say that they were perfectly normal, thank
            you very much. They were the last people you&apos;d expect to be in-
            volved in anything strange or mysterious, because they just didn&apos;t
            hold with such nonsense.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ColorTheme;

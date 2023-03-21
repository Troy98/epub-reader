import React from 'react';
import { Book } from 'react-feather';
import Icon from '../Icon';

function Library() {
  return (
    <div className="w-full flex flex-col h-full rounded-xl bg-white overflow-hidden relative">
      <div className="absolute w-full h-full z-10 bg-gray-500/80" />
      <div className="grid pb-5 grid-cols-6">
        <div className="relative h-0">
          <Icon icon={<Book className="absolute text-white left-3.5 top-3.5 text-3xl" />} />
        </div>
        <div className="col-span-5 pt-2 pl-0 sm:pl-0 lg:pl-6 xl:pl-0 min-h-[4rem]">
          <div className="pl-2 sm:p-0 font-bold">
            Boeken
          </div>
        </div>
      </div>
      <div className="p-4 pt-1 flex items-center w-full h-full">
        <div className="rounded-xl w-full h-40 shadow-inner shadow-inner bg-gray-100 h-full overflow-y-auto text-white">
          <div className="p-2 bg-accent-500/75 border-b">Boek #1</div>
        </div>
      </div>
    </div>
  );
}

export default Library;

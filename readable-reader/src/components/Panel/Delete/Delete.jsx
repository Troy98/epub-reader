import React from 'react';
import { Trash2 } from 'react-feather';
import BookList from '../Books/BookList';
import Icon from '../Icon';
import TextButton from '../../TextButton';

function Delete() {
  return (
    <div className="w-full flex flex-col h-full rounded-xl bg-white overflow-hidden relative">
      <div className="absolute w-full h-full z-10 bg-gray-500/80" />
      <div className="grid grid-cols-6">
        <div className="relative h-10 w-10">
          <Icon icon={<Trash2 className="absolute text-white left-3.5 top-3.5 text-3xl" />} />
        </div>
      </div>
      <div className="p-4 pt-0 h-full">
        <div className="flex flex-col items-center justify-center gap-y-4 w-full h-full">
          <BookList />
          <div className="flex justify-end w-full">
            <TextButton
              text="Verwijderen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delete;

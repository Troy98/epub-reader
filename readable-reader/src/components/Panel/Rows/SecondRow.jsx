import React from 'react';
import AddBook from '../Books/AddBook';
import Delete from '../Delete/Delete';
import Library from '../Library/Library';

function SecondRow() {
  return (
    <div className="grid h-full w-full lg:grid-cols-3 gap-6">
      <Library />
      <AddBook />
      <Delete />
    </div>
  );
}

export default SecondRow;

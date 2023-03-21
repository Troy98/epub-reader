import React from 'react';
import BookListItem from './BookListItem';

function BookList() {
  const items = 12;
  return (
    <div className="w-full h-full pt-7">
      <div className="-11/12 h-full rounded-xl overflow-hidden border border-solid border-1 border-gray-100">
        <select className="cursor-pointer w-full h-full overflow-y-auto " name="books" id="books" multiple>
          {/* These are test values! Replace them later with actual books! */}
          {[...Array(items)].map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <BookListItem key={index} />
          ))}
        </select>
      </div>
    </div>
  );
}

export default BookList;

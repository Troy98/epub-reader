import React from 'react';
import ColorOptionItem from './ColorOptionItem';

function ColorOptions() {
  const items = 12;

  return (
    <div className="flex col-span-3 p-1 grid grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-4 h-fit max-h-[15rem] overflow-y-auto">
      {/* THESE ARE TEST ITEMS, CAN REPLACE LATER */}
      {[...Array(items)].map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ColorOptionItem key={index} />
      ))}
    </div>
  );
}

export default ColorOptions;

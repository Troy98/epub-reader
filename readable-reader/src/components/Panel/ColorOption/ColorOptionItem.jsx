import React from 'react';

function ColorOptionItem() {
  return (
    <div
      className="cursor-pointer w-12 h-12 flex justify-center items-center ring-2 ring-black rounded-xl bg-white hover:brightness-90"
    >
      <span className="text-black pointer-events-none font-bold">ABC</span>
    </div>
  );
}

export default ColorOptionItem;

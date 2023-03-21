import React from 'react';
import TextFormat from '../Textformat/TextFormat';
import ColorTheme from '../ColorOption/ColorTheme';

function FirstRow() {
  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      <ColorTheme />
      <TextFormat />
    </div>
  );
}

export default FirstRow;

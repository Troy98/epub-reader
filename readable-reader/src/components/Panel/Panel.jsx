import React from 'react';
import FirstRow from './Rows/FirstRow';
import SecondRow from './Rows/SecondRow';

function Panel() {
  return (
    <div className="flex flex-col flex-1 gap-y-6 w-full h-full max-w-md md:max-w-2xl py-20 xl:pb-0 xl:pt-18 lg:max-w-5xl xl:max-w-7xl">
      <FirstRow />
      <SecondRow />
    </div>
  );
}

export default Panel;

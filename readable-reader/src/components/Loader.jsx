import React from 'react';
import { useSelector } from 'react-redux';

function Loader() {
  const { accentColorTailwindFormat } = useSelector((state) => state.users);
  return (
    <div id="loader" className="fixed w-full h-screen items-center flex flex-col bg-gray-200/75 z-50">
      <div className="absolute w-full flex-1 h-full flex items-center justify-center">
        <div className="inline-block relative w-40 h-40">
          <div className={`box-border block absolute w-40 h-40 border-[1.5rem] 
          border-t-${accentColorTailwindFormat}-500 rounded-full animate-spin-two`}
          />
        </div>
      </div>
    </div>
  );
}

export default Loader;

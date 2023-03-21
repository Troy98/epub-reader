import React from 'react';
import { AlertTriangle } from 'react-feather';
import nl from '@digitalartlab/hyphenated-nl';
import { useSelector } from 'react-redux';
import Hyphenated from 'react-hyphen';

function ScreenNotification(props) {
  const { text, onClick } = props;
  const {

    accentColorTailwindFormat, fontSize, lineHeight, fontFamily, backgroundColor, textColor, letterSpacing,
  } = useSelector((state) => state.users);
  return (

    <div
      className={`w-full min-h-screen h-full overflow-y-auto overflow-x-hidden fixed block
    z-50 text-center grid auto-rows-auto gap-y-14 place-items-center items-center p-5`}
      style={{ backgroundColor, color: textColor }}
    >
      <AlertTriangle className="w-32 h-32" />
      <Hyphenated language={nl}>
        <p
          className={
            `md:text-8xl text-7x selectedFont w-full h-full ${fontSize.replace(/[^0-9]/g, '') > 300 ? 'text-left px-0' : 'text-center px-2'}`
          }
          style={{
            fontSize: `max(50px, ${fontSize})`, fontFamily: `max(60px, ${fontSize})`, lineHeight, letterSpacing,
          }}
        >
          {text}
        </p>
      </Hyphenated>
      <button
        type="button"
        className={`${fontSize.replace(/[^0-9]/g, '') < 100 ? 'h-48 w-48 px-5' : (
          fontSize.replace(/[^0-9]/g, '') < 200 ? 'h-80 w-80 px-0' : 'h-[35rem] w-[35rem] px-0')}
        text-red-100 transition-colors duration-150 bg-white rounded-full focus:shadow-outline 
        bg-${accentColorTailwindFormat}-500 hover:brightness-90 `}
        onClick={onClick}
      >
        <h1
          className={`lg:text-7xl p-0 text-6xl font-semibold text-${accentColorTailwindFormat === 'white' ? 'black' : 'white'}`}
          style={{
            fontSize: `max(60px, ${fontSize})`, fontFamily, lineHeight, letterSpacing,
          }}
        >
          OK
        </h1>
      </button>
    </div>
  );
}

export default ScreenNotification;

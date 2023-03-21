import React from 'react';
import { useSelector } from 'react-redux';

function TextButton(props) {
  const {
    text, type, disabled, onClick, styles, id,
  } = props;

  const { accentColorTailwindFormat } = useSelector((state) => state.users);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      id={id || text.toLowerCase()}
      className={`w-fit disabled:bg-gray-400 capitalize hover:brightness-75
      text-${accentColorTailwindFormat !== 'white' ? 'white' : 'black'} bg-${accentColorTailwindFormat || 'accent'}-500
      focus:ring-4 focus:outline-none focus:ring-accent-300 font-medium rounded-lg text-sm px-5 py-2.5
      text-center transition-all duration-200 ${styles}`}
    >
      {text}
    </button>
  );
}

export default TextButton;

import React from 'react';
import { Link } from 'react-router-dom';

function IconButton(props) {
  const {
    icon, to, style, onClick, color, id,
  } = props;

  return (
    <Link
      to={to}
      id={id}
      style={style}
      onClick={onClick}
      className={`flex justify-end right-0 2xl:left-0 bottom-0 z-10 text-${color !== 'white' ? 'white' : 'black'} 
      icon-back-button w-60 h-60 bg-${color}-500 fixed p-2`}
    >
      {icon}
    </Link>
  );
}

export default IconButton;

import React from 'react';

function OnClickButton(props) {
  const {
    type, disabled, onClick, styleString, value, id, style,
  } = props;

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={styleString}
      style={style}
    >
      {value}
    </button>
  );
}

export default OnClickButton;

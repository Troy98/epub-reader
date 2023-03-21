import React from 'react';

function OnClickButton(props) {
  const {
    type, disabled, onClick, styleString, value, id,
  } = props;

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={styleString}
    >
      {value}
    </button>
  );
}

export default OnClickButton;

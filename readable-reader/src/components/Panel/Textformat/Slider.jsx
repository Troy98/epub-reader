import React from 'react';

function Slider(props) {
  const {
    name, id, min, max, styling, onChange, defaultValue,
  } = props;
  return (
    <input
      type="range"
      name={name}
      id={id}
      min={min}
      max={max}
      onChange={onChange}
      className={styling}
      defaultValue={defaultValue}
    />
  );
}

export default Slider;

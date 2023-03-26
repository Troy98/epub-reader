import React from 'react';
import { useSelector } from 'react-redux';
import Slider from '../../Panel/Textformat/Slider';

function SliderObject(props) {
  const {
    onChange, defaultValue, sliderMin, sliderMax, title, unit, typeOfSlider, typeOfOutput,
  } = props;

  const { accentColorTailwindFormat } = useSelector((state) => state.users);

  const [editingValue, setEditingValue] = React.useState(defaultValue);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-y-2 w-3/4 flex-col">
        <div className="text-xs">
          {title}
        </div>
        <Slider
          name={typeOfSlider}
          id={typeOfSlider}
          min={sliderMin}
          max={sliderMax}
          styling="slider cursor-pointer"
          defaultValue={defaultValue}
          onChange={
            (e) => {
              onChange(e.target.value);
              setEditingValue(e.target.value);
            }
        }
        />
        <div className="flex justify-between">
          <div className="text-xs">{sliderMin + unit}</div>
          <div className="text-xs">{"1" + sliderMax + unit}</div>
        </div>
      </div>
      <div className={`flex justify-center rounded-[50%] bg-${accentColorTailwindFormat !== 'white'
        ? accentColorTailwindFormat : 'accent'}-500 w-10 h-10 text-white`}
      >
        <span id={typeOfOutput} className="self-center text-xs">
          {editingValue + unit}
        </span>
      </div>
    </div>
  );
}

export default SliderObject;

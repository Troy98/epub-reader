import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function PickFontFamily(props) {
  const {
    onChange, defaultValue, title, options,
  } = props;

  const [editingValue, setEditingValue] = useState(defaultValue);
  const { accentColorTailwindFormat, textColor } = useSelector((state) => state.users);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-y-2 w-3/4 flex-col">
        <div className="text-xs">
          {title}
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          {options.map((option) => (
            <button
              key={option}
              id={option}
              className={`flex justify-center rounded-md w-fit px-2 h-8 !text-black ${
                editingValue === option ? `border-2 bg-${accentColorTailwindFormat !== 'white'
                  ? accentColorTailwindFormat : 'accent'}-50 border-${accentColorTailwindFormat !== 'white'
                  ? accentColorTailwindFormat : 'accent'}-500` : 'border border-zinc-400'
              }`}
              onClick={() => {
                onChange(option);
                setEditingValue(option);
              }}
              style={{
                fontFamily: `${option}`,
                color: `${textColor}`,
              }}
            >
              <div className={`${editingValue === option ? 'selected' : ''} font-family-option cursor-pointer text-sm self-center`}>{option}</div>
            </button>
          ))}

        </div>
      </div>
    </div>
  );
}

export default PickFontFamily;

import React from 'react';
import SliderObject from './ReaderOptions/SliderObject';
import PickFontFamily from './ReaderOptions/PickFontFamily';

function ChangeTextLayout(props) {
  const {
    onFontSizeChange, defaultFontSize, onLineHeightChange, defaultLineHeight,
    onFontFamilyChange, defaultFontFamily, fontFamilyOptions, onLetterSpacingChange, defaultLetterSpacing,
  } = props;

  return (
    <>

      {/* Font size slider */}
      <SliderObject
        typeOfSlider="fontSizeSlider"
        typeOfOutput="fontSizeOutput"
        onChange={onFontSizeChange}
        defaultValue={defaultFontSize}
        sliderMin="40"
        sliderMax="400"
        title="Tekst Grootte"
        unit=""
      />

      {/* Line height slider */}
      <SliderObject
        typeOfSlider="lineHeightSlider"
        typeOfOutput="lineHeightOutput"
        onChange={onLineHeightChange}
        defaultValue={defaultLineHeight}
        sliderMin="80"
        sliderMax="250"
        title="Regelafstand"
        unit="%"
      />

      {/* Letter spacing slider */}
      <SliderObject
        typeOfSlider="letterSpacingSlider"
        typeOfOutput="letterSpacingOutput"
        onChange={onLetterSpacingChange}
        defaultValue={defaultLetterSpacing}
        sliderMin="0"
        sliderMax="30"
        title="Letter Spacing"
        unit="%"
      />

      <PickFontFamily
        onChange={onFontFamilyChange}
        defaultValue={defaultFontFamily}
        title="Lettertype"
        options={fontFamilyOptions}
      />

    </>
  );
}

export default ChangeTextLayout;

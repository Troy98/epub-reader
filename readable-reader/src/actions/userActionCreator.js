const serverURL = process.env.REACT_APP_API_URL;

export function setLayoutAction(layout) {
  return {
    type: 'SET_LAYOUT',
    payload: layout,
  };
}

export function setFontSizeAction(fontSize) {
  return {
    type: 'SET_FONT_SIZE',
    payload: fontSize,
  };
}

export function setLineHeightAction(lineHeight) {
  return {
    type: 'SET_LINE_HEIGHT',
    payload: lineHeight,
  };
}

export function setFontFamilyAction(fontFamily) {
  return {
    type: 'SET_FONT_FAMILY',
    payload: fontFamily,
  };
}

export function setTextColorAction(textColor) {
  return {
    type: 'SET_TEXT_COLOR',
    payload: textColor,
  };
}

export function setBackgroundColorAction(backgroundColor) {
  return {
    type: 'SET_BACKGROUND_COLOR',
    payload: backgroundColor,
  };
}

export function setAccentColorTailwindFormatAction(accentColorTailwindFormat) {
  return {
    type: 'SET_ACCENT_COLOR_TAILWIND_FORMAT',
    payload: accentColorTailwindFormat,
  };
}

export function setAccentColorHexFormatAction(accentColorHexFormat) {
  return {
    type: 'SET_ACCENT_COLOR_HEX_FORMAT',
    payload: accentColorHexFormat,
  };
}

export function setLetterSpacingAction(letterSpacing) {
  return {
    type: 'SET_LETTER_SPACING',
    payload: letterSpacing,
  };
}


export function getLayoutAction( ) {
  return {
    type: 'GET_LAYOUT',

  };
  }

export function getLayoutActionAsync() {
  return async (dispatch) => {
    const result = await fetch(`${serverURL}/api/v1/reader/users`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await result.json();
    dispatch(setLayoutAction(data));
  };
}

const userPreferenceInitialState = {
  fontSize: '50px',
  lineHeight: '125%',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  accentColorTailwindFormat: 'accent',
  accentColorHexFormat: '#3D5AB8',
  fontFamily: 'Atkinson Hyperlegible',
  letterSpacing: '0.1em',
};

// eslint-disable-next-line default-param-last
export default function userPreferenceReducer(state = userPreferenceInitialState, action) {
  console.log("REDUCER HIT");
  switch (action.type) {
    case 'SET_LAYOUT':
      return {
        ...state,
        fontSize: action.payload.preferences.fontSize,
        lineHeight: action.payload.preferences.lineHeight,
        fontFamily: action.payload.preferences.fontFamily,
        textColor: action.payload.preferences.textColor,
        backgroundColor: action.payload.preferences.backgroundColor,
        accentColorTailwindFormat: action.payload.preferences.accentColor.tailwindFormat,
        accentColorHexFormat: action.payload.preferences.accentColor.hexFormat,
        letterSpacing: action.payload.preferences.letterSpacing,
      };

    case 'SET_FONT_SIZE':
      console.log('SET_FONT_SIZE', action.payload)
      return {
        ...state,
        fontSize: action.payload,
      };

    case 'SET_LINE_HEIGHT':
      return {
        ...state,
        lineHeight: action.payload,
      };

    case 'SET_FONT_FAMILY':
      return {
        ...state,
        fontFamily: action.payload,
      };

    case 'SET_TEXT_COLOR':
      return {
        ...state,
        textColor: action.payload,
      };
      
    case 'SET_BACKGROUND_COLOR':
      return {
        ...state,
        backgroundColor: action.payload,
      };

    case 'SET_ACCENT_COLOR_TAILWIND_FORMAT':
      return {
        ...state,
        accentColorTailwindFormat: action.payload,
      };

    case 'SET_ACCENT_COLOR_HEX_FORMAT':
      return {
        ...state,
        accentColorHexFormat: action.payload,
      };

    case 'SET_LETTER_SPACING':
      return {
        ...state,
        letterSpacing: action.payload,
      };

    default:
      return state;
  }
}

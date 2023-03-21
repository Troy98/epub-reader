const userPreferenceInitialState = {
  fontSize: '50px',
  lineHeight: '125%',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  accentColorTailwindFormat: 'accent',
  accentColorHexFormat: '#334B99',
  fontFamily: 'Atkinson Hyperlegible',
  letterSpacing: '0.1em',
};

// eslint-disable-next-line default-param-last
export default function userPreferenceReducer(state = userPreferenceInitialState, action) {
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
    default:
      return state;
  }
}

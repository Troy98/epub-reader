const initialState = {
  ebooks: [],
  deletedEbookID: undefined,
};

// eslint-disable-next-line default-param-last
export default function ebooksReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EBOOKS':
      return {
        ...state, ebooks: action.payload,
      };
    case 'DELETE_BOOK':
      return {
        ...state, deletedEbookID: action.payload,
      };
    default:
      return state;
  }
}

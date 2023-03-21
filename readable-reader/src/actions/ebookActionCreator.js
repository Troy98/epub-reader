const serverURL = process.env.REACT_APP_API_URL;

export function setEBooksAction(ebooks) {
  return {
    type: 'SET_EBOOKS',
    payload: ebooks,
  };
}

export function getEBooksActionAsync() {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/api/v1/reader/books`, {
      credentials: 'include',
    });
    const ebooks = await response.json();
    await ebooks.reverse();
    dispatch(setEBooksAction(ebooks));
  };
}

export function setDeletedBookAction(bookId) {
  return {
    type: 'DELETE_BOOK',
    payload: bookId,
  };
}

const serverURL = process.env.REACT_APP_API_URL;

export function setLayoutAction(layout) {
  return {
    type: 'SET_LAYOUT',
    payload: layout,
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

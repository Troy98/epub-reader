import io from 'socket.io-client';
import store from './store/store';
import { getLayoutActionAsync } from './actions/userActionCreator';
import { getEBooksActionAsync, setDeletedBookAction } from './actions/ebookActionCreator';

const serverURL = process.env.REACT_APP_WS_URL;

let socket;

export function openSocket() {
  if (socket) {
    socket.disconnect();
  }

  socket = io(serverURL, { transports: ['websocket'] });

  socket.on('connect', () => {
    const id = localStorage.getItem('token');
    socket.emit('join', { room: id });
  });

  // Message handlers
  socket.on('NEW_BOOK', () => {
    store.dispatch(getEBooksActionAsync());
  });

  socket.on('DELETE_BOOK', (data) => {
    store.dispatch(setDeletedBookAction(data));
    store.dispatch(getEBooksActionAsync());
  });

  socket.on('BOOK_LAYOUT_CHANGED', () => {
    store.dispatch(getLayoutActionAsync());
  });
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
  }
}

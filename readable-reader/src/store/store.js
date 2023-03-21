import { configureStore } from '@reduxjs/toolkit';
import ebooksReducer from '../reducers/ebooksReducer';
import usersReducer from '../reducers/usersReducer';

const store = configureStore({
  reducer: {
    ebooks: ebooksReducer,
    users: usersReducer,
  },
});

export default store;

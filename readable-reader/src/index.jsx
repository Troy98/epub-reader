import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Store from './store/store';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={Store}>
    <App />
  </Provider>,
);
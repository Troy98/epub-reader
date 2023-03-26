import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './store/store';
import App from './App';
import './index.css';



const container = document.getElementById('root');

ReactDOM.render(
  <Provider store={Store}>
    <App 
    />
  </Provider>,
  container,
);

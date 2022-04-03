import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import './index.css';
import './theme/styles/dark.theme.css';
import './theme/styles/light.theme.css';
import App from './app/app';

const HMLApp = hot(module)(App);

ReactDOM.render(
  <React.StrictMode>
    <HMLApp />
  </React.StrictMode>,
  document.getElementById('root')
);

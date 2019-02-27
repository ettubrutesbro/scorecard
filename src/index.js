import React from 'react';
import ReactDOM from 'react-dom';
import cssVars from 'css-vars-ponyfill'
import './global.css';
import ResponsiveScorecard from './ResponsiveScorecard';

import Wizard from './Wizard'
import registerServiceWorker from './registerServiceWorker';
import {createGlobalStyle} from 'styled-components'

function noop() {}

if (process.env.NODE_ENV !== 'development') {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

ReactDOM.render(<Wizard />, document.getElementById('root'));
// ReactDOM.render(<ResponsiveScorecard />, document.getElementById('root'));
registerServiceWorker();
cssVars()

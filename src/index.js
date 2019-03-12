import React from 'react';
import ReactDOM from 'react-dom';
import cssVars from 'css-vars-ponyfill'
import './global.css';
// import ResponsiveScorecard from './ResponsiveScorecard';
import SheetTest from './GoogSheetTest'
import registerServiceWorker from './registerServiceWorker';
import {createGlobalStyle} from 'styled-components'

function noop() {}

if (process.env.NODE_ENV !== 'development') {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

ReactDOM.render(<SheetTest />, document.getElementById('root'));
registerServiceWorker();
cssVars()

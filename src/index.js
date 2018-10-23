import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import ResponsiveScorecard from './ResponsiveScorecard';
import registerServiceWorker from './registerServiceWorker';
import {createGlobalStyle} from 'styled-components'

ReactDOM.render(<ResponsiveScorecard />, document.getElementById('root'));
registerServiceWorker();

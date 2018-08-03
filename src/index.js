import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scorecard from './Scorecard';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Scorecard />, document.getElementById('root'));
registerServiceWorker();

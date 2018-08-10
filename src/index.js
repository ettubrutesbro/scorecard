import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NeoScorecard from './NeoScorecard';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<NeoScorecard />, document.getElementById('root'));
registerServiceWorker();

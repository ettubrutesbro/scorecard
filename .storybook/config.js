import { configure } from '@storybook/react';
import 'react-tippy/dist/tippy.css';
// import '../src/global.css'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

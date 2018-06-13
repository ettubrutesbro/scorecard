import React from 'react';

import styles from './stories.module.css'

import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import { Button, Welcome } from '@storybook/react/demo';

	addDecorator(withKnobs)
addDecorator(withViewport('iphone6'))

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf('knob test', module).add('yo', ()=>{
	const knob = select('test', ['hello', 'world'])
	return(
		<div className = {styles.testModule}>
			{knob}
		</div>
	)
})
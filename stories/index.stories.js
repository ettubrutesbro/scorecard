import React from 'react';

import styles from './stories.module.css'

import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import CaliforniaCountyMap from '../src/components/CountyMap'
import {counties} from '../src/assets/counties'
import {indicators} from '../src/assets/mock_indicators'
import App from '../src/App'

import { Button, Welcome } from '@storybook/react/demo';

  addDecorator(withKnobs)
// addDecorator(withViewport('iphone6'))

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

storiesOf('scorecard', module).add('CountyMap', ()=>{
  return(
    <div>
     <CaliforniaCountyMap 
      mode = "heat"
      data = {indicators[0]['year_2017']}
     />

    </div>
  )
})
.add('mock indicators',()=>{
  return(
    <div>
      {indicators.map((ind)=>{
        return <span> {ind.id}</span>
      })}
    </div>
  )

})
.add('App', ()=>{
    return <App />
})
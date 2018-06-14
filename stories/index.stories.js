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
  const indicator = select('Indicator (mock data): ', [0,1],0)
  const year = select('year (mock data): ', [0,1],0)
  console.log(indicators[indicator])
  return(
    <div>
     <CaliforniaCountyMap 
      mode = "heat"
      data = {indicators[indicator].year[year]}
     />
     <div className = {styles.diag}>
      <ul>
        <li>indicator: {indicators[indicator].name}</li>
        <li>id: {indicators[indicator].id}</li>
        <li>years: {indicators[indicator].yearsAvailable.join(', ')}</li>
        <li>race data available? {indicators[indicator].raceAvailable}</li>
        <li>categories: {indicators[indicator].categories.join(', ')}</li>
        <li>source name: {indicators[indicator].source.name}</li>
        <li>source url: {indicators[indicator].source.url}</li>
        <li>source context: {indicators[indicator].source.context}</li>
      </ul>
     </div>
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
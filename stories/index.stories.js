import React from 'react';

import styles from './stories.module.css'

import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select, color} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import CaliforniaCountyMap from '../src/components/InteractiveMap'
import AccordionMenu from '../src/components/AccordionMenu'
import App from '../src/App'

import counties from '../src/data/counties'
import indicators from '../src/data/indicators'


import { Button, Welcome } from '@storybook/react/demo';

  addDecorator(withKnobs)
// addDecorator(withViewport('iphone6'))

storiesOf('scorecard', module).add('InteractiveMap', ()=>{
  const indicator = select('Indicator (random data): ', ['welfareMock','noFoodInsecurity','edumacation'],'noFoodInsecurity')
  const stop1 = color('color stop 1', 'red')
  const stop2 = color('color stop 2', 'yellow')
  const interp = select('color interpolation', ['rgb','hsl','lab','lrgb','lch'], 'lab')
  // console.log(indicators[indicator])
  return(
    <div>
     <CaliforniaCountyMap 
      mode = "heat"
      data = {indicators[indicator].year[0]}
      colorStops = {[stop1,stop2]}
      colorInterpolation = {interp}
     />
     {/*
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
   */}
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

.add('AccordionMenu', ()=>{
  return <AccordionMenu />
})
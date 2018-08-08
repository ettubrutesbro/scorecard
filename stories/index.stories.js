import React from 'react';

import styles from './stories.module.css'

import {map} from 'lodash'

import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


// import App2 from '../src/App2'
// import Scorecard from '../src/Scorecard'
// import Map from '../src/Map'


import counties from '../src/data/counties'
import indicators from '../src/data/indicators'

// import Picker from '../src/components/core/Picker'
// import Readout2 from '../src/components/core/Readout2'
import Info from '../src/components/Info'

import CAMap from '../src/components/core/InteractiveMap'
import Toggle from '../src/components/Toggle'

import { Button, Welcome } from '@storybook/react/demo';

import '../src/global.css'

  addDecorator(withKnobs)
// addDecorator(withViewport('iphone6'))

storiesOf('scorecard', module)

// .add('Picker', ()=>{
//   return <Picker />
// })
// .add('App2 (test app)', ()=>{
//   return <App2 />
// })
// .add('Scorecard (final)', ()=> {
//   return <Scorecard />
// })
// .add('Readout2', ()=>{
//  const ind = select('indicator',['earlyPrenatalCare','notFoodInsecure',null])
//  const race = text('race','')
//  const location = select('location',['sanBernardino','kern','alameda','sanLuisObispo'])
//  return <Readout2 
//      race = {race}
//      location = {location}
//      indicator = {ind}
//  />
// })
.add('Toggle', ()=>{
    return(
        <Toggle
            onClick = {action('hi')}
            options = {[
                {label: 'hellouoaeuaoeu'},
                {label: 'goodbye'}
            ]}
            selected = {1}
        />
    )
})
.add('info', ()=>{
    return(
        <div
            style = {{display: 'flex'}}
        >
            <div style = {{height: '90vh'}}>
                <Info />
            </div>
            <CAMap />
        </div>
    )
})
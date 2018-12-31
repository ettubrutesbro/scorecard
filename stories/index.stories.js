import React from 'react';
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import styled from 'styled-components'

import styles from './stories.module.css'


import chroma from 'chroma-js'
import {map} from 'lodash'

import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links';


import counties from '../src/assets/counties'
import countyLabels from '../src/assets/countyLabels'
import indicators from '../src/data/indicators'


import CAMap from '../src/components/InteractiveMap'
import ZoomableMap from '../src/components/ZoomableMap'


import { Button, Welcome } from '@storybook/react/demo';

import '../src/global.css'

  addDecorator(withKnobs)
addDecorator(withViewport('iphone6'))

class AppStore{
    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable year = null
    @observable activeWorkflow = null

        @observable colorOptions = {
        scheme: 'OrRd',
        padLo: 0, padHi: 0,
        classes: 5
    }

    @computed get colorScale(){
        const opts = this.colorOptions
        return chroma.scale(opts.scheme)
            .domain([0,100])
            .padding([opts.padLo, opts.padHi])
            .classes(opts.classes)
    } 

    @action setYearIndex = () => {
        const newYears = indicators[this.indicator].years
        if(!this.year && newYears.length>1) this.year = newYears.length-1
        else if(!this.year) this.year = 0
        else if(this.year === 1 && newYears.length===1) this.year = 0
        console.log(`year ${this.year} (${newYears[this.year]})`)
    }

    @action setWorkflow = (mode) => this.activeWorkflow = mode===this.activeWorkflow? '' : mode
    @action completeWorkflow = (which, value) => {

        this.activeWorkflow = null
        this[which] = value
        if(which==='indicator'){
            this.setYearIndex()
        }
        if(this.race && this.indicator && this.county && !indicators[this.indicator].counties[this.county][this.race][this.year]){
            //if race/indicator/county selected -> no race data, unset race
            // console.log('race not supported after selection, unsetting')
            // this.race = null

            //the result of this code is that it just looks unresponsive - lets grey the options in UniversalPicker
        }
        
    }
    
}

const store = new AppStore()
window.store = store

storiesOf('Scorecard Prototypes', module)

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
// .add('Toggle', ()=>{
//     return(
//         <Toggle
//             onClick = {action('hi')}
//             options = {[
//                 {label: 'hellouoaeuaoeu'},
//                 {label: 'goodbye'}
//             ]}
//             selected = {1}
//         />
//     )
// })

// .add('info (accordiony-column)', ()=>{
//     return(
//         <div
//             style = {{display: 'flex', overflow: 'hidden'}}
//         >
//             <div style = {{minWidth: '50%'}}>
//                 <Info />
//             </div>
//             <CAMap />
//         </div>
//     )
// })

.add('Nav', ()=>{
    return(
        <Void>
            <Nav 
                store = {store}
            />
        </Void>
    )
})

.add('responsivescorecard', ()=>{
    const ind = select('indicator', Object.keys(indicators), null)
    const cties = counties.map((cty)=>{return cty.id})
    console.log(cties)
    const coun = select('county', cties, null)
    const race = select('race',['asian','black','latinx','white'], null)
    const yr = 0
    const mockStore = {
        indicator: ind,
        county: coun,
        race: race,
        year: yr
    }
    return(
        <ResponsiveScorecard 
            store = {mockStore}
        />
    )
})


storiesOf('Maps',module)
.add('CAMap', ()=>{
    // const zoomCounty = select(`zoom county: `, ['imperial', 'sanFrancisco', 'delNorte', 'modoc', 'losAngeles'])
    const selectCounty = select('select county: ', ['sanLuisObispo', 'alameda', 'siskiyou', 'napa', 'losAngeles'], 'sanLuisObispo')
    return(
    <div style = {{width: '100vw', height: '100vh'}}>
        <CAMap 
            data = ''
            store = {store}
            selected = {selectCounty}
            // onSelect = {store.completeWorkflow}
            // selected = {store.county}
        />
    </div>
    )
})
.add('ZoomableMap (for mobile)', ()=>{
    const zoomCounty = select(`zoom county: `, [null,'imperial', 'inyo', 'kern', 'sanFrancisco', 'sanBernardino' ,'delNorte', 'modoc', 'losAngeles'])
    
    return(
        <ZoomableMap
            data = ''
            store = {store}
            zoomTo = {zoomCounty}
        />
    )
})


const Note = styled.h3`
    display: inline-flex;
    background: #FFF8D5;
    padding: 10px 20px;
    margin: 30px 0 10px 0;
    font-weight: 400;
`
const Void = styled.div`
    width: 100vw;
    height: 100vh;
    background: var(--offwhitebg);
    padding: 50px;

`

storiesOf('Misc', module)
.add('MobileBlocker', ()=>{
    return(
        <MobileBlocker />

        )
})
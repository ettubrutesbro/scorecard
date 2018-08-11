import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'

import IndicatorByCounties from '../src/components/IndicatorByCounties'
import IndicatorByRaces from '../src/components/IndicatorByRaces'
import CountiesByRacePopulation from '../src/components/CountiesByRacePopulation'

import HorizontalBarGraph from '../src/components/HorizontalBarGraph'


addDecorator(withKnobs)

storiesOf('Breakdowns', module)
.add('IndicatorByCounties (I, LI)', ()=>{
    const indicator = select('indicator',['earlyPrenatalCare','collegeCareerReady'], 'earlyPrenatalCare')
    const county = select('county', ['marin','fresno','tehama', 'sanLuisObispo', 'alameda', 'alpine', 'siskiyou'], null)
    const race = select('race', ['asian','black','latinx','white','other',null],null)
    const year = select('year(index)', [0,1], 0)
    return(
        <IndicatorByCounties
            store = {{
                year: year,
                race: race,
                indicator: indicator,
                county: county
            }}
        />
    )
})
.add('IndicatorByRaces(I,LI)', ()=>{
    const indicator = select('indicator',['earlyPrenatalCare','collegeCareerReady'], 'earlyPrenatalCare')
    const county = select('county',[null, 'sanLuisObispo', 'alameda'], null)
    return(
        <IndicatorByRaces 
            store = {{
                year: 0,
                indicator: indicator,
                county: county
            }}    
        />
    )
})
.add('CountiesByRace',()=>{
    const indicator = select('indicator',[null, 'earlyPrenatalCare','collegeCareerReady'], null)
    const race = select('race', ['asian','black','latinx','white','other',null],'black')
    const year = select('year(index)', [0,1], 0)
    return(
        <CountiesByRacePopulation
            store = {{
                race: race,
                year: year,
                indicator: indicator,
                // county: county
            }}  
        />
    )
})
.add('HorizontalBarGraph', ()=>{
    return(
        <HorizontalBarGraph 
            header = 'My Bar Graph'
            average = {50}
            labelWidth = {100}
            bars = {[
                {label: 'hi', value: 100},    
                {label: 'oeu', value: 50},    
                {label: '.py', value: 20},    
                {label: 'ytnoh', value: 10},    
            ]}
        />
    )
})
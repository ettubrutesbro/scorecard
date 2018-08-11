import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'

import PerformanceDistributionByCounty from '../src/components/PerformanceDistributionByCounty'
import IndicatorBrokenDownByRaces from '../src/components/IndicatorBrokenDownByRaces'

import HorizontalBarGraph from '../src/components/HorizontalBarGraph'

addDecorator(withKnobs)

storiesOf('Breakdowns', module)
.add('PerformanceDistributionByCounty (I, LI)', ()=>{
    const indicator = select('indicator',['earlyPrenatalCare','collegeCareerReady'], 'earlyPrenatalCare')
    const county = select('county', ['marin','fresno','tehama', 'sanLuisObispo', 'alameda', 'alpine', 'siskiyou'], null)
    const year = select('year(index)', [0,1], 0)
    return(
        <PerformanceDistributionByCounty
            store = {{
                year: year,
                indicator: indicator,
                county: county
            }}
        />
    )
})
.add('IndicatorBrokenDownByRaces(I,LI)', ()=>{
    const indicator = select('indicator',['earlyPrenatalCare','collegeCareerReady'], 'earlyPrenatalCare')
    const county = select('county',[null, 'sanLuisObispo', 'alameda'], null)
    return(
        <IndicatorBrokenDownByRaces 
            store = {{
                year: 0,
                indicator: indicator,
                county: county
            }}    
        />
    )
})

.add('HorizontalBarGraph', ()=>{
    return(
        <HorizontalBarGraph 
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
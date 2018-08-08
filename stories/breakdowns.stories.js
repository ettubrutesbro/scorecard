import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'

import PerformanceDistributionByCounty from '../src/components/PerformanceDistributionByCounty'
import IndicatorBrokenDownByRaces from '../src/components/IndicatorBrokenDownByRaces'

addDecorator(withKnobs)

storiesOf('Breakdowns', module)
.add('PerformanceDistributionByCounty (I, LI)', ()=>{
    const indicator = select('indicator',['earlyPrenatalCare','collegeCareerReady'], 'earlyPrenatalCare')
    return(
        <PerformanceDistributionByCounty 
            store = {{
                year: 0,
                indicator: indicator,
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
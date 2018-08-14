import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'

import IndicatorByCounties from '../src/components/IndicatorByCounties'
import IndicatorByRaces from '../src/components/IndicatorByRaces'
import CountiesByRacePopulation from '../src/components/CountiesByRacePopulation'

import HorizontalBarGraph from '../src/components/HorizontalBarGraph'
import VerticalBreakdownBar from '../src/components/VerticalBreakdownBar'


const Note = styled.h3`
    display: inline-flex;
    background: #FFF8D5;
    padding: 10px 20px;
    margin: 30px 0 10px 0;
    font-weight: 400;
`

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
        <div>
            <Note></Note>
            <IndicatorByRaces 
                store = {{
                    year: 0,
                    indicator: indicator,
                    county: county
                }}    
            />
            <Note>sometimes an indicator at county level doesnt have race data</Note>
            <IndicatorByRaces 
                store = {{
                    year: 0,
                    indicator: 'earlyPrenatalCare',
                    county: 'mono'
                }}    
            />
        </div>
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
.add('VerticalBreakdownBar', ()=>{
    const options = {
         hellaAzns: [
            {label: 'Black', value: 10, color: 'red'},    
            {label: 'Latinx', value: 10, color: 'green'},  
            {label: 'Asian', value: 50, color: 'blue'},     
            {label: 'White', value: 10, color: 'goldenrod'},    
            {label: 'Other', value: 20, color: 'grey'},   
        ],
        blah: [
            {label: 'Black', value: 30, color: 'red'},    
            {label: 'Latinx', value: 30, color: 'green'},    
            {label: 'Asian', value: 15, color: 'blue'},    
            {label: 'White', value: 15, color: 'goldenrod'},    
            {label: 'Other', value: 10, color: 'grey'},   
        ]
    }
    const mockDataSet = select('different mock data sets', ['blah','hellaAzns'], 'blah')
    return(
        <VerticalBreakdownBar
            header = 'Race Breakdown'
            segments = {options[mockDataSet]}
        />
    )
})
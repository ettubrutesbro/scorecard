import React from 'react';
import styled from 'styled-components'

import {mapValues} from 'lodash'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import chroma from 'chroma-js'

import indicators from '../src/data/indicators'

import CAMap from '../src/components/core/InteractiveMap'
import IndicatorByCounties from '../src/components/IndicatorByCounties'
import ColorPreviewer from '../src/utilities/ColorPreviewer'

import Legend from '../src/components/Legend'

addDecorator(withKnobs)

storiesOf('Major sections', module)
.add('Legend', ()=>{
    const indicator = select('indicator', Object.keys(indicators), 'notFoodInsecure')
    const hasRace = indicators[indicator].categories.includes('hasRace')
    const hasYears  = indicators[indicator].years.length > 1

    const race = hasRace? select('race',['asian','black','latinx','white',null],null) : null
    const year = hasYears? select('year (index)', [0,1],0) : 0

    const classes = number('classes', 5)

    const schemes = {welfare: 'PuRd', health: 'BuGn', education: 'Purples', earlyChildhood: 'PuBu'}
    const mainCategory = indicators[indicator].categories.filter((o)=>{return o!=='hasRace'})[0]
    
    const allNums = Object.keys(indicators[indicator].counties).map((cty)=>{
            return indicators[indicator].counties[cty][race||'totals'][year]
        }).filter((o)=>{
            const inv = o==='' || o==='*'
            // if(inv) invalids++
            return inv?false : true
        })
    console.log(allNums)
    const padLo = Math.min(...allNums)/100
    const padHi = 1- (Math.max(...allNums)/100)

    const dataClassing = select('data classing', {logarithmic: 'l', equidistant: 'e', quantile: 'q'}, 'e')
   

    const breaks = chroma.limits(allNums, dataClassing, classes)

    const colorScale = chroma.scale(schemes[mainCategory])
        .domain([0,100])
        .padding([padLo, padHi])
        .classes(breaks)
    
    return(
        <Void>
        <Note> padleft:{padLo.toFixed(2)}  padright:{padHi.toFixed(2)} </Note>
        <Note> breaks: {breaks.join(', ')} </Note>
        <Legend 
            store = {{
                indicator: indicator,
                race: race,
                year: year,
                colorScale: colorScale,
                colorOptions: {classes: classes, breakAlgorithm: dataClassing}
            }}
        />
        </Void>

    )
})

const Void = styled.div`
    width: 100vw;
    height: 100vh;
    background: var(--offwhitebg);
    padding: 50px;

`
const Note = styled.h3`
    display: inline-flex;
    background: #FFF8D5;
    padding: 10px 20px;
    margin: 30px 0 10px 0;
    font-weight: 400;
`

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


const Note = styled.h3`
    display: inline-flex;
    background: #FFF8D5;
    padding: 10px 20px;
    margin: 30px 0 10px 0;
    font-weight: 400;
`
const Swatches = styled.div`
    display: inline-flex;
    align-items: center;
    border: 1px solid black;
    max-width: 500px;
`
const Swatch = styled.div`
    width: 65px; height: 65px;
    background: ${props => props.fill};
`
const MapContainer = styled.div`
    max-width: 650px;
    flex-basis: 650px;
    flex-shrink: 0;
    /*max-height: 500px;*/
`
const ColorMocks = styled.div`
    // display: flex;
    /*height: 900px;*/
    /*border: 1px solid black;*/
`

addDecorator(withKnobs)

storiesOf('Design Tooling', module)
.add('hard coded brewer schemes', ()=>{

    const indicator = select('indicator', Object.keys(indicators), 'notFoodInsecure')

    const hasRace = indicators[indicator].categories.includes('hasRace')
    const hasYears  = indicators[indicator].years.length > 1

    const race = hasRace? select('race',['asian','black','latinx','white',null],null) : null
    const year = hasYears? select('year (index)', [0,1],0) : 0
    const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
    }): ''
    console.log(dataForMap)

    const brewerScheme = select('brewer scheme', ['OrRd','YlGnBu','Spectral','BuPu','GnBu','PuBu','PuBuGn','PuRd','YlGn','YlOrBr','YlOrRd','Blues','Oranges','Reds','Purples'], 'OrRd')
    const classes = number('# of colors in spectrum', 5)

    const dataClassing = select('data classing', {logarithmic: 'l', equidistant: 'e', quantile: 'q'}, 'l')
    console.log(dataClassing)

    let invalids = 0
    const allNums = Object.keys(indicators[indicator].counties).map((cty)=>{
        return indicators[indicator].counties[cty][race||'totals'][year]
    }).filter((o)=>{
        const inv = o==='' || o==='*'
        if(inv) invalids++
        return inv?false : true
    })

    // const padLeft = number('color scale padding, low end',0)
    // const padRight = number('color scale padding, high end',0)
    const padLeft = Math.min(...allNums)/100
    const padRight = 1 - Math.max(...allNums)/100

    const classBreaks = chroma.limits(allNums, dataClassing, classes)
    console.log(classBreaks)

    const scale = chroma.scale(brewerScheme)
        .domain([0,100])
        .padding([padLeft,padRight])
        .classes(classBreaks)

    // console.log(scale)
    let arbitraryArray = []
    for(var i = 0; i<classes; i++){
        arbitraryArray.push('')
    }

    console.log(allNums)

    const computedStore = {indicator: indicator, race: race, year: year, colorScale: scale}
    return(
        <React.Fragment>
        <Note> Data lowest number: {Math.min(...allNums)} Highest: {Math.max(...allNums)} </Note> <br />
        <Note> Reporting counties: {allNums.length} (invalid: {invalids}) </Note> <br />
        <Swatches>
            {classBreaks.map((ele,i,arr)=>{
                const range = i===0? `0-${ele.toFixed(1)}` : `${arr[i-1].toFixed(1)} - ${ele.toFixed(1)}` 
                
                const countiesInClass = allNums.filter((num)=>{
                    return num===ele || (num<ele && num>arr[i-1])
                }).length

                return i===0? null : <Swatch
                    fill = {scale(ele)}
                >
                    {range} <br />
                    {countiesInClass}
                    
                </Swatch>   
            })}

        </Swatches>
        <ColorMocks>
        <MapContainer>
        <CAMap 
            store = {computedStore}
            data = {dataForMap}
            // mode = {dataForMap? 'heat' : ''}
        />
        </MapContainer>
        <IndicatorByCounties
            store = {computedStore}
        />
        </ColorMocks>
        </React.Fragment>
    )
})


// .add('componentized color preview?',()=>{
//     const indicator = select('indicator', Object.keys(indicators), 'notFoodInsecure')
//     console.log(indicator)
//     const hasRace = indicators[indicator].categories.includes('hasRace')
//     const hasYears  = indicators[indicator].years.length > 1
//     const race = hasRace? select('race',['asian','black','latinx','white',null],null) : null
//     const year = hasYears? select('year (index)', [0,1],0) : 0
//     const brewerScheme = select('brewer scheme', ['OrRd','YlGnBu','Spectral','BuPu','GnBu','PuBu','PuBuGn','PuRd','YlGn','YlOrBr','YlOrRd','Blues','Oranges','Reds','Purples'], 'OrRd')
//     const classes = number('# of colors in spectrum', 5)
//     const padLeft = number('color scale padding, low end',0)
//     const padRight = number('color scale padding, high end',0)
//     return(
//         <ColorPreviewer 
//             year = {year}
//             indicator = {indicator}
//             race = {race}
//             brewerScheme = {brewerScheme}
//             classes = {classes}
//             padLeft = {padLeft}
//             padRight = {padRight}
//         />
//     )
// })
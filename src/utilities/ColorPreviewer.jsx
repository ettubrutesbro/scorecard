

import React from 'react'
import styled from 'styled-components'
import chroma from 'chroma-js'

import {mapValues} from 'lodash'

import indicators from '../data/indicators'

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
    display: flex;
    /*height: 900px;*/
    /*border: 1px solid black;*/
`

const ColorPreviewer = (props) => {

const {indicator, race, year, classes, padLeft, padRight, brewerScheme} = props

 // const indicator = select('indicator', Object.keys(indicators))

    

//     const race = hasRace? select('race',['asian','black','latinx','white',null],null) : null
//     const year = hasYears? select('year (index)', [0,1],0) : 0
    const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
    }): ''
// 
//     const brewerScheme = select('brewer scheme', ['OrRd','YlGnBu','Spectral','BuPu','GnBu','PuBu','PuBuGn','PuRd','YlGn','YlOrBr','YlOrRd','Blues','Oranges','Reds','Purples'], 'OrRd')
//     const classes = number('# of colors in spectrum', 5)
//     const padLeft = number('color scale padding, low end',0)
//     const padRight = number('color scale padding, high end',0)


    const scale = chroma.scale(brewerScheme).domain([0,100]).padding([padLeft/10,padRight/10]).classes(classes)

    console.log(scale)
    let arbitraryArray = []
    for(var i = 0; i<classes; i++){
        arbitraryArray.push('')
    }

    const computedStore = {indicator: indicator, race: race, year: year, colorScale: scale}
    return(
        <React.Fragment>
        <Swatches>
            {arbitraryArray.map((ele,i,arr)=>{
                console.log('swatch')
                return <Swatch
                    fill = {scale(i*(100/classes))}
                />   
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
}


export default ColorPreviewer
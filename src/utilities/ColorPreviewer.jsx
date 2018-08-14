

import React from 'react'
import styled from 'styled-components'
import chroma from 'chroma-js'

import {mapValues} from 'lodash'

import indicators from '../data/indicators'

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
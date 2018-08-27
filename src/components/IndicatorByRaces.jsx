
import React from 'react'
import styled from 'styled-components'
import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

import HorizontalBarGraph from './HorizontalBarGraph'

const races = [
    'asian', 'black', 'latinx', 'white', 'other'
]

export default class IndicatorByRaces extends React.Component{
    render(){
        const {indicator, year, county} = this.props.store
        const ind =  county? indicators[indicator].counties[county] : indicators[indicator].counties.california
        const indicatorPerformanceByRace = races.map((race)=>{
            // const value = !ind[race][year] || ind[race][year]==='*'? 0 : ind[race][year]
            return {
                id: race,
                label: race,
                // value: value
                value: ind[race][year]
            }
        })
        // console.log(indicatorPerformanceByRace)
        return(
            <div>
                

                <HorizontalBarGraph
                    header = {`${semanticTitles[indicator].label} in ${county || 'california'}, by race:`}
                    bars = {indicatorPerformanceByRace}
                    labelWidth = {70}
                />
            </div>
        )
    }
} 

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
            return {
                label: race,
                value: ind[race][year] 
            }
        })
        console.log(indicatorPerformanceByRace)
        return(
            <div>
                

                <HorizontalBarGraph
                    header = {`${semanticTitles[indicator].label} in ${county || 'california'}, by race:`}
                    bars = {indicatorPerformanceByRace}
                />
            </div>
        )
    }
} 
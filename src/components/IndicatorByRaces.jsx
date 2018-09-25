
import React from 'react'
import styled from 'styled-components'
import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

import HorizontalBarGraph from './HorizontalBarGraph'

import {capitalize} from '../utilities/toLowerCase'

const races = [
    'asian', 'black', 'latinx', 'white', 'other'
]

const FaintLabel = styled.span`
    color: var(--fainttext);
`

export default class IndicatorByRaces extends React.Component{
    render(){
        const {indicator, year, county, colorScale} = this.props.store
        const ind =  county? indicators[indicator].counties[county] : indicators[indicator].counties.california
        const indicatorPerformanceByRace = races.map((race)=>{
            let isSomeBullshit = false
            let val
            if(ind[race][year]===0 || (ind[race][year] && ind[race][year]!=='*')){
                //use value as is
                val = ind[race][year]
            }
            else{
                //trueValue is N/A
                val = 0
                isSomeBullshit = ind[race][year]==='*'? 'Data set too small or unstable' : 'No data'
                isSomeBullshit = (<FaintLabel>{isSomeBullshit}</FaintLabel>)
            }

            return {
                id: race,
                label: capitalize(race),
                value: val,
                trueValue: isSomeBullshit || false,
                // value: ind[race][year],
                fill: colorScale? colorScale(ind[race][year]) : ''
            }
        })
        // console.log(indicatorPerformanceByRace)
        return(
            <div>
                <HorizontalBarGraph
                    // header = {`${semanticTitles[indicator].label} in ${county || 'california'}, by race:`}
                    header = "By Race"
                    bars = {indicatorPerformanceByRace}
                    labelWidth = {100}
                />
            </div>
        )
    }
} 
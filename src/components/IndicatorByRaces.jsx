
import React from 'react'
import styled from 'styled-components'
import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

import HorizontalBarGraph from './HorizontalBarGraph'

import {capitalize} from '../utilities/toLowerCase'

const races = [
    'asian', 'black', 'latinx', 'white', 'other'
]


const Label = styled.span`
    color: ${props => props.invalid? 'var(--fainttext)' : props.selected?  'var(--strokepeach)' : 'var(--normtext)'};
    span{
        color: ${props => props.selected? 'var(--peach)' : 'var(--fainttext)'};
    }
`
const Wrapper = styled.div`
    margin-top: 45px;

`

export default class IndicatorByRaces extends React.Component{
    render(){
        const {indicator, year, county, colorScale} = this.props.store
        const selectedRace = this.props.store.race
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
                isSomeBullshit = (<Label invalid>{isSomeBullshit}</Label>)
            }
            const who = semanticTitles[indicator].shortWho || semanticTitles[indicator].who
            const selected = race===selectedRace
            return {
                id: race,
                label: <Label selected = {selected}>{capitalize(race)}<span> {who}</span></Label>,
                value: val,
                trueValue: isSomeBullshit || false,
                // value: ind[race][year],
                fill: race===selectedRace? 'var(--peach)' : colorScale? colorScale(ind[race][year]) : ''
            }
        })
        // console.log(indicatorPerformanceByRace)
        return(
            <Wrapper>
                <HorizontalBarGraph
                    // header = {`${semanticTitles[indicator].label} in ${county || 'california'}, by race:`}
                    selectable
                    header = {<Label><span>Indicator breakdown</span> by race</Label>}
                    bars = {indicatorPerformanceByRace}
                    labelWidth = {140}
                    selectBar = {(val)=>this.props.store.completeWorkflow('race', val)}
                />
            </Wrapper>
        )
    }
} 
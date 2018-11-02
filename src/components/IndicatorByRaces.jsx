
import React from 'react'
import styled from 'styled-components'
import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

import HorizontalBarGraph from './HorizontalBarGraph'

import {capitalize} from '../utilities/toLowerCase'
import media from '../utilities/media'

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
    // margin-top: 45px;
    position: absolute;

    width: 100%;
    bottom: 0;
    z-index: 1;
    transform: translateY(${props => props.offset}px);
    transition: transform .35s;
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
                isSomeBullshit = ind[race][year]==='*'? 'Data too small or unstable' : 'No data'
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
            <Wrapper
                offset = {this.props.expand? -150 : -50}
            >
                <HorizontalBarGraph
                    // header = {`${semanticTitles[indicator].label} in ${county || 'california'}, by race:`}
                    expandable
                    expandHeight = {150}
                    collapseHeight = {50}
                    fullHeight = {this.props.expand}

                    selectable
                    header = {<Label><span>Indicator breakdown</span> by race</Label>}
                    bars = {!this.props.allCounties? indicatorPerformanceByRace : []}
                    labelWidth = {150}
                    selectBar = {(val)=>this.props.store.completeWorkflow('race', val)}
                />
            </Wrapper>
        )
    }
} 
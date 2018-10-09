import React from 'react'
import styled, {keyframes} from 'styled-components'
import FlipMove from 'react-flip-move'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import commaNumber from 'comma-number'

import IndicatorByRaces from './IndicatorByRaces'
import IndicatorByCounties from './IndicatorByCounties'
import CountiesByRacePopulation from './CountiesByRacePopulation'


import DemoDataTable from './DemoDataTable'
import {FullSourcesView} from './Sources'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

import {getMedia} from '../utilities/media'

const Wrapper = styled.div`
    height: calc(100% - ${props=>props.offset}px);
    overflow: ${props=>props.tempNotesOverride? 'visible' : 'hidden'};
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    transition: transform .25s;
    transform: translateY(${props=>props.offset}px);
    margin-top: -5px;
`

const BreakdownBox = styled.div`
    flex-grow: 1;
`
const BottomTable = styled.div`
    margin-top: 20px;
`


@observer
export default class Breakdown extends React.Component{

    render(){

        const {store, offset} = this.props
        const {indicator, county, race, year} = store
        const screen = getMedia()
        //CALCULATE # ENTRIES FOR FIRST CHART FROM OFFSET + HASRACE

        let entryCount = 0
        if(indicator){
            const hasRace = indicators[indicator].categories.includes('hasRace')
            console.log(hasRace?'has race chart':'no race graph', 'offset:',offset)
            if(screen==='optimal'){
               if(hasRace){ //halfish of breakdown is used up by race comparison
                    if(offset >= 80) entryCount = 8
                    else if(offset >= 40) entryCount = 11
                    else entryCount = 11
                }
                else{
                    if(offset >= 80) entryCount = 15
                    else if(offset >= 40) entryCount = 20
                    else entryCount = 20
                }
            }if(screen==='compact'){
               if(hasRace){ //halfish of breakdown is used up by race comparison
                    if(offset >= 80) entryCount = 5
                    else if(offset >= 40) entryCount = 7
                    else entryCount = 10
                }
                else{
                    if(offset >= 80) entryCount = 10
                    else if(offset >= 40) entryCount = 12
                    else entryCount = 18
                }
            }
         
        }


        return(
            <Wrapper 
                offset = {this.props.offset}
                tempNotesOverride = {this.props.sources}

            >
                {!this.props.sources && indicator &&  
                    <IndicatorByCounties 
                        entries = {entryCount}
                        store = {store}
                    />  
                }
                {!this.props.sources && indicator && indicators[indicator].categories.includes('hasRace') &&

                    <IndicatorByRaces
                        store = {store}
                    />
                }
                {indicator && this.props.sources &&
                    <FullSourcesView indicator = {indicator} />
                }
            </Wrapper>
        )
    }

}


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
                    if(offset >= 80) entryCount = 3
                    else if(offset >= 40) entryCount = 5
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
            <Wrapper offset = {this.props.offset}>

                    {!this.props.sources && indicator &&  
                        // 'county performance distribution and indicator by race'
                        <IndicatorByCounties 

                            entries = {entryCount}
                            // key = {indicator+county+year+race} //kills anims but works
                            store = {store}
                            // indicator = {indicator}
                            // county = {county}
                            // race = {race}
                            // year = {year}
                        />  
                    }
                    {!this.props.sources && indicator && indicators[indicator].categories.includes('hasRace') &&
                        <BottomTable>
                        <IndicatorByRaces
                            store = {store}
                        />
                        </BottomTable>
                    }
                    {/*!indicator && county && !race &&
                         // 'population race % breakdown and county demographic data'
                         <React.Fragment>
                         <RaceRowTable 
                            clickRace = {store.completeWorkflow}
                            demo = {demopop[county]}
                        />

                        <DemoDataTable store = {store} />
                        </React.Fragment>
                    */}
                    {/*!county && race &&
                        <CountiesByRacePopulation 
                            store = {store}
                        />
                    */}
                    {indicator && this.props.sources &&
                        <FullSourcesView indicator = {indicator} />
                    }


           

            </Wrapper>
        )
    }

}

const RaceRow = styled.div`
    display: flex;
    // justify-content: space-between;
`   
const RaceLabel = styled.div`
`
const RacePct = styled.div`
    width: 5rem;
    margin-left: 15px;
    text-align: right;
`
const races = ['asian','black','latinx','white','other']
const RaceRowTable = (props) => {
    return(
        <RowTable className = 'race'>
            {races.map((race)=>{
                return (
                    <RaceRow
                        onClick = {()=>props.clickRace('race',race)}
                    >
                        <RaceLabel>{race}</RaceLabel>
                        <RacePct>{props.demo[race]}%</RacePct>
                    </RaceRow>
                ) 
            })}
        </RowTable>
    )
}
const RowTable = styled.div`
    &.race{
        margin-left: 30px;
    }   
`

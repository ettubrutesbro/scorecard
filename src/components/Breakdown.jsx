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


import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

const Wrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const BreakdownBox = styled.div`
    padding: 30px;
    margin: 0px 30px 30px 30px;
    border: 1px solid #dedede;
    flex-grow: 1;
`

export default class Breakdown extends React.Component{
    render(){
        const {store} = this.props
        const {indicator, county, race} = store
        return(
            <Wrapper>

                <BreakdownBox>
                    {indicator && !race &&  
                        // 'county performance distribution and indicator by race'
                        <IndicatorByCounties 
                            store = {store}
                        />  
                    }
                    {indicator && !race && indicators[indicator].categories.includes('hasRace') &&
                        <IndicatorByRaces
                            store = {store}
                        />
                    }
                    {!indicator && county && !race &&
                         // 'population race % breakdown and county demographic data'
                         <React.Fragment>
                         <RaceRowTable 
                            clickRace = {store.completeWorkflow}
                            demo = {demopop[county]}
                        />

                        <DemoDataTable store = {store} />
                        </React.Fragment>
                    }
                    {!county && race &&
                        <CountiesByRacePopulation 
                            store = {store}
                        />
                    }
                </BreakdownBox>

           

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

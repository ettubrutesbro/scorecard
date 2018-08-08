import React from 'react'
import styled, {keyframes} from 'styled-components'
import FlipMove from 'react-flip-move'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import commaNumber from 'comma-number'
import IndicatorPrompt from './IndicatorPrompt'

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
            <FlipMove
                delay = {350}
                duration = {500}
                appearAnimation = {{
                    from: {transform: 'translateY(-100%)', opacity: 0},
                    to: {transform: 'translateY(0)', opacity: 1}    
                }}
            >
                <BreakdownBox>
                    {indicator && !county && !race && 
                        'county performance distribution and indicator by race'

                    }
                    {!indicator && county && !race &&
                         // 'population race % breakdown and county demographic data'
                         <React.Fragment>
                         <RaceRowTable 
                            clickRace = {store.completeWorkflow}
                            demo = {demopop[county]}
                        />

                        <DemoDataTable demo = {demopop[county]} />
                        </React.Fragment>
                    }
                    {!indicator && !county && race && 'counties with the most children of this race (number not percent)'}
                </BreakdownBox>
            </FlipMove>
           

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
const races = ['asian','black','latino','white','other']
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
const DemoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const DemoLabel = styled.div`
`
const DemoValue = styled.div`
    margin-left: 15px;
` 
const DemoDataTable = (props) => {
    return(
        <RowTable>
            <DemoRow> 
                <DemoLabel>in Immigrant Families: </DemoLabel>
                <DemoValue> {commaNumber(props.demo.immigrantFamilies)} </DemoValue>
            </DemoRow>
            <DemoRow> 
                <DemoLabel>in Poverty: </DemoLabel>
                <DemoValue> {props.demo.poverty}% </DemoValue>
            </DemoRow>
            <DemoRow> 
                <DemoLabel>who are Homeless:</DemoLabel>
                <DemoValue> {commaNumber(props.demo.homeless)} </DemoValue>
            </DemoRow>
        </RowTable>
    )
}
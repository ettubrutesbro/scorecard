
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'

import demopop from '../data/demographicsAndPopulation'
import FlipMove from 'react-flip-move'

const Container = styled.div`
    display: inline-flex;
    border: 1px solid black;
    padding: 30px;
`

const centerText = css`
     display: flex;
        flex-direction: column;
        justify-content: center;
        height: ${props=> props.height}px;
`

const LabelColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100px;
    margin-right: 30px;
`
const RaceLabel = styled.div`
    /*position: absolute;*/
    display: flex;
    /*border: 1px solid black;*/
    /*margin-right: 30px;*/
    ${props => props.centerText? centerText: 'flex-grow: 1'};

`
const LabelPct = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`
const Label = styled.div`
    
`
const Percentage = styled.div`
    margin-left: 10px;
`
const VertBar = styled.div`
    position: relative;
    height: 500px; //arbitrary
    // outline: 1px solid #999999;
    // box-sizing: border-box;
    width: 40px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`
const Segment = styled.div`
    position: absolute;
    top: -100%;
    width: 100%;
    background-color: ${props=>props.selected?'rgba(239,103,50,0.25)':'white'};
    height: 100%;
    transition: transform .5s, background-color .25s;
    transform: translateY(${props=>props.offset}px);
    transform-origin: 50% 0%;
    // background-color: ${props=>props.fill};
    // outline: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
    &.asian{
        background-color: red;
    }
    &.black{
        background-color: blue;
    }
    &.latinx{ background-color: green;}
    &.white{background-color: orange;}
    &.other{background-color: grey;}
`
const Hatch = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    transform: translateY(${props=>props.offset}px);
    border-top: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
`
const races = [
    'asian',
    'black',
    'latinx',
    'white',
    'other'
]
@observer
export default class RaceBreakdownBar extends React.Component{
    @observable height = 500 //TODO: need to findDOMNode this shit

    render(){
        let {county} = this.props.store
        if(!county) county = 'california'
        county = demopop[county]

        const racePercentages = races.map((race)=>{
            return {label:race, percentage: county[race]}
        }).sort((a,b)=>{
            return b.label === 'other'? -2 : a.percentage > b.percentage? -1 : a.percentage < b.percentage? 1 : 0
        })
        return(
            <Container>
            <LabelColumn>
                <FlipMove typeName = {null}>
                {racePercentages.map((race,i,arr)=>{
                    const previousSegs = arr.slice(0,i)
                    const offset = previousSegs.map((seg)=>{return seg.percentage}).reduce((a,b)=>a+b,0)
                    return <RaceLabel
                        key = {race.label}
                        centerText 
                        // offset = {((race.percentage+offset)/100)*this.height}
                        height = {(race.percentage/100) * this.height}
                    > 
                        <LabelPct>
                            <Label>{race.label[0].toUpperCase()+race.label.substr(1)}</Label>
                            <Percentage>{race.percentage}%</Percentage> 
                        </LabelPct>
                    </RaceLabel>  
                })}
                </FlipMove>

            </LabelColumn>
            <VertBar>

                {racePercentages.map((o,i,arr)=>{
                    const previousSegs = arr.slice(0,i)
                    const offset = previousSegs.map((seg)=>{return seg.percentage}).reduce((a,b)=>a+b,0)
                    return <Segment
                        key = {i}
                        style = {{zIndex: arr.length-i}}
                        className = {o.label}
                        offset = {((o.percentage+offset)/100)*this.height}
              
                    />
                })}
            </VertBar>
            </Container>
        )
    }
}

RaceBreakdownBar.defaultProps = {

}

import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'

import demopop from '../data/demographicsAndPopulation'
import FlipMove from 'react-flip-move'

const Container = styled.div`
    display: flex;
    // border: 1px solid black;
    // padding: 30px;
    box-sizing: border-box;
    flex-direction: column;

    height: 256px;
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
    align-items: flex-end;
    width: 100px;
    // outline: 1px solid green;
    margin-right: 30px;
`
const RaceLabel = styled.div`
    font-size: 13px;
    // text-align: right;
    position: absolute;
    // height: 0;
    display: flex;
    // align-items: center;
    ${props => props.centerText? centerText: ''};
    transform: translateY(${props=>props.offset}px);
    &.compressed1{
        /*border: 1px solid pink;*/
        margin-top: -.5rem;
    }
    &.compressed2{
        height: 1rem;
        /*margin-bottom: 1rem;*/
        border: 1px solid red;
        margin-top: -1rem;
    }
    &.compressed2 ~ .compressed2{
        border: 1px solid green;
        /*margin-bottom: 2rem;*/
        margin-top: -2rem;
    }

`
const LabelPct = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`
const Label = styled.div`
    
`
const Percentage = styled.div`
    margin-left: 7px;
    font-weight: bold;
`
const VertBar = styled.div`
    position: relative;
    // height: 500px; //arbitrary
    height: ${props => props.height}%;
    // outline: 1px solid #999999;
    // padding: 30px;
    box-sizing: border-box;
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
    transform: translateY(${props=>props.offset}%);
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
const Title = styled.div`
    width: 100%;
    margin-bottom: 20px;
`
const Content = styled.div`
    width: 100%;
    display: flex;
    height: 100%;
`

const races = [
    'asian',
    'black',
    'latinx',
    'white',
    'other'
]

const clt = 12 //compressed label threshold

@observer
export default class RaceBreakdownBar extends React.Component{


    componentDidMount(){
        // this.setHeight(this.container)
        console.log(findDOMNode(this.labelcolumn).offsetHeight)
    }

    setHeight = (node) => {
        // console.log(findDOMNode(node).offsetHeight)
    }
    render(){
        let {county} = this.props.store
        if(!county) county = 'california'
        county = demopop[county]

        let numOfCompressedLabels = 0

        const racePercentages = races.map((race)=>{
            const pct = county[race]
            if(pct < clt && pct > 0) numOfCompressedLabels++
            return {label:race, percentage: pct}
        }).sort((a,b)=>{
            return b.label === 'other'? -2 : a.percentage > b.percentage? -1 : a.percentage < b.percentage? 1 : 0
        })

        console.log('number of compressed labels:', numOfCompressedLabels)
        return(
            <Container 
                // innerRef = {(container)=>{this.container = container}}
            >
            <Title>
                Race breakdown
            </Title>
            <Content>
            <LabelColumn
                innerRef = {(column) => this.labelcolumn = column}
                centerText = {this.props.centerText}
            >
                {racePercentages.map((race,i,arr)=>{
                    const previousSegs = arr.slice(0,i)
                    return(

                        <LabelSection 
                            pct = {race.percentage}
                        >
                            <Label> {race.label[0].toUpperCase()+race.label.substr(1)} </Label>
                            <Percentage> {race.percentage} </Percentage>
                        </LabelSection>
                    )
                })}

            </LabelColumn>
            <VertBar
                // height = {this.props.height}
            >

                {racePercentages.map((o,i,arr)=>{
                    const previousSegs = arr.slice(0,i)
                    const offset = previousSegs.map((seg)=>{return seg.percentage}).reduce((a,b)=>a+b,0)
                    return <Segment
                        key = {i}
                        style = {{zIndex: arr.length-i}}
                        className = {o.label}
                        offset = {((o.percentage+offset))}
              
                    />
                })}
            </VertBar>
            </Content>
            </Container>
        )
    }
}

const LabelSection = styled.div`
    display: flex;
    align-items: center;
    font-size: 13px;
    // height: 13px;
    height: ${props => props.pct}%;
    min-height: 15px;
    // border: 1px solid blue;
`

RaceBreakdownBar.defaultProps = {

}
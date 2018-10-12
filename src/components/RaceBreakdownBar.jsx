
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'

import demopop from '../data/demographicsAndPopulation'
import FlipMove from 'react-flip-move'

import media from '../utilities/media'

const Container = styled.div`
    display: flex;
    // border: 1px solid black;
    // padding: 30px;
    box-sizing: border-box;
    flex-direction: column;
    @media ${media.optimal}{
        height: 320px;
    }
    @media ${media.compact}{
        height: 256px;   
    }
`

const centerText = css`
     display: flex;
        flex-direction: column;
        justify-content: center;
        height: ${props=> props.height}px;
`

const RaceLabel = styled.div`
    position: absolute;
    display: flex;
    ${props => props.centerText? centerText: ''};
    transform: translateY(${props=>props.offset}px);
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
    background-color: white;
    // outline: 1px solid #999999;
    outline: 2px solid var(--bordergrey);
    // padding: 30px;
    box-sizing: border-box;
    width: 40px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`
const hatch1 = require('../assets/hatch1-2.svg')
const hatch2 = require('../assets/hatch2-4.svg')
const hatch3 = require('../assets/hatch3-2.svg')
const hatch4 = require('../assets/hatch4-2.svg')
const hatch5 = require('../assets/hatch5-2.svg')


const Segment = styled.div`
    position: absolute;
    top: ${props=>props.offset}%;
    height: ${props=>props.pct}%;
    width: 100%;
    outline: 2px solid var(--bordergrey);
    mask-repeat: repeat;
    background-color: var(--bordergrey);
    background-position: 0% -10px;
    /*background-size: 40px 215px;*/
    mask-size: 30px;

    &.asian{
        mask-image: url(${hatch3});
    }
    &.black{
        mask-image: url(${hatch4});

    }
    &.latinx{ 
        mask-image: url(${hatch1});
        mask-size: 30px;

    }
    &.white{
        mask-image: url(${hatch2});

    }
    &.other{
        mask-image: url(${hatch5});
    }
`
const Hatch = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    transform: translateY(${props=>props.offset}px);
    border-top: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
`

const Notch = styled.div`
    position: absolute;
    width: 100%;
    top: ${props=>props.offset}%;
    border-top: 1px solid var(--bordergrey);
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
        // console.log(findDOMNode(this.labelcolumn).offsetHeight)
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
            <Content>

            <VertBar
                // height = {this.props.height}
            >

                {racePercentages.map((o,i,arr)=>{
                    const previousSegs = arr.slice(0,i)
                    const offset = previousSegs.map((seg)=>{return seg.percentage}).reduce((a,b)=>a+b,0)
                    console.log(o.percentage)
                    return (
                        <React.Fragment>
                            <Segment
                                key = {i}
                                style = {{zIndex: arr.length-i}}
                                className = {o.label}
                                pct = {o.percentage}
                                  offset = {i===0? 0 : offset}
                            />
                            {i>0 && i<(arr.length-1) && 
                                <Notch
                                    offset = {offset}
                                />
                            }
                        </React.Fragment>
                    )
                })}

            </VertBar>
                        <LabelColumn
                ref = {(column) => this.labelcolumn = column}
                centerText = {this.props.centerText}
            >
                {racePercentages.map((race,i,arr)=>{
                    const previousSegs = arr.slice(0,i)
                    return(
                        <LabelSection 
                            key = {'rbblabelsection'+i}
                            hide = {race.percentage === 0}
                            pct = {race.percentage}
                        >
                            <Label> {race.label[0].toUpperCase()+race.label.substr(1)} </Label>
                            <Percentage> {race.percentage}% </Percentage>
                        </LabelSection>
                    )
                })}

            </LabelColumn>
            </Content>
            </Container>
        )
    }
}

const LabelColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100px;
    margin-left: 27px;
    height: calc(100% + 4px);
`
const LabelSection = styled.div`
    position: relative;
    display: ${props=>!props.hide?'flex':'none'};
    align-items: center;

        @media ${media.optimal}{   
        font-size: 16px;   
    }
    @media ${media.compact}{   
        font-size: 13px;   
    }
    height: ${props => props.pct}%;
    min-height: 15px;
    &::after{
        content: '';
        position: absolute;
        height: 0; 
        width: 15px;
        border-bottom: 1px solid var(--bordergrey);
        border-top: 1px solid var(--bordergrey);
        left: -25px;
    }
`

RaceBreakdownBar.defaultProps = {

}
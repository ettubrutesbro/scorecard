
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
    box-sizing: border-box;
    flex-direction: column;
    @media ${media.optimal}{
        height: 305px;
    }
    @media ${media.compact}{
        height: 275px;   
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
    ${props => props.selected? 'color: var(--strokepeach);' : ''}
`
const Percentage = styled.div`
    margin-left: 7px;
    font-weight: bold;
     ${props => props.selected? 'color: var(--strokepeach);' : ''}
`
const VertBar = styled.div`
    position: relative;
    // height: 500px; //arbitrary
    height: ${props => props.height}%;
    background-color: white;
    // outline: 1px solid #999999;
    border: 2px solid var(--bordergrey);
    // padding: 30px;
    box-sizing: border-box;
    width: 50px;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
`
const hatch1 = require('../assets/hatch1-2.svg')
const hatch2 = require('../assets/hatch2-4.svg')
const hatch3 = require('../assets/hatch3-2.svg')
const hatch4 = require('../assets/hatch4-2.svg')
const hatch5 = require('../assets/hatch5-2.svg')

const SelectionAccent = styled.div`
    position: absolute;
    top: calc(${props=>props.offset}% ${props=>!props.first?'+ 1px' : ''});
    height: calc(${props=>props.pct}% ${props=>!props.first?'- 1px' : ''});
    outline: 2px solid var(--peach);
    width: 100%;
    z-index: 10;
`
const Segment = styled.div`
    position: absolute;
    top: ${props=>props.offset}%;
    height: ${props=>props.pct}%;
    width: 100%;
    outline: 2px solid var(--bordergrey);
    mask-repeat: repeat;
    background-color: ${props => props.infinitesimal? 'var(--bordergrey)' : props.selected? 'var(--peach)' :  'var(--bordergrey)'};
    background-position: 0% -10px;
    mask-size: 30px;
    ${props => props.zero? 'display: none;' : ''}
    &.asian{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch3})` : 'none'};
    }
    &.black{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch4})` : 'none'};

    }
    &.latinx{ 
        mask-image: ${props=>!props.infinitesimal? `url(${hatch1})` : 'none'};

    }
    &.white{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch2})` : 'none'};

    }
    &.other{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch5})` : 'none'};
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
        let {county, race} = this.props.store
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
        const totalOfPcts = racePercentages.map((o)=>{return o.percentage}).reduce((a,b)=>{return a+b})
        if(totalOfPcts!==100) console.log('non-100 total percentage for race breakdown: ', totalOfPcts)

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
                    const offset = previousSegs.map((seg)=>{
                        return (seg.percentage * 100) / totalOfPcts
                        
                    }).reduce((a,b)=>a+b,0)
                    
                    const pct = totalOfPcts!==100? o.percentage * 100 / totalOfPcts : o.percentage


                    return (
                        <React.Fragment>
                            {race===o.label && 
                                <SelectionAccent 
                                    pct = {pct}
                                    first = {i===0}
                                    offset = {i===0? 0 : offset}
                                />
                            }
                            <Segment
                                key = {i}
                                style = {{zIndex: arr.length-i}}
                                className = {o.label}
                                pct = {pct}
                                offset = {i===0? 0 : offset}
                                infinitesimal = {pct < 3}
                                zero = {pct == 0}
                                selected = {o.label===race}
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
                {racePercentages.map((o,i,arr)=>{
                    const selected = o.label === race
                    return(
                        <LabelSection 
                            key = {'rbblabelsection'+i}
                            hide = {o.percentage === 0}
                            pct = {o.percentage}
                            lastAndSmall = {i===arr.length-1 && o.percentage < 10}
                            small = {i<arr.length-1 && o.percentage < 10}
                            selected = {selected}
                        >
                            <Label selected = {selected}> {o.label[0].toUpperCase()+o.label.substr(1)} </Label>
                            <Percentage selected = {selected}> {o.percentage}% </Percentage>
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
    position: relative;
    align-items: flex-start;
    width: 100px;
    margin-left: 25px;
    height: 100%;
    justify-content: space-between;
`
const LabelSection = styled.div`
    position: relative;

    // outline: 1px solid grey;
    display: ${props=>!props.hide?'flex':'none'};
    align-items: center;
    flex-grow: 1;

        @media ${media.optimal}{   
        font-size: 16px;   
    }
    @media ${media.compact}{   
        font-size: 13px;   
    }
    flex-basis: ${props => props.pct}%;
    min-height: 15px;
    padding-top: ${props => props.lastAndSmall? '10px' : 0};
    &::after{
        content: '';
        position: absolute;
        height: 0; 
        width: 15px;
        ${props => !props.small && props.selected? 'border-top: 2px solid var(--peach);'
            : !props.small? `border-top: 2px solid var(--bordergrey);`
        : ''}
        ${props => props.lastAndSmall? 'bottom: 0;' : ''}
        left: -25px;
    }
`

RaceBreakdownBar.defaultProps = {

}
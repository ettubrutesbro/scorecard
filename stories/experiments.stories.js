import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import ReactTooltip from 'react-tooltip'
import CountUp from 'react-countup'

import demopop from '../src/data/demographicsAndPopulation'
import countyLabels from '../src/assets/countyLabels'

import CountingNumber from '../src/components/CountingNumber'
import ExpandBox from '../src/components/ExpandBox'
import {Sprite} from '../src/components/generic/Icon'

import media from '../src/utilities/media'


addDecorator(withKnobs)

const AbsTarget = styled.div`
    position: absolute;
    bottom: 100px;
    right: 200px;
    border: 1px solid black;
    padding: 20px;

`

const TestTip = styled.div`
    background: black;
    padding: 10px;
    margin-top: 10px;
    color: white;

`

const Iono = styled.div`
    position: absolute;
    top: 0;
    background: var(--offwhitefg);
    width: 100vw; height: 100vh;
`
const MockContent = styled.div`
    /*border: 1px solid blue;*/
    width: 100%;
    height: 200px;
    &.more{
        height: 500px;
    }



`
const MockExpandButton1 = styled.div`

    display: inline-flex;
    align-items: center;
    padding: 10px 17px;
    font-size: 13px;
`
const MockExpandButton2 = styled.div`
position: absolute;
right: 0; top: 0;
    display: inline-flex;
    padding: 10px 17px;
    border: 1px solid green;
`


const Ruler = styled.div`
    position: absolute; 
    top: 100px; left: 300px;
    outline: 3px solid red;
    width: 20px;
    height: 500px;
    &::after{
        content: '';
        position: absolute;
        top: 200px;
        border: 1px solid blue;
        width: 100%;
    }
`

storiesOf('Experiments', module)
.add('Sprite',()=>{
    const tog = boolean('toggle sprite state', false)
    return(
        <Iono>
        <Sprite 
            img = "chevsprite" 
            color = "strokepeach"
            state = {tog?'up':'down'}
        />
        </Iono>
    )
})

// .add('ExpandAllBox (adapted from GHW)', ()=>{
//     const mode = select('mode',['idle','expanded','backButton'], 'idle')
//     return(
//         <ExpandTest
//             currentMode = {mode}
//             modes = {{
//                 idle: {width: 100, height: 100},
//                 expanded: {width: 100, height: 200},
//                 backButton: {width: 40, height: 100}
//             }}
//         />    
//     )
// })

.add('New Race Breakdown Bar', ()=>{
    const county = select('county' ,Object.keys(countyLabels), 'alameda')
    const clt = 12 //compressed label threshold (% below which label becomes compressed)
    const races = ['asian','black','latinx','white','other']

    const arbitraryRaceColor = {
        asian: 'red',
        black: 'blue',
        latinx: 'green',
        white: 'orange',
        other: 'beige'
    }

    let numOfCompressedLabels

    const racePercentages = races.map((race)=>{
        const pct = demopop[county][race]
        if(pct < clt && pct > 0) numOfCompressedLabels++
        return {label:race, percentage: pct}
    }).sort((a,b)=>{
        return b.label === 'other'? -2 : a.percentage > b.percentage? -1 : a.percentage < b.percentage? 1 : 0
    })
    console.log(racePercentages)

    const totalOfPcts = racePercentages.map((o)=>{return o.percentage}).reduce((a,b)=>{return a+b})
        
    console.log('total of pcts', totalOfPcts)
    const totalHeight = number('total rbb height', 500)

    return(
        <RaceBreakdown height = {totalHeight}>
        <RaceBar>
        {racePercentages.map((race,i,arr)=>{
            const previousSegs = arr.slice(0,i)
            const offset = previousSegs.map((seg)=>{
                return (seg.percentage * 100) / totalOfPcts
            }).reduce((a,b)=>a+b,0)

            return (
                <React.Fragment>
                <Backing 
                    key = {'backing'+i}
                    offset = {(offset/100) * totalHeight}
                />
                <RaceSegment
                    key = {i}
                    offset = {(offset/100) * totalHeight}
                    className = {race.label}
                    style = {{
                        position: 'absolute',
                        // backgroundColor: arbitraryRaceColor[race.label], 
                        height: '500px',
                        width: '100%'
                    }}
                />
                <Hatch key = {'hatch'+i} offset = {(offset/100) * totalHeight} />
                <LabelNotch 
                    key = {'labelnotch'+i} 
                    offset = {((offset+(race.percentage/2))/100) * totalHeight} 
                />
                </React.Fragment>
            )
        })
        }
        </RaceBar>
        </RaceBreakdown>
    )
})

.add('CountUp',()=>{
    const opts = {
        first: [0,100],
        second: [40,60],
        third: [25,75]
    }
    const numberset = select('number set',opts,opts.first)

    const firstNumber = number('numb',0)
    const secondNumber= number('2nd numb',100)

    console.log(numberset)
    return(
        <CountUp
            start = {firstNumber}
            end = {secondNumber}
        />
    )
})
.add('CountingNumber', ()=>{
    const num = number('go to number', 100)
    return(
        <CountingNumber 
            number = {num}
        />
    )
})
.add('ReactTooltip',()=>{
    return(
        <div>
            <div data-tip = "hi"> Normal target? </div>
            <ReactTooltip />
            <AbsTarget data-tip = "Hello world"> Absolutely positioned</AbsTarget>

        </div>
    )
})

const RaceBar = styled.ul`
    position: relative;
    outline: 2px teal solid; 
    height: 100%;
    width: 50px;
    // overflow: hidden;
`
const hatch1 = require('../src/assets/hatch1-2.svg')
const hatch2 = require('../src/assets/hatch2-4.svg')
const hatch3 = require('../src/assets/hatch3-2.svg')
const hatch4 = require('../src/assets/hatch4-2.svg')
const hatch5 = require('../src/assets/hatch5-2.svg')


const Backing = styled.div`
    position: absolute;
    top: 0; left: 0;
    transition: transform .35s;
    transform: translateY(${props=>props.offset}px);    
    background: white;
    width: 100%;
    height: 500px;
`
const Hatch = styled.div`
     position: absolute;
    top: 0; left: 0;
    transition: transform .35s;
    transform: translateY(${props=>props.offset}px);    
    height: 0;
    width: 100%;
    border-top: 1px solid var(--bordergrey);
    border-bottom: 1px solid var(--bordergrey);
`

const RaceSegment = styled.div`
    position: absolute;
    top: 0; left: 0;
    transition: transform .35s;
    transform: translateY(${props=>props.offset}px);

    outline: 2px solid var(--bordergrey);
    mask-repeat: repeat;
    background-color: ${props => props.infinitesimal? 'var(--bordergrey)' : props.selected? 'var(--peach)' :  'var(--bordergrey)'};
    // mask-position: 0% -10px;

    mask-size: 30px;
    ${props => props.zero? 'display: none;' : ''}
    &.asian{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch3})` : 'none'};
        mask-position-y: -7px;
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

const LabelNotch = styled.div`
    
    position: absolute;
    top: 0; right: -25px;
    width: 25px; border-top: 1px solid var(--bordergrey);
    transition: transform .35s;
    transform: translateY(${props=>props.offset}px);    
`

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
const Label = styled.div`
    ${props => props.selected? 'color: var(--strokepeach);' : ''}
`
const Percentage = styled.div`
    margin-left: 7px;
    font-weight: bold;
     ${props => props.selected? 'color: var(--strokepeach);' : ''}
`

const RaceBreakdown = styled.div`
    height: ${props=>props.height}px;
    position: relative;
    display: flex;

`
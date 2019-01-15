import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import CountUp from 'react-countup'

import demopop from '../src/data/demographicsAndPopulation'
import countyLabels from '../src/assets/countyLabels'

import CountingNumber from '../src/components/CountingNumber'
import ExpandBox from '../src/components/ExpandBox'
import {Sprite} from '../src/components/generic/Icon'
import RaceBreakdownBar from '../src/components/RaceBreakdownBar'
import SearchInput from '../src/components/SearchInput.jsx'

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
.add('searchinput', ()=>{
    return(
        <SearchInput 

        />
    )
})
.add('Sprite',()=>{
    const tog = boolean('toggle sprite state', false)
    return(
        <Iono>
        <Sprite 
            img = "chevsprite" 
            color = "strokepeach"
            state = {tog?'up':'down'}
        />
        <Sprite 
            img = "caretx" 
            color = "normtext"
            state = {tog?'up':'down'}
            duration = {.2}
            width = {25} height = {25}
        />
        <Sprite
            img = 'ind'
            color = 'normtext'
            state = {tog?'up':'down'}
            duration = {.25}
            width = {30} height = {30}
        />
        <Sprite
            img = 'county'
            color = 'normtext'
            state = {tog?'up':'down'}
            duration = {.25}
            width = {30} height = {30}
        />
        </Iono>
    )
})


.add('New Race Breakdown Bar', ()=>{
    const county = select('county' ,Object.keys(countyLabels), 'alameda')

    const totalHeight = number('total rbb height', 250)

    return(
        <RaceBreakdownBar
            height = {totalHeight}
            store = {{
                county: county
            }}
        />
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
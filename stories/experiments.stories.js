import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'

import ReactTooltip from 'react-tooltip'
import CountUp from 'react-countup'

import CountingNumber from '../src/components/CountingNumber'

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
storiesOf('Experiments', module)
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
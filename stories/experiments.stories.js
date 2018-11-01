import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import ReactTooltip from 'react-tooltip'
import CountUp from 'react-countup'


import CountingNumber from '../src/components/CountingNumber'
import ExpandBox from '../src/components/ExpandBox'

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
.add('ExpandBox', ()=>{
    const moreContent = boolean('more content', false)
    const expand = boolean('expand box', false)

    return(
        <Iono>
            <Ruler >
                
            </Ruler>
            <ExpandBox 
                expand = {expand}
                expandHeight = {500}
                collapseHeight = {200}
                footer = 'foot'
            >
                <MockContent className = {moreContent? 'more' : ''}>
                    Lorem ipsum
                </MockContent>
            </ExpandBox>
        </Iono>
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
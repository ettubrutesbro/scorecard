
import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import {Toggle, Tooltip} from '../src/components/generic/index'


storiesOf('Generic components', module)
.add('visual comparison (all)', ()=>{
    return(
        <Void>
            <Note> Toggles </Note>
        <Toggle
            options = {[
                {label: 'hello', value: 'hello'},    
                {label: 'world', value: 'world'},    
                {label: 'goodbye', value: 'goodbye'},    
                {label: 'blablabla', value: 'blablabla'},    
            ]}
        />
        <Toggle
            size = "big"
            options = {[
                {label: 'hello', value: 'hello'},    
                {label: 'world', value: 'world'},    
                {label: 'goodbye', value: 'goodbye'},    
                {label: 'blablabla', value: 'blablabla'},    
            ]}
        />

        </Void>
    )
})

.add('Tooltip', ()=>{
    return(
        <Void>
            <Note> Tooltip with x: 100, y: 200</Note>
        <Tooltip
            show
            pos = {{x: 100, y: 200}}
        >
            San Bernardino
        </Tooltip>
        </Void>    
    )
})

const Note = styled.h3`
    display: inline-flex;
    background: #FFF8D5;
    padding: 10px 20px;
    margin: 30px 0 10px 0;
    font-weight: 400;
`
const Void = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background: var(--offwhitebg);
    padding: 50px;
`
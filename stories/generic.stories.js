
import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import {Toggle, DropdownToggle, Tooltip, Button} from '../src/components/generic/index'


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
.add('Button', ()=>{
    return(
        <Void>
            <Button label = 'View Sources & Notes'/>
            <Button label = 'Previous page'/>
            <Button label = 'View Sources & Notes'/>
            <Button className = 'dark' label = 'Export PDF'/>
        </Void>
    )
})
.add('DropdownToggle', ()=>{
    const toggleMode = boolean('toggle mode', false)
    return(
        <Cont>
        <DropdownToggle 
            store = {{
                race: null
            }}
            defaultWidth = {140}
            toggleMode = {toggleMode}
            options = {[
                {label: 'All races', value: ''},
                {label: 'Asian', value: 'asian'},
                {label: 'Black', value: 'black'},
                {label: 'Latinx', value: 'latinx'},
                {label: 'White', value: 'white'},
                {label: 'Other', value: 'other'},
            ]}
        />
        </Cont>
    )
})

const Cont = styled.div`
    // width: 400px;
    // border: 1px solid black;
`

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
    background: var(--offwhitefg);
    padding: 50px;
`
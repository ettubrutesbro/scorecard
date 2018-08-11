import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'


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
.add('Tippy?',()=>{
    return(
        <div>


                <AbsTarget> Absolutely positioned</AbsTarget>

        </div>
    )
})

import React from 'react';
import styled from 'styled-components'

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text, boolean} from '@storybook/addon-knobs'

import {Toggle, DropdownToggle, Tooltip, Button} from '../src/components/generic/index'

import {IndicatorSourceInfo} from '../src/components/Sources'

import DemoBox from '../src/components/DemoBox'

storiesOf('Sources components', module)
.add('ind sources', ()=>{
    return(
        <IndicatorSourceInfo
            indicator = {'breastFeeding'}
        />
    )
})
.add('demo sources', ()=>{
    return(
        <IndicatorSourceInfo
            indicator = {'breastFeeding'}
        />
    )
})
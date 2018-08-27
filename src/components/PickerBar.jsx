
import React from 'react'
import styled from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex } from 'lodash'

import Toggle from './Toggle'

import indicators from '../data/indicators'
import { counties } from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'

const Wrapper = styled.div`
    display: flex;
    // flex-direction: column;
    max-width: 480px;
    padding: 20px;
    box-shadow: var(--shadow);
    border-radius: 12px;
    background: var(--offwhitefg);
`

export default class PickerBar extends React.Component{
	render(){
		return(
			<Wrapper>
				Hello
			</Wrapper>
		)
	}
	
}
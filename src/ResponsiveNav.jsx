import React from 'react'
import styled, {css} from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex } from 'lodash'
import {findDOMNode} from 'react-dom'
import FlipMove from 'react-flip-move'

import Toggle from './components/Toggle'

import indicators from './data/indicators'
import { counties } from './assets/counties'
import semanticTitles from './assets/semanticTitles'

import CountyList from './components/CountyList'
import IndicatorList from './components/IndicatorList'

import media from './utilities/media'

const Nav = styled.div`
	display: flex;
	align-items: center;
	@media ${media.optimal}{
		width: 1600px;
	}
	@media ${media.compact}{
		width: 1280px;
	}
`
const Dropdown = styled.div`
	position: relative;
	padding: 10px 45px 10px 20px;
	background: white;
	display: flex;
	align-items: center;
	border: 1px solid var(--bordergrey);
	&::after{
		content: '';
		right: 15px;
		width: 15px;
		height: 15px;
		border: 1px solid black;
		position: absolute;
	}

`  

const DropdownWorkflow = styled(Dropdown)`

`
const IndicatorSelect = styled(DropdownWorkflow)`
	width: 300px;

`
const CountySelect = styled(DropdownWorkflow)`
	width: 200px;
`
const NormalDropdown = styled(Dropdown)`

`

export default class ResponsiveNav extends React.Component{
	render(){
		const {openNav, open, store} = this.props
		return(
			<Nav>
				<IndicatorSelect onClick = {()=>openNav('indicator')}> Indicator </IndicatorSelect>
				<CountySelect onClick = {()=>openNav('county')}> All counties </CountySelect>
				<NormalDropdown> All races </NormalDropdown>

				{open && <PickingWorkflow store = {store} open = {open}/>}
			</Nav>

		)
	}
}

const LargeWorkflow = styled.div`
	position: absolute;
	top: 75px;
	// left: 0;
	padding: 50px;
	background: white;
	border: 1px solid var(--bordergrey);
	@media ${media.optimal}{
		width: 1000px;
	}
	@media ${media.compact}{
		width: 780px;
		height: 640px;
	}
`

export class PickingWorkflow extends React.Component{
	render(){
		const {store} = this.props
		const which = this.props.open
		return(
			<LargeWorkflow> 
				{which === 'indicator' && <IndicatorList store = {store}/>}
				{which === 'county' && <CountyList store = {store}/>}
			</LargeWorkflow>
		)
	}
}
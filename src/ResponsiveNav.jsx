import React from 'react'
import styled, {css} from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex, find } from 'lodash'
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
z-index: 3;
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
	width: 350px;

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
				<IndicatorSelect onClick = {()=>openNav('indicator')} >
					{store.indicator? semanticTitles[store.indicator].shorthand : 'Pick an indicator'}
				</IndicatorSelect>
				<CountySelect onClick = {()=>openNav('county')}>
					{store.county? find(counties, (o)=>{return o.id===store.county}).label : 'All counties' }
				</CountySelect>
				<NormalDropdown> 
					{store.race || 'All races'}
				</NormalDropdown>
				<FlipMove 
					typeName = {null}
					enterAnimation = {{
						from: {opacity: 0, transform: 'translateY(-50px)'},
						to: {opacity: 1, transform: 'translateY(0px)'}
					}}
					leaveAnimation = {{
						from: {opacity: 1, transform: 'translateY(0px)'},
						to: {opacity: 0, transform: 'translateY(-50px)'}
					}}
				>
				{open && <PickingWorkflow store = {store} open = {open} close = {()=>openNav(false)} />}
				</FlipMove>
			</Nav>

		)
	}
}

const LargeWorkflow = styled.div`
	position: absolute;
	overflow: hidden;
	top: 75px;
	background: white;
	border: 1px solid var(--bordergrey);
	padding: 30px;
	z-index: 3;
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
		const {store, close} = this.props
		console.log(close)
		const which = this.props.open
		return(
			<LargeWorkflow> 
				<FlipMove
					typeName = {null}
					enterAnimation = {{
						from: {opacity: 0, transform: `translateX(${which==='indicator'?-150:150}px)`},
						to: {opacity: 1, transform: `translateX(0px)`},
					}}
					leaveAnimation = {{
						from: {opacity: 1, transform: `translateX(0px)`},
						to: {opacity: -1, transform: `translateX(${which==='indicator'?150:-150}px)`},
					}}
				>
					{which === 'indicator' && <IndicatorList store = {store} closeNav = {this.props.close}/>}
					{which === 'county' && <CountyList store = {store} closeNav = {this.props.close}/>}
				</FlipMove>
			</LargeWorkflow>
		)
	}
}
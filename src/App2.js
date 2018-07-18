
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import Styled from 'styled-components'
import {map} from 'lodash'

import {counties} from './assets/counties'
import indicators from './data/indicators'

class Store{
	@observable location = null
	@observable indicator = null
	@observable race = null

	@action change = (target, value) => {
		console.log('changing', target, 'to', value)
		this[target] = value
	}
}

const store = new Store()
window.store = store

const Dropdown = Styled.select`
	width: 400px;
`
const Clear = Styled.span`
	padding: 5px;
	border: 1px solid black;
`

@observer
export default class App2 extends React.Component{

	render(){
		return(
			<div>
				<Selectors />
				{store.location && 'L'}
				{store.indicator && 'I'}
				{store.race && 'R'}

			</div>
		)
	}
}

const Selectors = (props) => {
	return (
		<React.Fragment>
			<SelectorGroup 
				prompt = "Pick a location"
				value = {store.location}
				property = 'location'
				onChange = {store.change}
				options = {counties.map((county)=>{
					return {label: county.label, value: county.id}
				})}
			/>
			<SelectorGroup
				prompt = 'Select an indicator'
				value = {store.indicator}
				property = 'indicator'
				onChange = {store.change}
				options = {Object.keys(indicators).map((indicator)=>{
					return {label: indicators[indicator].indicator, value: indicators[indicator].indicator}
				})}
			/>
			<SelectorGroup
				prompt = 'Select a race'
				value = {store.race}
				property = 'race'
				onChange = {store.change}
				options = {[
					{label: 'black', value: 'black'},
					{label: 'latinx', value: 'latinx'},
					{label: 'asian', value: 'asian'},
					{label: 'white', value: 'white'},
					{label: 'other', value: 'other'},
				]}
			/>
		</React.Fragment>
	)
}



const SelectorGroup = (props) => {
	return(
		<div>
			<Dropdown
				value = {props.value? props.value : ''}
				onChange = {(e)=>{props.onChange(props.property, e.target.value)}}
			> 
				<option value = ''> {props.prompt} </option>
				{props.options.map((option, i)=>{
					return <option value = {option.value}> {option.label} </option>
				})}
			</Dropdown>
			{props.property && 
				<Clear
					onClick = {()=>{props.onChange(props.property, null)}}
				>
					Clear {props.property}
				</Clear>
			}
		</div>
	)
}
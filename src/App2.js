
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {map} from 'lodash'

import firstLetterLowercase from './utilities/toLowerCase'

import {counties} from './assets/counties'
import indicators from './data/indicators'

class Store{
	@observable location = null
	@observable indicator = null
	@observable race = null
	@observable year = null //important: when indicator changes this needs to be set automatically

	@action change = (target, value) => {
		console.log('changing', target, 'to', value)
		this[target] = value	
		console.log(this[target])
		if(target === 'indicator'){
			if(!value) this.year = null
			else{
				const years = indicators[firstLetterLowercase(this.indicator)].years
				if(years.length===1) this.year = years[0]
				else if(years.length===2) this.year = years[1]
				console.log('automatically set year to', this.year)
			}
		}
	}
}

const store = new Store()
window.store = store

const Dropdown = styled.select`
	width: 400px;
`
const Clear = styled.span`
	padding: 5px;
	border: 1px solid black;
`

@observer
export default class App2 extends React.Component{

	render(){
		const ind = store.indicator? indicators[firstLetterLowercase(store.indicator)] : null
		console.log(ind)
		return(
			<div>
				<Selectors />
				{store.location && 'L'}
				{store.indicator && `I(${store.year})`}
				{store.race && 'R'}
				<div>
					data for heatmap:
					{store.indicator && Object.keys(ind.counties).map((county)=>{
						const yearIndex = ind.years.indexOf(store.year)
						const raceFilter = ind.categories.includes('hasRace') && store.race? store.race : 'totals' 
						return <div>{county + ind.counties[county][raceFilter][yearIndex]}</div>
					})}
				</div>
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
			{store.indicator &&
				<Toggle
					options = {indicators[firstLetterLowercase(store.indicator)].years}
					selected = {store.year}
				/>
			}
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

@observer
class Toggle extends React.Component {
	//for year
	render(){
		const props = this.props
	return(
		<div>
			{Array.isArray(props.options) && props.options.map((option)=>{
				return <span 
					style = {{border: option===props.selected? '1px black solid' : ''}}
					onClick = {()=>store.change('year',option)}
				> 
					{option} 
				</span>
			})}
			{typeof props.options === 'string' && props.options}
		</div>
	)
	}
}

import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {map, zipObject} from 'lodash'

// import {camelLower} from './utilities/toLowerCase'

import {counties} from './assets/counties'
import indicators from './data/indicators'


import CaliforniaCountyMap from './components/InteractiveMap'
import Readout from './Readout'

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
				const years = indicators[this.indicator].years
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
const App = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
`
const LeftSide = styled.div`
	width: 50%;
`

const MockHeatMap = styled.div `
	width: 50%;

`

@observer
export default class App2 extends React.Component{

	render(){
		const ind = store.indicator? indicators[store.indicator] : null
		const yearIndex = ind? ind.years.indexOf(store.year) : ''
		console.log(ind)
		const cts = ind? Object.keys(ind.counties) : ''
		const heatmapdata = ind? zipObject(cts, map(cts, (c)=>{ 
			// console.log(c)
			return ind.counties[c][store.race||'totals'][yearIndex] 
		})) : ''

		console.log(heatmapdata)
		return(
			<App>
				<Selectors />

				<LeftSide>
					<Readout
						county = {store.location}
						race = {store.race}
						year = {store.year}
						indicator = {ind}
					/>
				</LeftSide>

				{/*
				<MockHeatMap>
					<h3> data for heatmap: </h3>
					{store.indicator && Object.keys(ind.counties).map((county)=>{
						const yearIndex = ind.years.indexOf(store.year)
						const raceFilter = ind.categories.includes('hasRace') && store.race? store.race : 'totals' 
						const camelCounty = camelLower(county)

						return county!=='California'? 
							<div>
							{
								(camelCounty === store.location? 'SELECTED: ' : '') + camelCounty + ' : ' + ind.counties[county][raceFilter][yearIndex]
							}
							</div> : ''
					})}
				</MockHeatMap>
			*/}
			<CaliforniaCountyMap
				mode = 'heat'
				data = {heatmapdata}
			/>

				
			</App>
		)
	}
}

const DebugSelectors = styled.div`
	width: 100%;
`

const Selectors = (props) => {
	return (
		<DebugSelectors>
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
					options = {indicators[store.indicator].years}
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
		</DebugSelectors>
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
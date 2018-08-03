import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import Picker from './components/Picker'
import Readout from './Readout'
import CAMap from './components/InteractiveMap'

import {camelLower} from './utilities/toLowerCase'

class Store{
	@observable location = null
	@observable indicator = null
	@observable race = null
	@observable year = null //important: when indicator changes this needs to be set automatically

	@observable mapmode = '' // '', 'heat', 'county', 'countyheat'
	// @observable userPicking = 'start'

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

	@action changedPickerMode = (newPickerMode) => {

	}

}

const store = new Store()
window.store = store

//function for computing heatmap data?

const App = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;

`
const Leftside = styled.div`
	border: 1px solid red;
	width: 50%;
`
const Rightside = styled.div`
	border: 1px solid green;
	width: 50%;
`
@observer
export default class Scorecard extends React.Component{

	@observable hoveredCounty = null
		@action onHoverCounty = (id) => {
			if(id) this.hoveredCounty = camelLower(id)
			else this.hoveredCounty = null
		}

	render(){

		return(
			<App>
				<DebugStore />
				<Leftside>
				<Picker 
					store = {store}
					onHoverCounty = {this.onHoverCounty}
					hoveredCounty = {this.hoveredCounty} 

				/>
				<Readout store = {store} />
				</Leftside>
				<Rightside>
				<CAMap 
					store = {store}
					onHoverCounty = {this.onHoverCounty}
					hoveredCounty = {this.hoveredCounty}
				/>
				</Rightside>
			</App>
		)
	}
}
const Debug = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	color: white;
	background: black;
	padding: 10px;
	border: 1px solid red;
`
const DebugStore = () => {
	return(
		<Debug>
			L: {store.location}
			I: {store.indicator}
			R: {store.race}
			Y: {store.year}
			mapmode: {store.mapmode}
		</Debug>
	)
}
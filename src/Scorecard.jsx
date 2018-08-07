import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import Picker from './components/core/Picker'
import Readout from './components/core/Readout2'
import CAMap from './components/core/InteractiveMap'

import indicators from './data/indicators'
import {camelLower} from './utilities/toLowerCase'

class Store{
	@observable location = null
	@observable indicator = null
	@observable race = null
	@observable year = null //important: when indicator changes this needs to be set automatically

	@observable queryOrder = []

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
		if(!value && this.queryOrder.includes(target)) this.queryOrder.splice(this.queryOrder.indexOf(target),1)
		else this.queryOrder.push(target)
		console.log('query order:', this.queryOrder.toJS())
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
	display: flex;
	flex-direction: column;
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
					onSelect = {store.change}
				/>
				<Readout
					location = {store.location}
					race = {store.race}
					indicator = {store.indicator}
				/>
				</Leftside>
				<Rightside>
				<CAMap 
					store = {store}
					onHoverCounty = {this.onHoverCounty}
					hoveredCounty = {this.hoveredCounty}
					onSelect = {store.change}
					selected = {store.location}
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
@observer
class DebugStore extends React.Component{
	render(){
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
}
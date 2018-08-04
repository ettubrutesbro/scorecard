
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {counties} from '../../assets/counties'

const Wrapper = styled.div`

`

@observer
export default class Picker extends React.Component{
	//better name? this is the component that lets users pick anything
	
	@observable mode = 'start' //start, county, race, topic, indicator, mini
		//this might need to be a prop..?
		@action changeMode = (newmode) => {
			this.mode = newmode
			this.props.store.changedPickerMode(newmode)
		}

	render(){
		const {location, indicator, race} = this.props.store
		return(
			<Wrapper>
				{this.mode === 'start' && !location && !indicator && !race && 
					<StartDataSearch 
						changeMode = {this.changeMode}
					/>
				}
				{this.mode !== 'start' && 
					<BackButton 
						onClick = {()=>{this.changeMode('start')}}
					> 
						Back 
					</BackButton>
				}
				{this.mode === 'county' && 
					<CountySearch 
						highlight = {this.props.hoveredCounty}
						onHover = {this.props.onHoverCounty}
						// onSelect = {}
					/>
				}
			</Wrapper>
		)
	}
}

const BackButton = styled.div`
	padding: 10px;
	border: 1px solid black;
	display: inline-flex;
`

const StartDataSearch = (props) => {
		return(
			<div>
				<h1> How do you want to begin your data search? </h1>

				<div onClick = {()=>{props.changeMode('county')}}> By County </div>
				<div> By Topic & Indicator </div>
				<div> By Race </div>

			</div>
		)
}
const CountyList = styled.ul`
	list-style-type: none;
`
const County = styled.li`
	background: ${props => props.highlight? 'pink' : 'white'};
`
const CountySearch = (props) => {
	return(
		<div>
		Pick a County
		<CountyList>
		{counties.map((county)=>{
			return (
				<County 
					highlight = {props.highlight === county.id}
					onMouseEnter = {()=>props.onHover(county.id)}
					onMouseLeave = {()=>props.onHover()}
				> 
					{county.label} 
				</County>
			)
		
		})}
		</CountyList>
	

		</div>
	)
}
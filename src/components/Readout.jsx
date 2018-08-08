import React from 'react'
import styled from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import {find} from 'lodash'
import {findDOMNode} from 'react-dom'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'
import demopop from '../data/countyDemographicPopulation.json'

const ReadoutBlock = styled.div`
	transform-origin: 50% 0%;
	padding: 30px;
	font-size: 24px;
	position: relative;
	flex-grow: 1;
	b{
		font-weight: 600;
	}
	h1{
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		font-size: 48px;
		font-weight: 600;
	}
`
const IndentedTitle = styled.div`
	max-width: 400px;
	line-height: 36px;
	padding-top: 18px;
`
const Crumb = styled.span`
	// display: inline-flex;
	position: relative;
	box-sizing: border-box;
	padding-bottom: 5px;
	border-bottom: ${props => props.active? '1px solid black' : '1px solid transparent'};
	margin: ${props => props.active? '0 .5rem' : '0 0 0 0.4rem'};
	
`
@observer
export default class Readout extends React.Component{
	@observable bigNumberWidth = 0
	@action setBigNumberWidth = () => {
		const width = findDOMNode(this.bigNumber).offsetWidth
		this.bigNumberWidth = width
	}
	componentDidMount = () => {
		if(this.props.store.indicator) this.setBigNumberWidth()	
	}
	componentDidUpdate = (newProps) => {
		if(this.props.store.indicator) this.setBigNumberWidth()
	}


	render(){
		let {county, indicator, race} = this.props.store

		county = county? find(counties,{id:county}).label : ''
		race = race? race.charAt(0).toUpperCase() + race.substr(1) : ''

		const raceString = race? `who are ${race}` : ''
		const countyString = county? `${county} county.` : 'California.'
		const indicatorString = indicator? `${indicator}` : ''
		const who = indicator? semanticTitles[indicator].who : 'children'
		const what = indicator? semanticTitles[indicator].what : ''



		return(
			<ReadoutBlock>
				{!indicator && (county || race) && 
					<React.Fragment>
					<b>1,000,000</b> {who} 
					<Crumb active = {race}>
						{raceString}
					</Crumb> 
					live in 
					<Crumb active = {county}>
						{countyString}
					</Crumb>
					</React.Fragment>
				}
				{indicator && 
					<div style = {{position: 'relative'}}>
						<h1 ref = {(h1)=>{this.bigNumber = h1}}> 36% </h1>
						<IndentedTitle
							style = {{
								textIndent: this.bigNumberWidth+10 + 'px'
							}}
						> 
							of {who} 					
							<Crumb active = {race}>
								{raceString}
							</Crumb>
							{what} in 
							<Crumb active = {county}>
								{countyString}
							</Crumb>
						</IndentedTitle>

					</div >
				}
			</ReadoutBlock>
		)
	}
}

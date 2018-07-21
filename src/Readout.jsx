import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {find} from 'lodash'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import semanticTitles from './assets/semanticTitles'

const SuperTitle = styled.h4`
	display: flex;
	align-items: center;
`

export default class Readout extends React.Component{
	render(){

		const {county, race, indicator, year} = this.props
		const ca = indicator? indicator.counties.california : ''
		
			//TODO TODO: formatter needs to output camelcased locations
		const c = county && indicator? indicator.counties[county] : indicator? indicator.counties.california : ''
			//TODO TODO: formatter needs to output camelcased locations

		const yearIndex = indicator? indicator.years.indexOf(year) : ''
		const semanticTitleString = indicator? `of ${semanticTitles[indicator.indicator].who} ${race? 'who are '+race+' ' : ''}${semanticTitles[indicator.indicator].what}` : ''
		let locationString = indicator && county? `In ${find(counties, (c)=>{return c.id === county}).label} County` : indicator || race? 'In California' : ''
		const yearObject = indicator && indicator.years.length > 1? <YearToggle years = {indicator.years} /> : indicator? indicator.years : ''
		return(
			<div>
				{indicator && 
				<div>
					<SuperTitle>
						{locationString},
						<YearToggle 
							years = {indicator.years}
							selected = {year}
						/>  
					</SuperTitle>
					<h3>
					{c[race||'totals'][yearIndex]}% {semanticTitleString}
					</h3>

					{indicator.categories.includes('hasRace') &&
						<RaceTable>
							{['black','white','asian','latinx'].map((race)=>{
								return <div> {race} : {c[race][yearIndex]} </div>
							})}
						</RaceTable>
					}
				</div>
				}
			</div>
		)
	}
}
const RaceTable = styled.div`
	display: flex;
`

const Toggle = styled.div `
	margin-left: 10px;
	display: flex;
	border: ${props => props.oneYear? 'none' : '1px black solid'};
	border-radius: 4px;

`
const Yr = styled.div`
	font-weight: normal;
	font-size: 11px;
	color: ${props => props.selected? 'red' : 'black'};
	padding: ${props => props.oneYear? '0' : '4px'};
	&:not(:first-of-type){
		border-left: 1px solid black;
	}
`
const YearToggle = (props) => {
	return(
		<Toggle oneYear = {props.years.length===1}>
			{props.years.map((yr)=>{
				return <Yr selected = {yr === props.selected} oneYear = {props.years.length===1}> {yr} </Yr>
			})}
		</Toggle>


	)
}
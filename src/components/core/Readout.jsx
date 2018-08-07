import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {find} from 'lodash'

import indicators from '../../data/indicators'
import {counties} from '../../assets/counties'
import semanticTitles from '../../assets/semanticTitles'
import demopop from '../../data/countyDemographicPopulation.json'

import {lowerCamel} from '../../utilities/toLowerCase'

import commaNumber from 'comma-number'

const Wrapper = styled.div`
	background: rgba(0,255,255,0.1);
	padding: 30px;
`
const BigNumber = styled.h1`
	width: auto;	
`

const TitleBlock = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	h1{
		display: flex;
		justify-content: flex-start;
		font-weight: 400;
		font-size: 24px;
		margin: 0;
		width: 100%;
		align-items: center;
		h1{ 
			font-size: 36px;
			font-weight: 600;
			width: auto;
			margin-right: 7px;
		}
	}
	h2{
		display: flex;
		width: 100%;
		font-size: 16px;
		font-weight: 400;
		margin: 0;
		h4{
			margin: 0;
			margin-left: 5px;
			display: inline;
			font-size: 16px;
			font-weight: 600;
		}
	}
	h3{
		width: 100%;
	}
	font-size: 14px;
`
const PointerBox = styled.div`
	position: relative;
	margin-top: 20px;
	padding: 20px;
	border: 1px solid grey;
	background: white;
	&::after, &::before{
		content: '';
		position: absolute;
		left: calc(125px); //needs change
		width: 0; 
		height: 0;
		top: -30px;
		border: 15px solid;
		border-color: transparent transparent grey transparent;
	}
	&::after{
		top: -26.5px;
		left: calc(125px + 1.5px);
		border: 13.5px solid;
		border-color: transparent transparent white transparent;
	}
	display: flex;
`
@observer
export default class Readout extends React.Component{
	render(){

		const {location, race, year} = this.props.store

		const indicator = indicators[this.props.store.indicator]

		const ca = indicator? indicator.counties.california : ''


		const yearObject = indicator && indicator.years.length > 1? <YearToggle years = {indicator.years} /> : indicator? indicator.years : ''
		return(
			<Wrapper>
					{location && !indicator && !race &&	
						<LocationReadout 
							location = {location} 
							onBack = {()=>{this.props.store.change('location','')}}
						/>
					}
					{indicator && 
						<IndicatorReadout
							indicator = {indicator}
							computedLocation = {location && indicator? indicator.counties[location] : indicator? indicator.counties.california : ''}
							race = {race}

							raceData = {demopop[location]}
							location = {location}
							yearIndex = {indicator? indicator.years.indexOf(year) : ''}

						/>	
					}

			</Wrapper>
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


const LocationReadout = (props) => {
	const label = find(counties, (c)=>{return c.id === props.location}).label
	const demo = demopop[props.location] || {population: 100, poverty: 100, homeless: 100, immigrantFamilies: 100, }
	return(
		<TitleBlock>
			<h3
				onClick = {props.onBack}
			> Restart search </h3>
			<h1> {label} county </h1>
			<h2> Child population: <h4>{commaNumber(demo.population)}</h4> </h2>
			<PointerBox>
				<DemoDataTable demo = {demo} />
				<RaceRowTable demo = {demo}/>
			</PointerBox>


		</TitleBlock>
	)
}
const IndicatorReadout = (props) => {
	//prop: hasRace, county, percentage, indicator
	//calculate locationString and semanticTitleString here
	const {indicator, year, race, yearIndex, computedLocation} = props
	let locationString = props.indicator && props.location? `In ${find(counties, (c)=>{return c.id === props.location}).label} county` : indicator || race? 'In California' : ''
	const semanticTitleString = indicator? `of ${semanticTitles[indicator.indicator].who} ${race? 'who are '+race+' ' : ''}${semanticTitles[indicator.indicator].what}` : ''
	console.log(props.raceData)
	return(
		<TitleBlock>
			<h3> Restart search </h3>
			<h2> 
				{locationString} 
				<YearToggle 
					years = {indicator.years}
					selected = {year}
				/>
			</h2>
			
			<h1>
				<BigNumber>
					{computedLocation[race||'totals'][yearIndex]}%
				</BigNumber> 
				{semanticTitleString}
			</h1>

			{indicator.categories.includes('hasRace') &&
				<RaceRowTable 
					raceData = {props.raceData}
				/>
			}
		</TitleBlock>
	)
}

const RowTable = styled.div`
	&.race{
		margin-left: 30px;
	}	
`
const DemoRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const DemoLabel = styled.div`
`
const DemoValue = styled.div`
	margin-left: 15px;
` 
const DemoDataTable = (props) => {
	return(
		<RowTable>
			<DemoRow> 
				<DemoLabel>in Immigrant Families: </DemoLabel>
				<DemoValue> {commaNumber(props.demo.immigrantFamilies)} </DemoValue>
			</DemoRow>
			<DemoRow> 
				<DemoLabel>in Poverty: </DemoLabel>
				<DemoValue> {props.demo.poverty}% </DemoValue>
			</DemoRow>
			<DemoRow> 
				<DemoLabel>who are Homeless:</DemoLabel>
				<DemoValue> {commaNumber(props.demo.homeless)} </DemoValue>
			</DemoRow>
		</RowTable>
	)
}
const races = ['black','white','asian','latino','other']
const GraphTable = styled.div`
	display: inline-flex;
	align-items: flex-end;
	justify-content: flex-start;
	// height: 100%;
	border: 1px solid black;
	margin-left: 25px;


`
const Bar = styled.div`
	height: 100%;
	transform: scaleY(${props => props.pct/75});
	&:not(:first-of-type){
		margin-left: 2px;
	}
	transform-origin: 50% 100%;
	background: black;
	width: 50px;
`	
const RaceGraphTable = (props) => {
	return(
		<GraphTable>
			{races.map((race)=>{
				return <Bar pct = {props.demo[race]} />
			})}
		</GraphTable>
	)
}

const RaceRow = styled.div`
	display: flex;
	// justify-content: space-between;
`	
const RaceLabel = styled.div`
`
const RacePct = styled.div`
	width: 5rem;
	margin-left: 15px;
	text-align: right;
`
const RaceRowTable = (props) => {
	return(
		<RowTable className = 'race'>
			{races.map((race)=>{
				return (
					<RaceRow>
						<RaceLabel>{race}</RaceLabel>
						<RacePct>{props.demo[race]}%</RacePct>
					</RaceRow>
				) 
			})}
		</RowTable>
	)
}

// function backString = () => {
// 	queryOrder
// 	return (

// 	)
// }
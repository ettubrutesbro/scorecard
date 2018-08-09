import React from 'react'
import styled from 'styled-components'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import {findIndex} from 'lodash'

import Toggle from './Toggle'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'

const Wrapper = styled.div`	
	display: flex;
	flex-direction: column;
`
const Row = styled.div`
	input{
		flex-grow: 1;
		height: 100%;
		padding: 10px;
	}
	margin-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const Results = styled.div`
	margin: 10px;
	padding: 20px;
	flex-grow: 1;
	border: 1px solid black;
`
const Btn = styled.div`
	background: black;
	color: white;
	padding: 10px;
`
const Button = (props) => {
	return <Btn onClick = {props.onClick}> {props.label} </Btn>
}

const raceOptions = [
	{label: 'All', value: null},
	{label: 'Asian', value: 'asian'},
	{label: 'Black', value: 'black'},
	{label: 'Latinx', value: 'latinx'},
	{label: 'White', value: 'white'}
]

@observer
export default class UniversalPicker extends React.Component{
	@observable searchCounties = null
	@observable searchIndicators = null
	@action setSearchString = (which, value) => {
		this['search'+which] = value
	}
	render(){
		const {store} = this.props
		const {county, indicator, year, race} = store
		const flatIndicatorList = Object.keys(indicators)
		const flatCountyList = counties.map((county)=>{
			return county.label.toLowerCase()
		})

		return(
			<Wrapper>
				<Row>
					<input 
						placeholder = "search indicators" 
						value = {this.searchIndicators}
						onChange = {(e)=>{this.setSearchString('Indicators',e.target.value)}}
					/> 
					<Button label = "See all indicators" 
						onClick = {()=>{store.setWorkflow('indicator')}}
					/> 
				</Row> 
				{this.searchIndicators &&
					<Results>
						{flatIndicatorList
							.filter((ind)=>{return ind.toLowerCase().includes(this.searchIndicators.toLowerCase())})
							.map((item)=>{return <div>{semanticTitles[item].label}</div>})
							.slice(0,10)
						}
					</Results>
				}
				<Row>
					<input 
						placeholder = {this.props.countySearchPlaceholder || 'Search counties...'}
						value = {this.searchCounties}
						onChange = {(e)=>{this.setSearchString('Counties',e.target.value)}}
					/>
					<Button label = "See county list" 
						onClick = {()=>{store.setWorkflow('county')}}
					/>
				</Row>
				{this.searchCounties &&
					<Results>
						{flatCountyList
							.filter((county)=>{return county.includes(this.searchCounties.toLowerCase())})
							.map((item)=>{return <div>{item}</div>})
							.slice(0,10)
						}
					</Results>
				}
				<Row>
					Race: 
					{(!indicator || indicators[indicator].categories.includes('hasRace')) && 
						<Toggle 
							options = {raceOptions}
							onClick = {(value)=>store.completeWorkflow('race',value)}
							selected = {!race? 0 : findIndex(raceOptions, (o)=>{return o.value===race})}
						/>
					}
					{indicator && !indicators[indicator].categories.includes('hasRace') &&
						'This indicator doesn\'t have race data'

					}
					
				</Row>

			</Wrapper>	
		)
	}
}

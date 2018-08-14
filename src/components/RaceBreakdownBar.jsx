
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'

import demopop from '../data/demographicsAndPopulation'
import FlipMove from 'react-flip-move'

const VertBar = styled.div`
	position: relative;
	height: 500px; //arbitrary
	// outline: 1px solid #999999;
	// box-sizing: border-box;
	width: 40px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`
const Segment = styled.div`
	position: absolute;
	width: 100%;
	background-color: ${props=>props.selected?'rgba(239,103,50,0.25)':'white'};
	height: 100%;
	transition: transform 1s, background-color .25s;
	// transform: scaleY(0) transformY(500px);
	margin-top: ${props=>props.offset}px;
	transform-origin: 50% 0%;
	// background-color: ${props=>props.fill};
	outline: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
	&.asian{
		background-color: red;
	}
	&.black{
		background-color: blue;
	}
	&.latinx{ background-color: green;}
	&.white{background-color: orange;}
	&.other{background-color: grey;}
`
const Hatch = styled.div`
	position: absolute;
	width: 100%;
	top: 0;
	transform: translateY(${props=>props.offset}px);
	border-top: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
`
const races = [
	'asian',
	'black',
	'latinx',
	'white',
	'other'
]
@observer
export default class RaceBreakdownBar extends React.Component{
	@observable height = 500 //TODO: need to findDOMNode this shit

	render(){
		let {county} = this.props.store
		if(!county) county = 'california'
		county = demopop[county]

		const values = races.map((race)=>{
			return {label:race, percentage: county[race]}
		}).sort((a,b)=>{
			return b.label === 'other'? -2 : a.percentage > b.percentage? -1 : a.percentage < b.percentage? 1 : 0
		})
		return(
			<VertBar>
				<FlipMove
					typeName = {null}
					duration = {500}
					staggerDelayBy = {50}
					staggerDurationBy = {75}
					enterAnimation = {{
						from: {transform: 'translateY(500px)'},
						to: {transform: 'translateY(0)'}
					}}
					leaveAnimation = {null}
				>
				{values.map((o,i,arr)=>{
					const previousSegs = arr.slice(0,i)
					const offset = previousSegs.map((seg)=>{return seg.percentage}).reduce((a,b)=>a+b,0)
					return <Segment
						key = {this.props.store.county+'-'+o.label+'bar'}
						style = {{display: o.percentage===0?'hidden':'block'}}
						className = {o.label}
						height = {o.percentage / 100}
						offset = {(offset/100)*this.height}
						// style = {{transform: `translateY(${(offset/100)*this.height}px) scaleY(${o.percentage/100})`}}
					/>
				})}
				</FlipMove>
			</VertBar>
		)
	}
}

RaceBreakdownBar.defaultProps = {

}
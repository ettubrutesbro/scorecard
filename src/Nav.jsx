import React from 'react'
import styled from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

// const PickerBar = styled.div`
// 	width: 70%;
// 	background: white;
// 	height: 40px;
// 	border: 1px solid #d7d7d7;
// `

import { findIndex } from 'lodash'
import {findDOMNode} from 'react-dom'
import FlipMove from 'react-flip-move'

import Toggle from './components/Toggle'

import indicators from './data/indicators'
import { counties } from './assets/counties'
import semanticTitles from './assets/semanticTitles'

const Share = styled.div`
	width: 30%;
	border: 1px solid black;
` 
const Nav = styled.div`
	position: fixed;
	top: 0;
	z-index: 9;
	width: 100%;
	max-width: 1600px;
	background: var(--offwhitebg);
	display: flex;
	justify-content: space-between;
	padding: 20px;
`

@observer
export default class Navbar extends React.Component{

	@observable expanded = null
		@action setExpanded = (which) => {
		this.expanded = which
		if(this.props.open){
			if(this.expanded) this.props.open(true)
			else this.props.open(false)
		}
	}

	render(){
		return(
				<Nav>		
					<PickerBar 
						store = {this.props.store}  
						open = {this.props.open} 
						expanded = {this.expanded}
						setExpanded = {this.setExpanded}
					/>
					{this.expanded && 
						<Exit onExit = {()=>this.setExpanded(null)}/>
					}
					{!this.expanded && 
					<Share>
						Share
					</Share>
					}
				</Nav>
		)
	}
}



const Wrapper = styled.div`
    display: flex;
    // flex-direction: column;
    // max-width: 480px;
    // padding: 20px;
    // box-shadow: var(--shadow);
    // border-radius: 4px;
    // background: var(--offwhitefg);
`
@observer class PickerBar extends React.Component{

	@observable showArea = false

	@action toggleArea = () => this.showArea = true
	@action hideArea = () => this.showArea = false

	componentDidMount(){

	}

	render(){
		const offset = this.props.expanded && this.props.expanded !== 'race'
		return(
			<React.Fragment>
				<Wrapper 
						ref = {(wrap)=>this.wrapper=wrap}
						className = 'pickerbar'>
					<IndicatorSelect 
						indicator = {this.props.store.indicator}
						expanded = {this.props.expanded==='indicator'} 
						onClick = {()=>this.props.setExpanded('indicator')}
						toggleArea = {this.toggleArea}
						hideArea = {this.hideArea}
					/>
					<CountySelect 
						offset = {offset}
						expanded = {this.props.expanded==='county'} 
						onClick = {()=>this.props.setExpanded('county')}
						toggleArea = {this.toggleArea}
						hideArea = {this.hideArea}
					/>
					<RaceSelect 
						offset = {offset}
						expanded = {this.props.expanded==='race'} 
						onClick = {()=>this.props.setExpanded('race')}
					/>

					<YearToggle 
						offset = {offset}
					/>
				
				</Wrapper>
				<FlipMove
					// delay = {100}
					typeName = {null}
					enterAnimation = {{
						from: {transform: 'scaleY(0)', opacity: 0}, 
						to: {transform: 'scaleY(1)', opacity: 1}
					}}
					leaveAnimation = {{
						from: {transform: 'scaleY(1)', opacity: 1}, 
						to: {transform: 'scaleY(0)', opacity: 0}
					}}
				>
				{this.showArea && (this.props.expanded === 'county' || this.props.expanded === 'indicator') &&
					<LargeSelectionArea 
						ref = {(thing)=>{this.thing = thing}}
						key = {this.props.expanded}
					/>
				}
				</FlipMove>

			</React.Fragment>
		)
	}
	
}

const LargeSelectionArea = styled.div`
	position: absolute;
	width: 100%;
	max-width: 1240px;
	background: white;
	height: 300px;
	border: 1px solid #d7d7d7;
	// margin-top: 8px;
	top: 68px;
	transform-origin: 50% 0%;
`

const IndicatorBtn = styled.div`
	position: relative;
	width: 275px;
	border-radius: 4px 0 0 4px;
	padding: 10px 20px;
	display: flex; align-items: center;
	border: 1px solid #d7d7d7;	
	background: white;
	cursor: pointer;

z-index: 2;
`

const Extension = styled.div`
	position: absolute;
	z-index: 2;
	left: -1px;
	bottom: -10px;
	width: calc(100% + 2px);
	background: white;
	// background: red;
	border: 1px solid #d7d7d7;
	border-top: none;
	border-bottom: none;
	height: 15px;
	transition: transform .25s;
	transform-origin: 50% 0%;
	transform: ${props => props.expanded? 'scaleY(1)' : 'scaleY(0)'};
`

const CountyBtn = styled.div`
	transition: transform .25s;
	background: white;
	border: 1px solid #d7d7d7;
	padding: 10px 20px;
	display: flex; align-items: center;
	width: 215px;
	cursor: pointer;
	transform: ${props=>props.offset?'translateX(10px)' : ''};
	z-index: 2;
`
const RaceDropdown = styled.div`
	position: relative;
	margin-right: 20px;
	transition: transform .25s;
	background: white;
	padding: 10px 20px;
	display: flex; align-items: center;
	border: 1px solid #d7d7d7;
	border-radius: 0 4px 4px 0;
	cursor: pointer;
	transform: ${props=>props.offset?'translateX(20px)' : ''};
	
`

const IndicatorSelect = (props) => {
	return(
		<IndicatorBtn onClick = {props.onClick} expanded = {props.expanded}> 
			{props.indicator}
			<Extension 
				expanded = {props.expanded} 
				onTransitionEnd = {props.expanded? props.toggleArea : ''}
				onTransitionBegin = {!props.expanded? props.toggleArea : ''}
			/>
		</IndicatorBtn>
	)
}

const CountySelect = (props) => {
	return(
		<CountyBtn offset = {props.offset} onClick = {props.onClick}>
			All counties (CA)
			<Extension 
				expanded = {props.expanded} 
				onTransitionEnd = {props.expanded? props.toggleArea : ''}
				onTransitionBegin = {!props.expanded? props.hideArea : ''}
			/>
		</CountyBtn>
	)
}

const RaceSelect = (props) => {
	
	return(
		<RaceDropdown 
			offset = {props.offset} 
			onClick = {!props.offset? props.onClick : ()=>{}}
		>
			<AllRaces>
			All races
			</AllRaces>
			{!props.offset && props.expanded && 
			<Drop>
				<Race> All races </Race>
				<Race> Asian </Race>
				<Race> Black </Race>
				<Race> Latinx </Race>
				<Race> White </Race>
			</Drop>
			}
			<React.Fragment>
				<ToggleRace offset = {props.offset} index = {1}> Asian </ToggleRace>
				<ToggleRace offset = {props.offset} index = {2}> Black </ToggleRace>
				<ToggleRace offset = {props.offset} index = {3}> Latinx </ToggleRace>
				<ToggleRace offset = {props.offset} index = {4}> White </ToggleRace>
			</React.Fragment>
			

		</RaceDropdown>
	)
}

const AllRaces = styled.div`
	z-index: 5;
	background: white;
	top: 0; left: 0; white-space: nowrap;
`

const Drop = styled.ul`
	position: absolute;
	width: calc(100% + 2px);
	// top: 50px;
	top: 0;
	margin: 0;
	padding: 0;
	left: -1px;
	border: 1px solid #d7d7d7;
	background: white;
	margin-top: 10px;
`

const Race = styled.li`
	list-style-type: none;
	// margin: 10px 0 0 0;
	padding: 10px 20px;
	display: flex; align-items: center;
`
const ToggleRace = styled.div`
	&:first-of-type{
		border: 1px solid red;
	}
	position: absolute;
	left: 20px;
	height: 41px;
	padding: 10px 20px;
	display: flex; align-items: center;
	border: 1px solid #d7d7d7;
	border-left: none;
	background: white;
	width: 80px;
	z-index: ${props=>4-props.index};
	transform: translateX(${props=>props.offset? props.index*80 : 0}px);
	transition: transform ${props=> props.index*.1 + .15}s;
`

const X = styled.div `
	font-size: 24px;
	color: var(--fainttext);
` 

const Exit = (props) => {
	return(
		<X onClick = {props.onExit}>
			X
		</X>
	)
}

const YearToggle = (props) =>{
	return <YrToggle offset = {props.offset}> 
		<Toggle
			size = "big"
			options = {[
				{label: '2015', value: 2015},
				{label: '2016', value: 2016},
			]}
		/> 
	</YrToggle>
		
	
}

const YrToggle = styled.div`
	// border: 1px solid red;
	// position: absolute;
	transition: transform .5s;
	transform: translateX(${props=>props.offset?350 : 0}px);
`

import React from 'react'
import styled from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex } from 'lodash'
import {findDOMNode} from 'react-dom'
import FlipMove from 'react-flip-move'

import Toggle from './Toggle'

import indicators from '../data/indicators'
import { counties } from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'


const Wrapper = styled.div`
    display: flex;
    // flex-direction: column;
    // max-width: 480px;
    // padding: 20px;
    // box-shadow: var(--shadow);
    // border-radius: 4px;
    // background: var(--offwhitefg);
`
@observer
export default class PickerBar extends React.Component{

	@observable expanded = null
	@observable showArea = false
	@action setExpanded = (which) => {
		this.expanded = which
	}
	@action toggleArea = () => this.showArea = true
	@action hideArea = () => this.showArea = false

	componentDidMount(){
		document.addEventListener('click', function(evt){
			// if(evt.target.closest('.pickerbar')){
			// 	console.log('clicked inside')
			// 	evt.stopPropagation()
			// }
			// else{
			// 	console.log('clicked outside')
			// 	evt.stopPropagation()
			// }
			const wrapper = findDOMNode(this.wrapper)
			const thing = findDOMNode(this.thing)
			if(wrapper.contains(evt.target) || thing.contains(evt.target)){
				console.log('clicked inside')
			}
			else console.log('clicked outnside')
		})
	}

	render(){
		return(
			<React.Fragment>
				<Wrapper 
						ref = {(wrap)=>this.wrapper=wrap}
						className = 'pickerbar'>
					<IndicatorSelect 
						expanded = {this.expanded==='indicator'} 
						onClick = {()=>this.setExpanded('indicator')}
						toggleArea = {this.toggleArea}
						hideArea = {this.hideArea}
					/>
					<CountySelect 
						offset = {this.expanded}
						expanded = {this.expanded==='county'} 
						onClick = {()=>this.setExpanded('county')}
						toggleArea = {this.toggleArea}
						hideArea = {this.hideArea}
					/>
					<RaceSelect 
						offset = {this.expanded}
						expanded = {this.expanded==='race'} 
						onClick = {()=>this.setExpanded('race')}
					/>
				{!this.expanded && 
				<Toggle
					size = "big"
					options = {[
						{label: '2015', value: 2015},
						{label: '2016', value: 2016},
					]}
				/>
				}
				</Wrapper>
				<FlipMove
					// delay = {100}
					enterAnimation = {{
						from: {transform: 'scaleY(0)', opacity: 0}, 
						to: {transform: 'scaleY(1)', opacity: 1}
					}}
					leaveAnimation = {{
						from: {transform: 'scaleY(1)', opacity: 1}, 
						to: {transform: 'scaleY(0)', opacity: 0}
					}}
				>
				{this.showArea && (this.expanded === 'county' || this.expanded === 'indicator') &&
					<LargeSelectionArea 
						ref = {(thing)=>{this.thing = thing}}
						// key = {this.expanded}
					/>
				}
				</FlipMove>

			</React.Fragment>
		)
	}
	
}

const LargeSelectionArea = styled.div`
	width: 100%;
	background: white;
	height: 300px;
	border: 1px solid #d7d7d7;
	margin-top: 8px;
	transform-origin: 50% 0%;
`

const IndicatorBtn = styled.div`
	position: relative;
	width: 275px;
	border-radius: 4px 0 0 4px;
	padding: 15px 25px;
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
	height: 25px;
	transition: transform .25s;
	transform-origin: 50% 0%;
	transform: ${props => props.expanded? 'scaleY(1)' : 'scaleY(0)'};
`

const CountyBtn = styled.div`
	transition: transform .25s;
	background: white;
	border: 1px solid #d7d7d7;
	padding: 15px 25px;
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
	padding: 15px 25px;
	border: 1px solid #d7d7d7;
	border-radius: 0 4px 4px 0;
	cursor: pointer;
	transform: ${props=>props.offset?'translateX(20px)' : ''};
`

const IndicatorSelect = (props) => {
	return(
		<IndicatorBtn offset = {props.offset} onClick = {props.onClick} expanded = {props.expanded}> 
			Early Prenatal Care
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
		<RaceDropdown offset = {props.offset} onClick = {props.onClick}>
			All races
			{props.expanded && 
			<Drop>
				<Race> All races </Race>
				<Race> Asian </Race>
				<Race> Black </Race>
				<Race> Latinx </Race>
				<Race> White </Race>
			</Drop>
			}
		</RaceDropdown>
	)
}

const Drop = styled.ul`
	position: absolute;
	width: calc(100% + 2px);
	// top: 50px;
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
	padding: 15px 25px;
`
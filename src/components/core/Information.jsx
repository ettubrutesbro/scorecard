
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {findIndex} from 'lodash'
import {move} from 'lodash-move'
import FlipMove from 'react-flip-move'

import {counties} from '../../assets/counties'
import indicators from '../../data/indicators'
import semanticTitles from '../../assets/semanticTitles'

import Toggle from '../Toggle'

const Wrapper = styled.div`
	// background: rgba(255,0,0,0.1);
	padding: 30px;
`

@observer
export default class Picker extends React.Component{
	//better name? this is the component that lets users pick anything
	
	@observable mode = 'start' //start, county, race, indicator, ''
		//this might need to be a prop..?
		@action changeMode = (newmode) => {
			console.log('changemode')
			if(this.mode!=='start') this.titleButtons.splice(1,1)
			this.mode = newmode
			// reordering code:
			this.titleButtons = this.titleButtons.sort((a,b)=>{return a.name!==newmode? 1 : 0})
			const selectedIndex = findIndex(this.titleButtons, (obj)=>{return newmode===obj.name})
			this.titleButtons.splice(1, 0, {component: this.titleButtons[selectedIndex].workflow})
			this.props.store.changedPickerMode(newmode)
		}

	@action countySelect = (countyId) => {
		this.mode = ''
		this.props.onSelect('location',countyId)
	}
	@action indicatorSelect = (ind) => {
		this.mode = ''
		console.log('setting indicator as ', ind)
		this.props.onSelect('indicator', ind)

	}

	@observable titleButtons = [
		{
			name: 'county', 
			component: <CountyButton key = 'countybutton'/>,
			workflow: <PickCounty 
				highlight = {this.props.hoveredCounty}
				onHover = {this.props.onHoverCounty}
				selected = {this.props.store.location}
				onSelect = {this.countySelect}
			/>
		},
		{
			name: 'topic',
			component: <TopicButton key = 'topicbutton'/>,
			workflow: <div />
		},
		{
			name: 'race',
			component: <RaceButton key = 'racebutton'/>,
			workflow: <div />
		}
	]

	componentDidUpdate(){
		if(this.props.store.location && this.mode === 'county'){
			this.mode = ''
		}
	}

	
	render(){
		const {location, indicator, race} = this.props.store
		return(
			<Wrapper>
				<FlipMove
					typeName = {null}
					// disableAllAnimations
					// maintainContainerHeight = {true}
					enterAnimation = 'fade'
					leaveAnimation = 'fade'
				>
				{this.mode === 'start' && <StartPrompt />}
				{this.titleButtons.filter((titlebtn)=>{
						// return this.mode!=='start'?titlebtn.name===this.mode:true
						return true
					}).map((titlebtn)=>{
					return React.cloneElement(
						titlebtn.component, 
						{
							isTitle: this.mode === titlebtn.name, 
							onClick: ()=>this.changeMode(titlebtn.name)
						},
						// this.mode === titlebtn.name? titlebtn.workflow : ''
					)
				})}

				</FlipMove>

			</Wrapper>
		)
	}
}

const BackButton = styled.div`
	padding: 10px;
	border: 1px solid black;
	display: inline-flex;
`

class StartPrompt extends React.Component{
	render(){
	return <h1> How do you want to begin your data search? </h1>
	}
}

const TitleButton = styled.div`
	padding: 10px; 
	font-size: 24px;
	transition: background .5s, border .5s, box-shadow .5s;
	background: ${props => !props.isTitle? 'white' : 'transparent'};
	border: ${props => !props.isTitle? '1px solid black' : '1px solid transparent'};
	box-shadow: ${props => !props.isTitle? '0px 1px 3px rgba(0,0,0,0.25)' : ''};
	margin-top: 15px;
	&:first-of-type{
		margin-top: 0;
	}
	height: calc(1rem + 15px);
	// display: flex;
	// align-items: center;
	// box-sizing: content-box;
	position: relative;

`
const LabelTitle = styled.div`
	position: relative;
	height: calc(1rem + 15px);
	width: 100%;
	overflow: hidden;
	// border: 1px solid green;
	// position: absolute;
	// top: 11px;
	// left: 15px;
`
const Label = styled.div`
	
	opacity: ${props => props.active? 1 : 0};
	transform: ${props => props.active? 'translateX(0)' : 'translateX(-100px)'};
	transition: opacity .5s, transform .5s;
`
const Title = styled.div`
	position: absolute;
	top: 0;
	transition: opacity .5s, transform .5s;
	opacity: ${props => props.active? 1 : 0};
	transform: ${props => props.active? 'translateX(0)' : 'translateX(100px)'};
	

`
const Workflow = styled.div `
	margin-top: 50px;
`
@observer
class CountyButton extends React.Component {
	//becomes title when selected
	render(){
		return <TitleButton 
			onClick = {this.props.onClick} 
			isTitle = {this.props.isTitle}
		> 	
			<LabelTitle> 
				<Label active = {!this.props.isTitle}>See a list of counties  </Label>
				<Title active = {this.props.isTitle}>Which county do you want to see data for?</Title>
			</LabelTitle>
			<Workflow>
				{this.props.children}
			</Workflow>
		</TitleButton>
	}
}
class TopicButton extends React.Component {
	render(){
	return <TitleButton
		onClick = {this.props.onClick}
		isTitle = {this.props.isTitle}
	> 
		<LabelTitle>
			<Label active = {!this.props.isTitle}> by Topic / Indicator </Label>
			<Title active = {this.props.isTitle}> What data would you like to see? </Title>
		</LabelTitle>
	</TitleButton>
	}
}
class RaceButton extends React.Component {
	render(){
	return <TitleButton
		onClick = {this.props.onClick}
		isTitle = {this.props.isTitle}
	> 
		<LabelTitle>
			<Label active = {!this.props.isTitle}> by Race </Label>
			<Title active = {this.props.isTitle}> What race do you want to see data about? </Title>
		</LabelTitle>
	</TitleButton>
	}
}


const CountyList = styled.ul`
	font-size: 16px;
	list-style-type: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
`
const County = styled.li`
	padding: 10px 15px;
	// display: inline-flex;
	// width: 25%;
	justify-content: center;
	align-items: center;
	// border: 1px solid #d7d7d7;
	flex-grow: 1;
	margin: 3px;
	background: ${props => props.selected? 'red' : props.highlight? 'pink' : 'white'};
`
const CountySort = styled.div`
	width: 100%;
`
const PickCounty = (props) => {
	return(
		<CountyList>
		{/* <CountySort> Sorting by
			<Toggle
				// onClick = {}
				options = {[
					{label: 'Alphabetical order'},
					{label: 'Population'},
				]}
			/>
		</CountySort> */}
		{counties.sort((a,b)=>{
			if(a.id < b.id) return -1
			else if (a.id > b.id) return 1
			else return 0
		}).map((county)=>{
			return (
				<County 
					highlight = {props.highlight === county.id}
					selected = {props.selected === county.id}
					onMouseEnter = {()=>props.onHover(county.id)}
					onMouseLeave = {()=>props.onHover()}
					onClick = {()=>props.onSelect(county.id)}
				> 
					{county.label} 
				</County>
			)
		
		})}
		</CountyList>
	)
}
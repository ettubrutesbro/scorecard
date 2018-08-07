
import React from 'react'
import styled, {keyframes} from 'styled-components'

// import {observable, action, computed} from 'mobx'
// import {observer} from 'mobx-react'

// import FlipMove from 'react-flip-move'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'

const scaleMount = keyframes`
	from {opacity: 0;}
	to {opacity: 1;}
`

const inverseScale = keyframes`
	from { opacity: 1;}
	to{ opacity: 0;} 
`

const Wkflw = styled.div`
	border: 1px solid black;
	transform-origin: 50% 0%;
	border-top-color: transparent;
	flex-grow: 1;
	padding: 10px;
`
const Content = styled.div`
	background: black;
	padding: 10px;
	color: white;
	opacity: 0;
	animation: ${scaleMount} .5s forwards;
	animation-delay: .5s;
	// visibility: ${props=>!props.mounting? 'hidden' : 'visible'};
`
const List = styled.ul`
	list-style-type: none;
	margin: 0;
	padding: 0;
`
const Item = styled.li`
	margin: 0;
	cursor: pointer;
`
const IndicatorList = (props) => {
	return(
		<List>
			{Object.keys(indicators).map((ind)=>{
				return <Item
					onClick = {()=>{props.clickedItem('indicator',ind)}}
				> 
					{semanticTitles[ind].label} 
				</Item>
			})}
		</List>
	)
}
const workflowManifest = {
	indicator: <IndicatorList />,
	race: <div>'hewwo'</div>,
	location: <div>'locazion'</div>,
}
	

export default class Workflow extends React.Component{
	render(){
		const {store, target} = this.props

		console.log(workflowManifest[target])
		return(
			<Wkflw target = {target}>
				<Content 
					mounting = {store.activeWorkflow === target}
					// onClick = {()=>store.completeWorkflow(target,'black')}
				>
					{React.cloneElement(
						workflowManifest[target],
						{clickedItem: store.completeWorkflow}
					)}
				</Content>
			</Wkflw>
		)
	}
}





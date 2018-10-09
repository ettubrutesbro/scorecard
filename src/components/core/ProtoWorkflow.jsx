
import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import FlipMove from 'react-flip-move'

import WorkflowButton from '../WorkflowButton'
import Workflow from '../Workflows'

const MockCompleteBtn = styled.div`
	background: black;
	padding: 10px;
	color: white;
`
const Breadcrumbs = styled.div`
	// width: auto;
	display: inline-flex;
	background: #f3f3f5;
	padding: 10px;
	flex-grow: 1;
	justify-content: flex-start;
`
const Crumb = styled.div`
	padding: 5px; background: white;
	border: 1px solid #d7d7d7;
`
const Readout = styled.div`
	width: 100%;
	height: 300px;
	border: 1px solid black;
`
const Context = styled.div`
	width: 100%;
	border: 1px solid black;
`
const Breakdown = styled.div`
	width: 100%;
	border: 1px solid black;
`


class Complete extends React.Component{
	render(){
		return(
			<Breadcrumbs>
				{store.queryOrder.map((query)=>{
					return <Crumb> {query} : {store[query]} </Crumb>
				})}
			</Breadcrumbs>
		)
	}
}
	
class InfoStore{
	@observable indicator = null
	@observable county = null
	@observable race = null
	@observable activeWorkflow = null

	@observable queryOrder = []

	@computed get itemOrder(){
		const {indicator, county, race, activeWorkflow} = this
		if(!indicator && !county && !race && !activeWorkflow){
			console.log('initial state')
			return [ 'indicatorBtn', 'countyBtn', 'raceBtn']
		} 
		else if(!indicator && !county && !race && activeWorkflow){
			console.log('first workflow state')
			if(activeWorkflow === 'county') return ['countyBtn','countyWorkflow','indicatorBtn','raceBtn']
			else if(activeWorkflow === 'indicator') return ['indicatorBtn','indicatorWorkflow','countyBtn','raceBtn']
			else if(activeWorkflow === 'race') return ['raceBtn','raceWorkflow','indicatorBtn','countyBtn']
		}
		else if((indicator||county||race) && !activeWorkflow){
			console.log('information state')
			const incompleteWorkflows = ['indicatorBtn','countyBtn','raceBtn'].filter((btn)=>{
				return !this[btn.replace('Btn','')]
			})
			let order = ['complete','readout','breakdown','context',...incompleteWorkflows]
			
			return order

		}
		else{
			console.log('drill state')
			const queryOrder = this.queryOrder.map((item)=> {return item+'Complete'})
			const incompleteWorkflows = ['indicatorBtn','countyBtn','raceBtn'].filter((btn)=>{
				return !this[btn.replace('Btn','')]
			})

			let order = ['complete','readout',...incompleteWorkflows]

			if(!this[this.activeWorkflow]){
				order.splice(order.indexOf(this.activeWorkflow+'Btn',)+1, 0, this.activeWorkflow+'Workflow')
			} 
			else order.splice(1, 0, this.activeWorkflow+'Workflow')
			return order
		}
	}

	@action setWorkflow = (mode) => this.activeWorkflow = mode
	@action completeWorkflow = (which, value) => {

		if(!this.queryOrder.includes(this.activeWorkflow)) this.queryOrder.push(this.activeWorkflow)
		this.activeWorkflow = null
		this[which] = value
		console.log('query order:', this.queryOrder.toJS())
	}
	
}

const store = new InfoStore()

const manifest = {
	countyBtn: {
		component: <WorkflowButton key = 'countybtn'>by County</WorkflowButton>,
		track: 'county',
		props: {onClick: ()=>{store.setWorkflow('county')}}
	},
	indicatorBtn: {
		component: <WorkflowButton key = 'indicatorbtn'>Topic / Indicator</WorkflowButton>,
		track: 'indicator',
		props: {onClick: ()=>{store.setWorkflow('indicator')}}

	},
	raceBtn: {
		component: <WorkflowButton key = 'racebtn'>by Race</WorkflowButton>,
		track: 'race',
		props: {onClick: ()=>{store.setWorkflow('race')}}
	},
	countyWorkflow: {
		component: <Workflow key = 'countyworkflow'>countyworkflow</Workflow>,
		props: {onComplete: ()=>{store.completeWorkflow('county','foo')}}
	},
	indicatorWorkflow: {
		component: <Workflow key = 'indicatorworkflow'>indicatorworkflow</Workflow>,
		props: {onComplete: ()=>{store.completeWorkflow('indicator','foo')}}

	},
	raceWorkflow: {
		component: <Workflow key = 'raceworkflow'>raceworkflow</Workflow>,
		props: {onComplete: ()=>{store.completeWorkflow('race','foo')}}
	},
	complete: {
		component: <Complete key = 'completed' />,
		props: {onClick: ()=>{store.setWorkflow('county')}}
	},
	readout: {component: <Readout key = 'readout'>readout</Readout>},
	breakdown: {component: <Breakdown key ='breakdown'>breakdown</Breakdown>},
	context: {component: <Context key ='context'>context</Context>}
}

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 450px;
	position: relative;
	border: 1px solid red;
`

@observer
export default class ProtoWorkflow extends React.Component{

	render(){
		return(
			<Wrapper>
				<FlipMove 
					typeName = {null}
					enterAnimation = 'fade'
					leaveAnimation = 'fade'
				>
				{store.itemOrder.map((item)=>{
					console.log(manifest[item])
					const {component, props, track} = manifest[item]
					return React.cloneElement(
						component,
						{
							className: store[track]? 'complete' : '',
							...props
						}
					)
				})}
				</FlipMove>
			</Wrapper>
		)
	}
}
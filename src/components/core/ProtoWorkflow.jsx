
import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import FlipMove from 'react-flip-move'

const Btn = styled.div`
	width: 100%;
	border: 1px solid black;
	padding: 10px;
	&.complete{
		width: auto;
		display: inline-flex;
	}
`
const Wkflw = styled.div`
	width: 100%;
	border: 1px solid black;
	height: 200px;
	padding: 10px;
`
const MockCompleteBtn = styled.div`
	background: black;
	padding: 10px;
	color: white;
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
class Button extends React.Component{
	render(){
		return(
			<Btn onClick = {this.props.onClick} className = {this.props.className}>
				{this.props.children}
			</Btn>
		)
	}
}

class Workflow extends React.Component{
	render(){
		return(
			<Wkflw className = {this.props.className}>
				{this.props.children}
				<MockCompleteBtn onClick = {this.props.onComplete}>
					make selection from workflow
				</MockCompleteBtn>
			</Wkflw>
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
			const queryOrder = this.queryOrder.map((item)=> {return item+'Btn'})
			const incompleteWorkflows = ['indicatorBtn','countyBtn','raceBtn'].filter((btn)=>{
				return !this[btn.replace('Btn','')]
			})
			console.log('still incomplete:', ...incompleteWorkflows)
			let order = queryOrder.slice()
			order.push(...incompleteWorkflows)
			// let order = ['indicatorBtn','countyBtn','raceBtn'].sort((a,b)=>{
			// 	//btns with no corresponding values are pushed to end
			// 	return !this[a.replace('Btn','')]? 1 : 0
			// })
			let completedWorkflows = 0
			const factors = ['indicator','county','race']
			factors.forEach((e)=>{
				if(this[e]) completedWorkflows ++
			})
			const infoCluster = ['readout', 'breakdown', 'context']
			order.splice(completedWorkflows,0,...infoCluster)
			console.log(order)
			return order

		}
		else{
			console.log('drill state')
			const queryOrder = this.queryOrder.map((item)=> {return item+'Btn'})
			const incompleteWorkflows = ['indicatorBtn','countyBtn','raceBtn'].filter((btn)=>{
				return !this[btn.replace('Btn','')]
			})

			let order = queryOrder.slice()
			order.push(...incompleteWorkflows)
			// let order = ['indicatorBtn','countyBtn','raceBtn'].sort((a,b)=>{
			// 	//btns with no corresponding values are pushed to end
			// 	const aa = a.replace('Btn','')
			// 	const bb = b.replace('Btn','')
			// 	return !this[aa]? 1 
			// 	: this.queryOrder.indexOf(aa) > this.queryOrder.indexOf(bb)? 0.5  
			// 	: 0
			// })
			let completedWorkflows = 0
			const factors = ['indicator','county','race']
			factors.forEach((e)=>{
				if(this[e]) completedWorkflows ++
			})
			order.splice(completedWorkflows, 0, 'readout')
			order.splice(order.indexOf(this.activeWorkflow+'Btn')+1, 0, this.activeWorkflow+'Workflow')
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
		component: <Button key = 'countybtn'>by County</Button>,
		track: 'county',
		props: {onClick: ()=>{store.setWorkflow('county')}}
	},
	indicatorBtn: {
		component: <Button key = 'indicatorbtn'>Topic / Indicator</Button>,
		track: 'indicator',
		props: {onClick: ()=>{store.setWorkflow('indicator')}}

	},
	raceBtn: {
		component: <Button key = 'racebtn'>by Race</Button>,
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
	readout: {component: <Readout key = 'readout'>readout</Readout>},
	breakdown: {component: <Breakdown key ='breakdown'>breakdown</Breakdown>},
	context: {component: <Context key ='context'>context</Context>}
}

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 450px;
	position: relative;
`

@observer
export default class ProtoWorkflow extends React.Component{

	render(){
		return(
			<Wrapper>
				<FlipMove>
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
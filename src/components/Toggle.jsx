import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import makeHash from '../utilities/makeHash'
import {findDOMNode} from 'react-dom'

const ToggleBody = styled.div`
	position: relative;
	display: inline-flex;
	border: 1px solid black;
	// padding: 10px;
`
const Option = styled.div`
	box-sizing: border-box;
	height: 100%;
	// border: 1px solid red;
	padding: 8px 12px 9px 12px;
	&:not(:first-of-type){
		border-left: 1px solid black;
	}
	color: ${props => props.selected? 'red' : 'black'};

` 

const Accent = styled.div`
	position: absolute;
	width: 100px;
	bottom: 0;
	box-sizing: border-box;
	border: 2px solid black;
	transform-origin: 0% 100%;
	transition: transform .2s;
	&::after{
		// content: '';
		position: absolute;
		height: 3px;
		border-right: 1px solid black;
		right: -3px;
		top: -2px;
	}
`
@observer
export default class Toggle extends React.Component {
	hash = makeHash()
	@observable accentWidth = 50
	@observable accentPosition = 0
	@observable lastSelected = 0
	@action setLastSelected = () => this.lastSelected = this.props.selected
	@action updateAccent = () => {
		const node = findDOMNode(this['option'+this.props.selected])
		this.accentPosition =  node.offsetLeft
		this.accentWidth = node.offsetWidth
	}
	componentWillUpdate(){
		this.setLastSelected()
	}
	componentDidMount(){
		this.updateAccent()
	}
	componentDidUpdate(){
		this.updateAccent()
	}


	render(){
	return(
		<ToggleBody>
			{this.props.options.map((option, i)=>{
				
				return <Option 
					key = {this.hash+'option'+i}
					ref = {(option)=> this['option'+i] = option}
					onClick = {()=>this.props.onClick(option.value)}
					selected = {i===this.props.selected}
				> 
					{option.label}
				</Option>
			})}
			<Accent 
				style = {{
					transform: `translateX(${this.accentPosition}px) scaleX(${this.accentWidth/100})`,
					// transition: `transform ${.25*Math.abs(this.lastSelected - this.props.selected)}s`
				}}
			/>
		</ToggleBody>
	)
	}

}

Toggle.defaultProps = {
	selected: 0,
}
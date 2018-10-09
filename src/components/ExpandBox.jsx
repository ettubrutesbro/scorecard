
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

const Box = styled.div`
	position: absolute;
	padding: 50px;
	border: 1px solid var(--bordergrey);
	transition: transform .5s, opacity .5s;
	transition-delay: ${props => props.show? '.1s' : '0'};
	transform: ${props => props.show? 'scaleY(1)' : 'scaleY(0)'};
	// opacity: ${props => props.show? 1 : 0};
	transform-origin: 50% 0%;
`
const Content = styled.div`
	opacity: ${props => props.ready? 1 : 0};
	transition: ${props => props.ready? 'opacity .5s' : 'none'};
`

@observer
export default class ExpandBox extends React.Component{

	@observable contentReady = false
	@action setContentReady = (val) => {
		console.log(val)
		this.contentReady = val
	}

	componentDidUpdate(){
		console.log('update')
		if(!this.props.show){ 
			console.log('hiding content')
			this.setContentReady(false)
		}
	}

	render(){
		return(
			<Box 
				style = {this.props.style}
				show = {this.props.show}
				onTransitionEnd = {this.props.show? ()=>this.setContentReady(true) : ()=>{console.log('transition ended')}}
			>
				<Content ready = {this.props.show && this.contentReady}>
					{this.props.children}
				</Content>
			</Box>
		)
	}
}

import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'
// import FlipMove from 'react-flip-move'

const VertBar = styled.div`
	position: relative;
	height: 500px; //arbitrary
	outline: 1px solid #999999;
	// box-sizing: border-box;
	width: 40px;
	display: flex;
	flex-direction: column;
`
const Segment = styled.div`
	position: absolute;
	width: 100%;
	background-color: ${props=>props.selected?'rgba(239,103,50,0.25)':'white'};
	height: 100%;
	transition: transform ${props=>props.index*.05+.25}s background-color .25s;
	transform: translateY(${props=>props.offset}px) scaleY(${props=>props.height});
	transform-origin: 50% 0%;
	// background-color: ${props=>props.fill};
	outline: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
`
const Hatch = styled.div`
	position: absolute;
	width: 100%;
	top: 0;
	transform: translateY(${props=>props.offset}px);
	border-top: ${props=>props.selected? '1px solid #EF6732' : '1px solid #999'};
`

@observer
export default class VerticalBreakdownBar extends React.Component{
	@observable height = 500 //TODO: need to findDOMNode this shit
	render(){
		const sortedSegs = this.props.segments.sort((a,b)=>{
			return b.label === 'Other'? -2 : a.value>b.value? -1 : a.value<b.value? 1 : 0
		})
		return(
			<VertBar>
				{sortedSegs.map((seg, i,arr)=>{
					const previousSegs = arr.slice(0,i)
					const offset = previousSegs.map((seg)=>{return seg.value}).reduce((a,b)=>a+b,0)

					return <Segment
						index = {i}
						key = {'bar'+i}
						fill = {seg.color}
						offset = {(offset/100) * this.height}
						height = {(seg.value/100)}
						selected = {this.props.selected === i}
					/>
				})}
				{sortedSegs.map((seg, i, arr)=>{
					const previousSegs = arr.slice(0,i)
					const offset = previousSegs.map((seg)=>{return seg.value}).reduce((a,b)=>a+b,0)
					return <Hatch
						offset = {(offset/100) * this.height}
						selected = {this.props.selected === i || this.props.selected+1 === i}
					/>
				})}
			</VertBar>
		)
	}
}

VerticalBreakdownBar.defaultProps = {
	selected: 1,
}
import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import FlipMove from 'react-flip-move'

const Breadcrumbs = styled.div`
	// width: auto;
	display: inline-flex;
	background: #f3f3f5;
	padding: 10px;
	justify-content: flex-start;
	flex-shrink: 0;
	transform-origin: 50% 0%;
`
const Crumb = styled.div`
	padding: 5px; background: white;
	border: 1px solid #d7d7d7;
`


export default class Completed extends React.Component{
	render(){
		const {store} = this.props
		return(
			<Breadcrumbs>
				{store.queryOrder.map((query)=>{
					return <Crumb
						onClick = {()=>store.setWorkflow(query)}
					> 
						{query} : {store[query]} 
					</Crumb>
				})}
			</Breadcrumbs>
		)
	}
}

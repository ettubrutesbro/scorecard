
import React from 'react'
import styled from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import flows from './assets/wizardcopy'

@observer
export default class Wizard extends React.Component {
	
	@observable step = 'init' 
	@action edit = (val) => { this.step = val}
	render(){
		return(
			<div>
			<h1>{flows[this.step].title}</h1>
			<OptionList>
			{flows[this.step].options.map((option)=>{
				return(
					<Option onClick = {()=>this.edit(option.goTo)} >
						<h3>{option.label}</h3>
						<p>{option.context}</p>
					</Option>
				)
			})}
			</OptionList>
			</div>
		)
	}
}	

const OptionList = styled.ul`
	list-style-type: none;
`
const Option = styled.li`
	display: flex;
	align-items: center;
	border: 1px solid black;
	padding: 15px;
	h3{ margin-right: 15px; }
`

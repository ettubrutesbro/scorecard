import React from 'react'
import styled from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

// const PickerBar = styled.div`
// 	width: 70%;
// 	background: white;
// 	height: 40px;
// 	border: 1px solid #d7d7d7;
// `

import PickerBar from './components/PickerBar'

const Share = styled.div`
	width: 30%;
	border: 1px solid black;
` 
const Nav = styled.div`
	background: var(--offwhitebg);
	display: flex;
	justify-content: space-between;
	padding: 20px;
`

export default class Navbar extends React.Component{
	render(){
		return(
				<Nav>
					<PickerBar />
					<Share>
						Share
					</Share>
				</Nav>
		)
	}
}

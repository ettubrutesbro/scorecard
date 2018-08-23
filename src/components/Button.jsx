import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import makeHash from '../utilities/makeHash'
import {findDOMNode} from 'react-dom'

const Btn = styled.div`
	padding: 15px;
	background: black;
	color: white;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`

const Button = (props) => {
	return(
		<Btn onClick = {props.onClick}>
			{props.label}
		</Btn>
	)
}

export default Button
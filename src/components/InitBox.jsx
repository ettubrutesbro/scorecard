import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
	position: absolute;
	width: 500px;
	top: 50px;
	left: 500px;
	line-height: 160%;
	border: 2px solid var(--bordergrey);
	padding: 35px;
	z-index: 12;
`
const Button = styled.div`
	margin-top: 15px;
	border: 1px solid var(--strokepeach);
	background: var(--peach);
	color: white;
	padding: 10px 15px;
`

export default class InitBox extends React.Component{
	render(){
		return(
			<Box>
				<p>
				Welcome to our scorecard! It was made to do X and Y. Cab sav brickie ugg boots rort freo. Cubby house quid drongo with rock up to boil-over spit the dummy damper garbo bludger. No dramas bog standard jug dole bludger jumbuck thingo bities franger slacker.
				</p>
				<p>
				Note about rounding, note about incomplete data, and note about asterisks go here
				</p>
				<Button
					onClick = {this.props.closeSplash}
				>
					Get Started > 
				</Button>
			</Box>
		)
	}
}
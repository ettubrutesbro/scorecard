
import React from 'react'
import styled from 'styled-components'

import ScorecardStore from './ScorecardStore'

import Navbar from './Nav'

import ReadoutContent from './components/Readout'
import Breakdowns from './components/Breakdown'
import California from './components/core/InteractiveMap'

const Body = styled.div`
	width: 100%;
	height: 100%;
`

const Info = styled.div`
	position: relative;
	background: white;
	padding: 30px;
`
const Row = styled.div`
	display: flex;
`
const GenericDebug = styled.div`
	border: 1px solid black;
	padding: 30px;
`
const Readout = styled(GenericDebug)`
	width: 70%;
`
const Legend = styled(GenericDebug)`
	width: 30%;
`
const Breakdown = styled(GenericDebug)`
	width: 50%;
`
const CAMap = styled(GenericDebug)`
	width: 50%;
`

const GreyMask = styled.div`
	position: absolute;
	background: var(--offwhitebg);
	height: 100%;
	transform: scaleY(0);
	transform-origin: 50% 0%;
	width: 100%;
	top: 0; left: 0;
`

const store = new ScorecardStore()
window.store = store

export default class Scorecard extends React.Component{
	render(){
		return(
			<Body>
				<Navbar store = {store} />
				<Info>
					<Row>
						<Readout> <ReadoutContent store = {{...store, year: 0, indicator: 'earlyPrenatalCare'}} /> </Readout>
						<Legend> Legend </Legend>
					</Row>
					<Row>
						<GreyMask />
						<Breakdown> 
							<Breakdowns 
								store = {{
									...store,
									year: 0, indicator: 'earlyPrenatalCare'
								}}
							/>
						 </Breakdown>
						<CAMap> 
							<California 
								store = {store}
								data = ''
								// selected = {'sierra'}
							/>
						</CAMap>
					</Row>

				</Info>
			</Body>
		)
	}
}
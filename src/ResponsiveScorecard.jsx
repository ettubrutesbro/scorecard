import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import ReadoutComponent from './components/Readout'
import BreakdownComponent from './components/Breakdown'

const media = {
	optimal: '(min-width: 1600px)',
	compact: '(min-width: 1280px) and (max-width: 1599px)', //max 1599?
	mobile: '(max-width: 1279px)'
}

const Quadrant = styled.div`
	border: 1px solid black;
	display: flex;
	align-items: center;
`

const App = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	@media ${media.optimal}{
		width: 1600px;
		height: 900px;
	}
	@media ${media.compact}{
		width: 1280px;
		height: 720px;
	}
	@media ${media.mobile}{
		width: 100vw;
	}
`
const Row = styled.div`
	width: 100%;
	display: flex;
`
const TopRow = styled(Row)`
	flex-grow: 1;
`
const BottomRow = styled(Row)`
	flex-grow: 4;
`
const Nav = styled(Row)`
	background: black;
	height: 75px;
	flex-grow: 0;
`

const Readout = styled(Quadrant)`
	@media ${media.optimal}{

	}
	@media ${media.compact}{
		width: 70%;
	}
	@media ${media.mobile}{}
`
const Breakdown = styled(Quadrant)`
	@media ${media.optimal}{}
	@media ${media.compact}{
		width: 50%;
	}
	@media ${media.mobile}{}
`
const Legend = styled(Quadrant)`
	@media ${media.optimal}{}
	@media ${media.compact}{
		width: 50%;
	}
	@media ${media.mobile}{}
`
const SVGMap = styled(Quadrant)`
	@media ${media.optimal}{}
	@media ${media.compact}{
		width: 70%;
	}
	@media ${media.mobile}{}
`




export default class ResponsiveScorecard extends React.Component{
	
	render(){
		const store = this.props.store
		return(
			<App>
				<Nav />
				<TopRow>
					<Readout> <ReadoutComponent store = {store}/> </Readout>
					<Legend />
				</TopRow>
				<BottomRow>
					<Breakdown> <BreakdownComponent store = {store} /> </Breakdown>
					<SVGMap />
				</BottomRow>
			</App>
		)
	}
}

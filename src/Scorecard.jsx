
import React from 'react'
import styled from 'styled-components'

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import ScorecardStore from './ScorecardStore'

import Nav from './Nav'

import {find, mapValues} from 'lodash'


import Readout from './components/Readout'
import Breakdowns from './components/Breakdown'
import California from './components/core/InteractiveMap'
import RaceBreakdownBar from './components/RaceBreakdownBar'
import DemoDataTable from './components/DemoDataTable'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'


import {camelLower} from './utilities/toLowerCase'

const Body = styled.div`
	width: 100%;
	max-width: 1600px;
	// position: relative;
`

const Info = styled.div`
	margin-top: 0;
	padding-top: 90px;
	position: relative;
	background: white;
	display: flex;
	flex-direction: column;
	height: 100vh;
`
const Row = styled.div`
	display: flex;
	// justify-content: space-between;
	// justify-content: center;
	// border: 1px solid red;
`
const TopRow = styled(Row)`` 
const BottomRow = styled(Row)`
	flex-grow: 1;
` 
const GenericDebug = styled.div`
	padding: 30px;
`
const Legend = styled(GenericDebug)`
	// width: 30%;
	border: 1px solid black;
	position: absolute;
	left: ${props => props.left}px;
	width: ${props => props.width}px;
`
const Breakdown = styled(GenericDebug)`
	width: 50%;
	max-width: 560px;
`
const CAMap = styled(GenericDebug)`
	flex-basis: 50%;
	position: relative;
	padding: 0px;
	display: flex;
	align-items: center;
`

const GreyMask = styled.div`
	position: absolute;
	z-index: 6;
	background: var(--offwhitebg);
	height: 100%;
	transform: ${props => props.open?' scaleY(1)' : 'scaleY(0)'};
	transform-origin: 50% 0%;
	transition: transform .5s;
	width: 100%;
	top: 0; left: 0;
`

const MapOverlapBox = styled.div`
	position: absolute;
	// border: 1px solid red;
	display: flex;
	padding: 20px;
	z-index: 10;
`

const store = new ScorecardStore()
window.store = store

@observer
export default class Scorecard extends React.Component{
	@observable navOpen = false
    @observable hoveredCounty = null
    @observable overlapBoxDims = {
    	left: 0,
    	top:0,
    	width: 0,
    	height: 0,
    }
    @action openNav = (status) => {
    	this.navOpen = status
    }
    @action onHoverCounty = (id) => {
        if(id) this.hoveredCounty = camelLower(id)
        else this.hoveredCounty = null
    }
	@action drawBox = (coords) => {
		this.overlapBoxDims = {...coords}
		console.log(...coords)
	}
	@action getSVGDims = (dims) => {
		this.svgDims = {...dims}
		this.svgReady = true
	}
	@observable svgDims = {width: 0, height: 0}
	@observable svgReady = false

	render(){
        const {indicator, year, race} = store
        const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
        }): ''
		return(
			<Body>
				<Nav store = {store} open = {this.openNav}/>
				<Info>
					<Row
					>
						<Readout store = {{...store, year: 0, indicator: 'earlyPrenatalCare'}} />
						<Legend
							left = {this.overlapBoxDims.left}
							width = {this.overlapBoxDims.width}
						> Legend </Legend>
					</Row>
					<BottomRow
					>
						<GreyMask 
							open = {this.navOpen}
						/>
						<Breakdown> 
							<Breakdowns 
								store = {{
									...store,
									year: 0, indicator: 'earlyPrenatalCare'
								}}
							/>
						 </Breakdown>
 							<MapOverlapBox
								style = {{
									left: this.overlapBoxDims.left,
									top: this.overlapBoxDims.top,
									width: this.overlapBoxDims.width,
									height: this.overlapBoxDims.height,
								}}
							>
								<DemoDataTable
									store = {store}
								/>

								<RaceBreakdownBar 
									height = {this.overlapBoxDims.height}
									store = {store}

								/>

							</MapOverlapBox>
						<CAMap> 
							<California 
								store = {store}
								returnBoxCoords = {this.drawBox}
		                        onHoverCounty = {this.onHoverCounty}
		                        hoveredCounty = {this.hoveredCounty}
		                        onSelect = {store.completeWorkflow}
		                        selected = {store.county}
		                        data = {dataForMap}
		                        mode = {dataForMap?'heat':''}
		                        reportSVGDims = {this.getSVGDims}


								// selected = {'sierra'}
							/>

							
						</CAMap>
					</BottomRow>

				</Info>
			</Body>
		)
	}
}
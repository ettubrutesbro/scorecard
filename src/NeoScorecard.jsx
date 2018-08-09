
import React from 'react'
import styled from 'styled-components'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import {find, mapValues} from 'lodash'

import CAMap from './components/core/InteractiveMap'
import Readout from './components/Readout'
import UniversalPicker from './components/UniversalPicker'

import IndicatorList from './components/IndicatorList'
import CountyList from './components/CountyList'

import {camelLower} from './utilities/toLowerCase'

import indicators from './data/indicators'
import {counties} from './assets/counties'

class AppStore{
    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable year = null
    @observable activeWorkflow = null

    @observable queryOrder = []

    @action setYearIndex = () => {
        const newYears = indicators[this.indicator].years
        if(!this.year && newYears.length>1) this.year = newYears.length-1
        else if(!this.year) this.year = 0
        else if(this.year === 1 && newYears.length===1) this.year = 0
        console.log(`year ${this.year} (${newYears[this.year]})`)
    }

    @action setWorkflow = (mode) => this.activeWorkflow = mode===this.activeWorkflow? '' : mode
    @action completeWorkflow = (which, value) => {

        if(!this.queryOrder.includes(this.activeWorkflow)) this.queryOrder.push(this.activeWorkflow)
        console.log('query order:', this.queryOrder.toJS())

        this.activeWorkflow = null
        this[which] = value
        if(which==='indicator'){
            this.setYearIndex()
        }
        
    }
    
}

const store = new AppStore()

const App = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`
const Left = styled.div`
	width: 50%;
	height: 100%;
`
const Right = styled.div`
	width: 50%;
	height: 100%;
`
const Workflow = styled.div`
	position: fixed;
	width: 100%; height: 100%;
	z-index: 13;
	padding: 60px;
	background: rgba(0,0,0,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
`
const WorkflowContent = styled.div`
	padding: 60px;
	background: rgba(255,255,255,.95);
	max-width: 1280px;
`
const ExitWorkflow = styled.div`
	position: absolute;
	width: 30px;
	height: 30px;
	background: black;
	top: 0;
	right: 0;
`
@observer
export default class NeoScorecard extends React.Component{
	@observable hoveredCounty = null
	@action onHoverCounty = (id) => {
		if(id) this.hoveredCounty = camelLower(id)
		else this.hoveredCounty = null
	}
	render(){
		const {indicator, year, race} = store
		const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
			return county[race||'totals'][year]
		}): ''
		return(
			<App>
				{(store.activeWorkflow === 'indicator' || store.activeWorkflow === 'county') && 
					<Workflow>
						<WorkflowContent>
						<ExitWorkflow onClick = {()=>store.setWorkflow(null)}/>
						{store.activeWorkflow === 'indicator' &&
							<IndicatorList store = {store} />
						}
						{store.activeWorkflow === 'county' &&
							<CountyList store = {store} />
						}
						</WorkflowContent>
					</Workflow>
				}
				<Left>
					<UniversalPicker 
						store = {store}
						countySearchPlaceholder = {
							this.hoveredCounty? find(counties, (c)=>{return c.id===this.hoveredCounty}).label 
							: 'Search counties...'}
					/>
					<Readout store = {store}/>
				</Left>
				<Right>
					<CAMap 
						mode = "zoom"
						store = {store}
						onHoverCounty = {this.onHoverCounty}
						hoveredCounty = {this.hoveredCounty}
						onSelect = {store.completeWorkflow}
						selected = {store.county}

					    colorStops = { ['#CDFCFE','#135F80'] }
						data = {dataForMap}
						mode = {dataForMap?'heat':''}
						// selected = "sanLuisObispo"
					/>
				</Right>
			</App>


		)
	}
}
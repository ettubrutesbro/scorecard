
import React from 'react'
import styled from 'styled-components'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import {find, mapValues} from 'lodash'

import CAMap from './components/core/InteractiveMap'
import Readout from './components/Readout'
import Breakdown from './components/Breakdown'
import UniversalPicker from './components/UniversalPicker'

import IndicatorList from './components/IndicatorList'
import CountyList from './components/CountyList'

import {camelLower} from './utilities/toLowerCase'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'

class AppStore{
    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable year = null
    @observable activeWorkflow = null

    @action setYearIndex = () => {
        const newYears = indicators[this.indicator].years
        if(!this.year && newYears.length>1) this.year = newYears.length-1
        else if(!this.year) this.year = 0
        else if(this.year === 1 && newYears.length===1) this.year = 0
        console.log(`year ${this.year} (${newYears[this.year]})`)
    }

    @action setWorkflow = (mode) => this.activeWorkflow = mode===this.activeWorkflow? '' : mode
    @action completeWorkflow = (which, value) => {

        if(which==='indicator' && this.race &&!indicators[value].categories.includes('hasRace')) this.race = null
        else if(which==='indicator' && this.county){
            const val = indicators[value].counties[this.county][this.race||'totals'][this.year]
            this.county = null
        }
        else if(which==='county' && this.indicator){
            const val = indicators[this.indicator].counties[value][this.race||'totals'][this.year]
            if(this.race && (!val || val==='*')){ 
                const holdOnToRace = this.race
                this.race = null
                console.log('unset race so the selection could go on')
                if(!this.checkInvalid('county',value)){
                    this.race = holdOnToRace
                    return
                }
            }
            else if(!this.race && (!val || val==='*')){
                console.log('this county has no data, stopping selection')
                return
            }
        }
        if(!this.checkInvalid()){ 
            console.log('something invalid, stopping selection')
            alert('oops! something bad happened.')
            return
        }

        this.activeWorkflow = null
        this[which] = value
        if(which==='indicator'){
            this.setYearIndex()
        }
        if(this.race && this.indicator && this.county && !indicators[this.indicator].counties[this.county][this.race][this.year]){
            //if race/indicator/county selected -> no race data, unset race
            // console.log('race not supported after selection, unsetting')
            // this.race = null

            //the result of this code is that it just looks unresponsive - lets grey the options in UniversalPicker
        }
        
    }

    checkInvalid = (which, value) => {
        const {indicator, county, race, year} = this
        const val = indicator? indicators[which==='indicator'?value:indicator].counties[which==='county'?value:county||'california'][which==='race'?value:race||'totals'][year]
            : demopop[county||'california'][race||'population']
        console.log(val)
        return val==='*' || !val? false : true
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
                    <Breakdown store = {store}/>
                </Left>
                <Right>
                    <CAMap 
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
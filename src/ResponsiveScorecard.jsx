import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {mapValues, find} from 'lodash'


import ScorecardStore from './ScorecardStore'
import Styles from './components/Styles'

import NavComponent, {PickingWorkflow} from './ResponsiveNav'
import ReadoutComponent from './components/Readout'
import BreakdownComponent from './components/Breakdown'
import LegendComponent from './components/Legend'
import MapComponent from './components/InteractiveMap'
import DemoDataTable from './components/DemoDataTable'
import RaceBreakdownBar from './components/RaceBreakdownBar'
import InitBox from './components/InitBox'
import SourcesButton, {DemoSources} from './components/Sources'
import DemoBox from './components/DemoBox'

import {Button} from './components/generic'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'

import media from './utilities/media'
import {camelLower} from './utilities/toLowerCase'

const store = new ScorecardStore()
window.store = store

const Quadrant = styled.div`
    position: absolute;
    display: flex;
`

const App = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    @media ${media.optimal}{
        width: 1550px;
        height: 740px;
        margin-top: 80px;
    }
    @media ${media.compact}{
        margin-top: 80px;
        width: 1295px;
        height: 630px;
    }
    @media ${media.mobile}{
        width: 100vw;
    }
`
const Row = styled.div`
    width: 100%;
    display: flex;
    position: relative;
    align-items: center;
`
const TopRow = styled(Row)`
    position: relative;
    align-items: center;
    justify-content: space-between;
    @media ${media.optimal}{
        height: 185px;
        margin-top: 10px;
    } 
    @media ${media.compact}{
        height: 150px;
    }
`

const ShareSources = styled.div`
    

`

const Nav = styled(Row)`
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: var(--offwhitebg);
    @media ${media.optimal}{
        height: 85px;
        padding: 0 calc(50% - 750px);
    }
    @media ${media.compact}{
        height: 75px;
        padding: 0 calc(50% - 750px);
    }
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`

const GreyMask = styled.div`
    position: fixed;
    left: 0;
    top: 75px;
    width: 100%;
    height: 100%;
    transform-origin: 50% 0%;
    transition: transform ${props=>props.show? .5 :0.5}s;
    transform: scaleY(${props=>props.show?1 : 0});
    background: var(--offwhitebg);
    z-index: 2;
`

@observer
export default class ResponsiveScorecard extends React.Component{
    @observable init = true
    @action closeSplash = () => {
        this.init = false
        this.openNav('indicator')
    }
    @observable navOpen = false

    @observable hoveredCounty = null
    @observable breakdownOffset = 0
        @action setBreakdownOffset = (val) => this.breakdownOffset = val

    @observable extraReadoutLines = ''

    @action openNav = (status) => {
        console.log('nav', status)
        if(this.sourcesMode && status){
            this.setSourcesMode(false)
        }
        if(this.init && status){
            console.log('user opened nav while init')
            this.init = false
        }
        if(!store.indicator && this.navOpen === 'indicator' && !status){
            this.init = true
            store.completeWorkflow('county',null)
            store.completeWorkflow('race',null)
            this.navOpen = false
        }
        else if(!status && !store.indicator){
            this.navOpen = 'indicator'
        }
        else this.navOpen = status
    }
    @action onHoverCounty = (id) => {
        if(id) this.hoveredCounty = camelLower(id)
        else this.hoveredCounty = null
    }

    @observable sourcesMode = false
    @action setSourcesMode = (tf) => this.sourcesMode = tf

    componentDidMount(){
        store.setIndicatorPages()
    }

    render(){
        const {indicator, year, race} = store
        const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
        }): ''
        return(
            <React.Fragment>
            <Styles />
            <App>
                <Nav> 
                    <NavComponent 
                        init = {this.init}
                        store = {store}
                        open = {this.navOpen}
                        openNav = {this.openNav}
                        closeSplash = {this.closeSplash}
                    /> 
                </Nav>
                <GreyMask 
                    show = {this.navOpen}
                    onClick = {()=>this.navOpen? ()=>this.openNav(false): ()=>{console.log('clicked grey mask')}}

                />
                <TopRow>
                    <ReadoutComponent store = {store} setBreakdownOffset = {this.setBreakdownOffset}/> 
                    <ShareSources>
                        <Button label = "View sources and notes" />
                        <Button label = "Share / download" style = {{marginLeft: '15px'}}/>

                    </ShareSources>
                </TopRow>

                <BottomRow>
                    <DemoBox
                        id = "demobox"
                        show = {!this.sourcesMode && !this.init}
                        store = {store}
                    />

                    {this.init &&
                       <InitBox closeSplash = {this.closeSplash}/>
                    }
                    <Breakdown
                        sources = {this.sourcesMode}
                    > 
                        <BreakdownComponent 
                            offset = {this.breakdownOffset} 
                            store = {store} 
                            sources = {this.sourcesMode}
                        /> 
                    </Breakdown>

                    <MapContainer 
                        offset = {this.init || this.navOpen || this.sourcesMode} 
                        // init = {this.init}
                    >
                        <MapComponent 
                            store = {store}
                            onHoverCounty = {this.onHoverCounty}
                            hoveredCounty = {this.hoveredCounty}
                            onSelect = {store.completeWorkflow}
                            selected = {store.county}
                            data = {dataForMap}
                            mode = {this.navOpen? 'offset' : dataForMap?'heat':''}
                            clickedOutside = {this.navOpen? ()=>this.openNav(false): ()=>{}}
                            // mode = 'wire'
                        />
                    </MapContainer>

                    <LegendContainer>
                        <LegendComponent 
                            store = {store}
                        />
                    </LegendContainer>
                </BottomRow>

            </App>

            </React.Fragment>
        )
    }
}

const BottomRow = styled(Row)`
    height: 100%;
    margin-top: 25px;
`

const MapContainer = styled(Quadrant)`
    z-index: 2;
    transform-origin: 0% 100%;
    transition: transform .5s;
    position: absolute;

    @media ${media.optimal}{
        left: 675px;
        width: 525px;
        height: 100%;
        transform: translateX(${props => props.offset? '40%' : 0});
    }
    @media ${media.compact}{
        left: 510px;
        width: 450px; 
        height: 100%;
        transform: translateX(${props => props.offset? '280px' : 0});
    }
    @media ${media.mobile}{}
`
const Breakdown = styled(Quadrant)`
    top: 0; left: 0;
    height: 100%;
    @media ${media.optimal}{
        width: 610px;
    }
    @media ${media.compact}{
        width: 480px;
    }
    @media ${media.mobile}{}
    z-index: ${props=>props.sources? 20 : 1}; 
`
const LegendContainer = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 300px; 
    height: 80px;

`
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {mapValues, find} from 'lodash'

import ScorecardStore from './ScorecardStore'
import NavComponent, {PickingWorkflow} from './ResponsiveNav'
import ReadoutComponent from './components/Readout'
import BreakdownComponent from './components/Breakdown'
import LegendComponent from './components/Legend'
import MapComponent from './components/core/InteractiveMap'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'

import media from './utilities/media'


const store = new ScorecardStore()
window.store = store

const Quadrant = styled.div`
    position: absolute;
    display: flex;
    // border: 1px solid grey;
`

const App = styled.div`
    position: relative;
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
    position: relative;
    height: 70px;
    margin-top: 100px;
    flex-grow: 1;
`
const BottomRow = styled(Row)`
    flex-grow: 6;
`
const Nav = styled(Row)`
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background: var(--offwhitebg);
    height: 75px;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`

const Readout = styled(Quadrant)`
    @media ${media.optimal}{

    }
    @media ${media.compact}{
        width: calc(100% - 460px);
        height: 80px;
    }
    @media ${media.mobile}{}
`
const Breakdown = styled(Quadrant)`
    bottom: 0; left: 0;
    @media ${media.optimal}{}
    @media ${media.compact}{
        width: 40%;
        height: 70%;
    }
    @media ${media.mobile}{}
`
const Legend = styled(Quadrant)`
    @media ${media.optimal}{}
    @media ${media.compact}{
        border: 1px solid black;
        width: 481px;
        height: 80px;
        right: 0;
        top: 0;
        padding-right: 30px;
        flex-shrink: 0;
    }
    @media ${media.mobile}{}
`
const MapContainer = styled(Quadrant)`
    right: 0;
    bottom: 0;
    z-index: 2;
    transform-origin: 0% 100%;
    transition: transform .5s;
    @media ${media.optimal}{}
    @media ${media.compact}{
        width: 60%; height: 70%;
        transform: translateX(${props => props.offset? '280px' : 0}) scale(${props=>props.offset?1.13:1});
    }
    @media ${media.mobile}{}
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
    z-index: 1;
`


@observer
export default class ResponsiveScorecard extends React.Component{
    @observable navOpen = false
    @action openNav = (val) => this.navOpen = val

    render(){
        const {indicator, year, race} = store
        const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
        }): ''
        return(
            <App>
                <Nav> 
                    <NavComponent 
                        store = {store}
                        open = {this.navOpen}
                        openNav = {this.openNav}
                    /> 
                </Nav>
                <GreyMask show = {this.navOpen}/>
                <TopRow>
                    <Readout> <ReadoutComponent store = {store}/> </Readout>
                    <Legend />
                </TopRow>
                <BottomRow>
                    <Breakdown> <BreakdownComponent store = {store} /> </Breakdown>
                    <MapContainer offset = {this.navOpen}>
                        <MapComponent 
                            store = {store}
                            getDataBoxDims = {this.getDataBoxDims}
                            onHoverCounty = {this.onHoverCounty}
                            hoveredCounty = {this.hoveredCounty}
                            onSelect = {store.completeWorkflow}
                            selected = {store.county}
                            data = {dataForMap}
                            mode = {this.navOpen? 'offset' : dataForMap?'heat':''}
                            // mode = 'wire'
                        />
                    </MapContainer>
                </BottomRow>
            </App>
        )
    }
}
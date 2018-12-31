import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {mapValues} from 'lodash'
import IntersectionObserver from '@researchgate/react-intersection-observer'
import 'intersection-observer'

import indicators from './data/indicators'

import Icon, {Sprite} from './components/generic/Icon'
import ExpandBox from './components/ExpandBox'
import Styles from './components/Styles'

import MobileNav from './MobileNav'
import IndicatorByCounties from '../src/components/IndicatorByCounties'
import IndicatorByRaces from '../src/components/IndicatorByRaces'
import Readout from '../src/components/Readout'
import ZoomableMap from '../src/components/ZoomableMap'
import DemoBox from '../src/components/DemoBox'

const width = window.innerWidth - 50

@observer
export default class MobileScorecard extends React.Component{

    @observable navOpen = false
    @observable showShorthand = false
    @action toggleHeaderInfo = (tf) => {
        this.showShorthand = tf
    }
    @action setNavStatus = (tf) => {
        this.navOpen = tf
        // if(!tf){
        //     window.addEventListener('scroll', this.noscroll)
        // }
        // else window.removeEventListener('scroll', this.noscroll)
    }
    noscroll = () => {
        window.scrollTo(0,0)
    }

    @observable currentSection = 'breakdown'
    @action goToSection = (sec) => this.currentSection = sec

    render(){
        const {store} = this.props
        const {indicator} = store
        return(
            <div>
                <Styles />
                <MobileNav 
                    store = {store}
                    showShorthand = {this.showShorthand}
                    setNavStatus = {this.setNavStatus}
                />

                <Content
                    offsetForNav = {this.navOpen}
                >

                    {indicator && this.currentSection === 'breakdown' &&
                        <Breakdown store = {store} 
                            onScrollPastReadout = {this.toggleHeaderInfo}
                        />
                    }
                    {indicator && this.currentSection === 'demographic' &&
                        <Demographics
                            store = {store}
                        />
                    }
                </Content>
                
                <SectionChooser
                    visible = {!this.navOpen}
                >
                    <BreakdownBtn>
                        <Sprite img = "ind"
                            width = {42} height = {42}
                            state = {this.currentSection === 'breakdown' && indicator && !this.navOpen? 'up' : 'down'}
                            color = {this.currentSection === 'breakdown' && indicator && !this.navOpen? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('breakdown')}
                            duration = {.2}
                        />
                    </BreakdownBtn>
                    <DemoBtn>
                        <Sprite img = "county"
                            width = {44 } height = {44}
                            state = {this.currentSection === 'demographic' && indicator && !this.navOpen? 'up' : 'down'}
                            color = {this.currentSection === 'demographic' && indicator && !this.navOpen? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('demographic')}
                            duration = {.2}
                        />
                    </DemoBtn>
                    <SourcesBtn />
                </SectionChooser>
            </div>
        )
    }
}
const Content = styled.div`
    position: relative;
    top: 0;
    height: 100%;
    width: 100%;
    min-width: 100vw;
    overflow: hidden;
    background: var(--offwhitefg);
    z-index: 1;
    margin-top: 55px;
    padding: 10px 20px 80px 20px;
    margin-bottom: 67px;
    transform: translateY(${props => props.offsetForNav? '150px' : 0});
    transition: transform .45s cubic-bezier(0.215, 0.61, 0.355, 1);
`
const SectionChooser = styled.div`
    padding: 0 10px;
    position: fixed;
    height: 67px;
    border-top: 1px solid var(--fainttext);
    background: white;
    width: 100%;
    bottom: 0;
    z-index: 1;
    display: flex; 
    align-items: center;
    justify-content: space-around;
    transform: translateY(${props => props.visible? 0 : 100}%);
    transition: transform .35s;
`
const SectionBtn = styled.div`
    width: 45px; height: 45px;
    // border: 1px solid black;
`
const BreakdownBtn = styled(SectionBtn)`
    display: flex; align-items: center; justify-content: center;

`
const DemoBtn = styled(SectionBtn)`
    padding-top: 2px;
`
const SourcesBtn = styled(SectionBtn)`
    
`



@observer class Breakdown extends React.Component{
    @observable allCounties = false 
    @action expandCountyList = (tf) => this.allCounties = tf
    render(){
        const store = this.props.store
        const {indicator, race, county, year} = store
        const hasRace = indicators[indicator].categories.includes('hasRace')

        return(
            <React.Fragment>
                <IntersectionObserver
                    onChange = {(wat)=>this.props.onScrollPastReadout(!wat.isIntersecting)}
                    rootMargin = '-75px 0% 0% 0%'
                >
                    <Readout store = {store} />
                </IntersectionObserver>
                <Tables expanded = {this.allCounties} >
                    <IndicatorByCounties
                        entries = {hasRace? 9 : 12}
                        store = {store}
                        hasRace = {hasRace}
                        onExpand = {this.expandCountyList}
                        expand = {this.allCounties}
                        toggleDistribute = {()=>{
                            console.log('toggling distribution...')
                            this.expandCountyList(!this.allCounties?true:false)
                        }}
                        sources = {this.props.sources}
                    />
                    {hasRace && !this.allCounties && 
                        <IndicatorByRaces
                            store = {store}
                            expand = {true}
                            mobile = {true}
                        />
                    }
                </Tables>
            </React.Fragment>
        )
    }
}

const Tables = styled.div`
    position: relative;
    margin-top: 25px;
    width: ${width}px;
    height: ${props=>props.expanded? 1300 : 370}px;
`

@observer class Demographics extends React.Component{

    @observable forceCA = false
    @action demoForceCA = (tf) => this.forceCA = tf 

    render(){
        const {store} = this.props
        const {indicator, race, county, year} = store
        const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
        }): ''

        return(
            <React.Fragment>
                <ReadoutWrapper offset = {!county}>
                    <Readout tiny store = {store} />
                </ReadoutWrapper>
                <MapContainer>
                    <ZoomableMap
                        data = {dataForMap}
                        store = {store}
                        zoomTo = {this.forceCA? '' : county}
                    />
                </MapContainer>
                <DemoBox
                    store = {store}
                    hasCountyOptionality = {county}
                    show
                    onForce = {(val)=>{
                        if(val==='county') this.demoForceCA(false)
                        else this.demoForceCA(true)
                    }}
                    forceCA = {this.forceCA}
                />
            </React.Fragment> 
         )
    }
}
const ReadoutWrapper = styled.div`
    transform: translateY(${props=>props.offset? '15px' : 0});
    transition: transform .35s;
`
const MapContainer = styled.div`
    position: relative;
    margin-top: 10px;
    margin-left: -20px;
    /*left: 0;*/
    height: ${p => window.innerWidth * 1.15}px;
`
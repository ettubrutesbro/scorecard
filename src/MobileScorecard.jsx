import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {mapValues} from 'lodash'
import IntersectionObserver from '@researchgate/react-intersection-observer'
import 'intersection-observer'

import indicators from './data/indicators'
import media from './utilities/media'

import Icon, {Sprite} from './components/generic/Icon'
import {Toggle} from './components/generic'
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
        if(tf){ 
            this.showFAH = false 
            this.allowBodyOverflow(false)
        }
        else this.allowBodyOverflow(true)
    }
    @action allowBodyOverflow = (tf) => {
        document.body.style.overflow = tf? 'auto' : 'hidden'
    }

    @observable currentSection = 'breakdown'
    @observable lastSection = ''
    @action goToSection = (sec) => {
        this.lastSection = this.currentSection
        this.currentSection = sec
    }

    @observable showFAH = false
    @observable fixedXAction = null
    @action setFAH = (tf) => {
        console.log('FAH from body scroll actions: ', tf)
        this.showFAH = tf
        if(tf){ this.fixedXAction = () => {
            this.breakdown.current.expandCountyList(false)
        }}
        else this.fixedXAction = null
    }

    @observable forceCA = false
    @action setForceCA = (tf) => {
        this.forceCA = tf
        console.log('forceCA:',tf)
    }

    constructor(){
        super()
        this.breakdown = React.createRef()
    }

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

                    showFAH = {this.showFAH}
                    fixedXAction = {this.fixedXAction}
                    allowBodyOverflow = {this.allowBodyOverflow}

                    setForceCA = {this.setForceCA}
                />

                <Content
                    offsetForNav = {this.navOpen && this.currentSection === 'breakdown'? 150
                        : this.navOpen && this.currentSection === 'demographic'? 80
                        : 0
                    }
                >

                    {indicator && this.currentSection === 'breakdown' &&
                        <Breakdown 
                            ref = {this.breakdown}
                            store = {store} 
                            onScrollPastReadout = {this.toggleHeaderInfo}
                            toggleFixedX = {this.setFAH}
                            showFAH = {this.showFAH}
                        />
                    }
                    {indicator && this.currentSection === 'demographic' &&
                        <Demographics
                            forceCA = {this.forceCA}
                            setForceCA = {this.setForceCA}
                            store = {store}
                        />
                    }
                </Content>
                
                <SectionChooser
                    visible = {!this.navOpen}
                >
                    <BreakdownBtn>
                        <SecSprite img = "ind"
                            width = {42} height = {42}
                            state = {this.currentSection === 'breakdown'? 'up' : 'down'}
                            color = {this.currentSection === 'breakdown'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('breakdown')}
                            duration = {.2}
                        />
                        <SecAccent
                            active = {this.currentSection === 'breakdown'}
                            origin = {(this.lastSection === 'sources' && this.currentSection === 'breakdown') || (this.lastSection==='breakdown' && this.currentSection==='sources')? '0%'
                            : (this.lastSection === 'breakdown' && this.currentSection === 'demographic') || (this.lastSection==='demographic' && this.currentSection==='breakdown')? '100%'
                            : ''}
                        
                        />
                    </BreakdownBtn>
                    <DemoBtn>
                        <SecSprite img = "county"
                            width = {44 } height = {44}
                            state = {this.currentSection === 'demographic'? 'up' : 'down'}
                            color = {this.currentSection === 'demographic'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('demographic')}
                            duration = {.2}
                        />
                        <SecAccent
                            active = {this.currentSection === 'demographic'}
                            origin = {(this.lastSection === 'breakdown' && this.currentSection === 'demographic') || (this.lastSection==='demographic' && this.currentSection==='breakdown')? '0%'
                            : (this.lastSection === 'demographic' && this.currentSection === 'sources') || (this.lastSection==='sources' && this.currentSection==='demographic')? '100%'
                            : ''}
                        />
                    </DemoBtn>
                    <SourcesBtn>
                        <Bookwrap
                            active = {this.currentSection === 'sources'}
                        >
                        <SecSprite img = "book"
                            width = {41} height = {41}
                            state = {this.currentSection === 'sources'? 'up' : 'down'}
                            color = {this.currentSection === 'sources'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('sources')}
                            duration = {.275}
                            fillMode = 'none'
                        />
                        <UnderSprite img = "underbook"
                            width = {41} height = {41}
                            state = {this.currentSection === 'sources'? 'up' : 'down'}
                            color = {this.currentSection === 'sources'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('sources')}
                            duration = {.2}
                        />
                        </Bookwrap>
                        <SecAccent
                            active = {this.currentSection === 'sources'}
                            origin = {(this.lastSection === 'sources' && this.currentSection === 'demographic') || (this.lastSection==='demographic' && this.currentSection==='sources')? '0%'
                            : (this.lastSection === 'breakdown' && this.currentSection === 'sources') || (this.lastSection==='sources' && this.currentSection==='breakdown')? '100%'
                            : ''}
                        />
                    </SourcesBtn>
                </SectionChooser>
            </div>
        )
    }
}

const SecSprite = styled(Sprite)`
    transition: fill .35s;
`

const Bookwrap = styled.div`
    position: relative;
    margin-top: 6px;
    width: 41px;
    height: 41px;
    transform: translateY(${props=>props.active? '-3px' : '0'});
    transition: transform .2s;
`
const UnderSprite = styled(SecSprite)`
    position: absolute;
    top: 0; left: 0;
`
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
    padding: 10px 20px 60px 20px;
    margin-bottom: 67px;
    transform: translateY(${props => props.offsetForNav}px);
    transition: transform .45s cubic-bezier(0.215, 0.61, 0.355, 1);
`
const SectionChooser = styled.div`
    // padding: 0 10px;
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
    position: relative;
    width: 33%; height: 100%;
    // border: 1px solid black;

    :first-of-type{
        padding-left: 10px;
    }
    :last-of-type{
        padding-right: 10px;
    }

    display: flex; align-items: center; justify-content: center;
`
const BreakdownBtn = styled(SectionBtn)`
`
const DemoBtn = styled(SectionBtn)`
    padding-top: 2px;
`
const SourcesBtn = styled(SectionBtn)`
    
`

const SecAccent = styled.div`
    position: absolute;
    width: 100%;
    height: calc(100% + 1px);
    background: var(--faintpeach);
    top: -1px; left: 0; z-index: -1;
    transform: scaleX(${props => props.active?1:0});
    transform-origin: ${props => props.origin} 50%;
    border-top: 1px solid var(--${props=>props.active? 'strokepeach' : 'bordergrey'});

    transition: transform .25s;
`



@observer class Breakdown extends React.Component{
    @observable allCounties = false 
    @action expandCountyList = (tf) => {
        if(!tf) this.props.toggleFixedX(false)
        this.allCounties = tf
    }
    render(){
        const {store, toggleFixedX, showFAH} = this.props
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

                        toggleFixedX = {this.allCounties? toggleFixedX : () => {}}
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

    render(){
        const {store} = this.props
        const {indicator, race, county, year} = store
        const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
        }): ''

        return(
            <React.Fragment>
                <ReadoutWrapper>
                    <Readout tiny 
                        store = {store} 
                        forceCA = {this.props.forceCA}
                    />
                    <DemoToggleWrap
                        currentMode = {county? 'show' : 'hide'}
                        modes = {{
                            hide: {width: 5, height: 37},
                            show: {width: 120, height: 37}
                        }}
                        borderColor = 'transparent'
                    >
                        <Toggle 
                            options = {[
                                {label: 'County', value: 'county'},
                                {label: 'CA', value: 'ca'}
                            ]}
                            onClick = {(val)=>{
                                if(val === 'ca') this.props.setForceCA(true)
                                else this.props.setForceCA(false)
                            }}
                            selected = {this.props.forceCA?1:0}
                        />
                    </DemoToggleWrap>
                </ReadoutWrapper>
                <MapContainer
                    zoomedOutOffset = {(county && this.props.forceCA )||!county}
                >
                    <ZoomableMap
                        data = {dataForMap}
                        store = {store}
                        zoomTo = {this.props.forceCA? '' : county}
                        unforceCA = {()=>{
                            if(this.props.forceCA) this.props.setForceCA(false)
                        }}
                    />
                </MapContainer>
                <DemoWrap
                    zoomedOutOffset = {(county && this.props.forceCA )||!county}
                >
                <DemoBox
                    store = {store}
                    hasCountyOptionality = {county}
                    show
                    onForce = {(val)=>{
                        if(val==='county') this.props.setForceCA(false)
                        else this.props.setForceCA(true)
                    }}
                    forceCA = {this.props.forceCA}
                />
                </DemoWrap>
            </React.Fragment> 
         )
    }
}
const ReadoutWrapper = styled.div`
    position: relative;
    margin-top: 5px;
    z-index: 3;
    height: 105px; display: flex;
    align-items: center;
`
const MapContainer = styled.div`
    position: relative;
    margin-top: 15px;
    margin-left: -20px;
    /*left: 0;*/
    height: ${p => window.innerWidth * 1.15}px;
    transform: translateY(${props=>props.zoomedOutOffset?0:40}px);
    transition: transform .5s cubic-bezier(0.215, 0.61, 0.355, 1);
    z-index: 2;
`
const DemoWrap = styled.div`
    position: relative;
    z-index: 3;
    margin-top: 25px;
    transform: translateY(${props=>props.zoomedOutOffset?0:-(window.innerWidth * .75)/2.75}px);
    transition: transform .5s cubic-bezier(0.215, 0.61, 0.355, 1);
`
const DemoToggleWrap = styled(ExpandBox)`
    position: absolute;
    bottom: -35px; right: 140px;
    transform: translateX(${props=>props.currentMode==='hide'? '150px' : 0});
    @media ${media.smallphone}{
        right:120px;
        transform: translateX(${props=>props.currentMode==='hide'? '130px' : 0});
    }    
    opacity: ${props => props.currentMode==='hide'?0:1};
    transition: opacity .1s ${props=>props.currentMode==='hide'?'.25s':'0s'}, transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    &::before{
        content: '';
        position: absolute;
        width: 150px;
        top: 18px;
        left: -15px;
        height: 8px;
        background: var(--offwhitefg);
    }
`
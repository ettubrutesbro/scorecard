import React from 'react'
import {findDOMNode} from 'react-dom'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {mapValues} from 'lodash'
import IntersectionObserver from '@researchgate/react-intersection-observer'
import 'intersection-observer'
import FlipMove from 'react-flip-move'

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
import {MobileSources} from '../src/components/Sources'
import InitBox from '../src/components/InitBox'


@observer
export default class MobileScorecard extends React.Component{

    @observable navOpen = false
    @observable showShorthand = false

    @observable init = true
    @action setInit = (tf) => this.init = tf

    @action toggleHeaderInfo = (tf) => {
        console.log('toggling sharthand')
        this.showShorthand = tf
    }
    @action setNavStatus = (tf) => {
        this.navOpen = tf
        if(tf){ 
            this.setFAH(false) 
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
        console.log(this.currentSection, this.lastSection)
        if(sec === 'demographic' || sec === 'sources'){
            this.setFAH(false)
            if(sec==='sources') this.showShorthand = true
        }
        this[sec+'Section'].current.scrollTop = 0
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

    @observable init = true
    @action setInit = (tf) => {
        this.init = tf
    }

    constructor(){
        super()
        this.breakdown = React.createRef()
        this.breakdownSection = React.createRef()
        this.sourcesSection = React.createRef()
        this.demographicSection = React.createRef()
    }

    componentWillMount(){
        if(this.props.store.indicator) this.setInit(false)
    }

    render(){
        const {store} = this.props
        const {indicator} = store

        const current = this.currentSection
        const last = this.lastSection
        return(
            <div>
                <Styles />
                <MobileNav 
                    hide = {this.init}
                    store = {store}
                    showShorthand = {this.showShorthand}
                    setNavStatus = {this.setNavStatus}

                    showFAH = {this.showFAH}
                    fixedXAction = {this.fixedXAction}
                    allowBodyOverflow = {this.allowBodyOverflow}

                    setForceCA = {this.setForceCA}
                    init = {this.init}
                />
                <Content
                    offsetForNav = {this.navOpen && current === 'breakdown'? 150
                        : this.navOpen && current === 'demographic'? 80
                        : 0
                    }
                    hide = {!indicator}
                >
                    <FlipMove
                        typeName = {null}
                        enterAnimation = {{
                            from: {opacity: 0, transform: 'translateY(-70px)'},
                            to: {opacity: 1, transform: 'translateY(0)'}
                        }}
                        leaveAnimation = {{
                            from: {opacity: 1, transform: 'translateY(0px)'},
                            to: {opacity: 0, transform: 'translateY(70px)'}
                        }}
                    >
                    {this.init && 
                        <InitBox 
                            store = {store} 
                            closeSplash = {()=>this.setInit(false)}
                        />
                    }
                    </FlipMove>
                    {indicator && 
                        <React.Fragment>
                        <Section
                            ref = {this.breakdownSection}
                            active = {current === 'breakdown'}
                            isLast = {last === 'breakdown'}
                            origin = {-100}
                        >
                            <Breakdown 
                                ref = {this.breakdown}
                                store = {store} 
                                onScrollPastReadout = {current === 'breakdown'? this.toggleHeaderInfo : ()=>{}}
                                toggleFixedX = {this.setFAH}
                                showFAH = {this.showFAH}
                                isActive = {current === 'breakdown'}
                            />
                        </Section>

                        <Section
                            ref = {this.demographicSection}
                            active = {current === 'demographic'}
                            isLast = {last === 'demographic'}
                            origin = {last === 'sources' && current === 'demographic'? -100
                                : last === 'breakdown' && current === 'demographic'? 100
                                : last === 'demographic' && current === 'breakdown'? 100
                                : last === 'demographic' && current === 'sources'? -100
                                : current === 'sources' && last === 'breakdown'? -100
                                : 100
                            }
                        >
                        <Demographics
                            forceCA = {this.forceCA}
                            setForceCA = {this.setForceCA}
                            store = {store}

                            onScrollPastReadout = {current === 'demographic'? this.toggleHeaderInfo : ()=>{}}
                        />
                        </Section>

                        <Section
                            ref = {this.sourcesSection}
                            active = {current === 'sources'}
                            isLast = {last==='sources'}
                            origin = {100}
                        >
                            <SourceNoteTitle>
                                Sources & notes
                            </SourceNoteTitle>
                            <MobileSources
                                expand
                                indicator = {indicator}
                            />
                        </Section>
                        </React.Fragment>


                    }
                </Content>
                
                <SectionChooser
                    visible = {!this.navOpen && indicator}
                >
                    <BreakdownBtn>
                        <SecSprite img = "ind"
                            width = {42} height = {42}
                            state = {current === 'breakdown'? 'up' : 'down'}
                            color = {current === 'breakdown'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('breakdown')}
                            duration = {.2}
                        />
                        <SecAccent
                            active = {current === 'breakdown'}
                            origin = {(last === 'sources' && current === 'breakdown') || (last==='breakdown' && current==='sources')? '0%'
                            : (last === 'breakdown' && current === 'demographic') || (last==='demographic' && current==='breakdown')? '100%'
                            : ''}
                        
                        />
                    </BreakdownBtn>

                    <DemoBtn>
                        <SecSprite img = "county"
                            width = {44 } height = {44}
                            state = {current === 'demographic'? 'up' : 'down'}
                            color = {current === 'demographic'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('demographic')}
                            duration = {.2}
                        />
                        <SecAccent
                            active = {current === 'demographic'}
                            origin = {(last === 'breakdown' && current === 'demographic') || (last==='demographic' && current==='breakdown')? '0%'
                            : (last === 'demographic' && current === 'sources') || (last==='sources' && current==='demographic')? '100%'
                            : ''}
                        />
                    </DemoBtn>
                    <SourcesBtn>
                        <Bookwrap
                            active = {current === 'sources'}
                        >
                        <SecSprite img = "book"
                            width = {41} height = {41}
                            state = {current === 'sources'? 'up' : 'down'}
                            color = {current === 'sources'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('sources')}
                            duration = {.275}
                            fillMode = 'none'
                        />
                        <UnderSprite img = "underbook"
                            width = {41} height = {41}
                            state = {current === 'sources'? 'up' : 'down'}
                            color = {current === 'sources'? 'strokepeach' : 'fainttext'}
                            onClick = {()=> this.goToSection('sources')}
                            duration = {.2}
                        />
                        </Bookwrap>
                        <SecAccent
                            active = {current === 'sources'}
                            origin = {(last === 'sources' && current === 'demographic') || (last==='demographic' && current==='sources')? '0%'
                            : (last === 'breakdown' && current === 'sources') || (last==='sources' && current==='breakdown')? '100%'
                            : ''}
                        />
                    </SourcesBtn>
                </SectionChooser>
            </div>
        )
    }
}

const Section = styled.section`
    margin-top: 55px;
    margin-bottom: 67px;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0; left: 0;
    padding: 10px 20px 60px 20px;
    transform: translateX(${props=>props.active?0:props.origin}%);
    transition: ${props => props.active||props.isLast? 'transform .5s' : ''};
    overflow-x: hidden;
    overflow-y: scroll;
    // background: var(--offwhitefg);
`
const SourceNoteTitle = styled.h1`
    font-weight: normal; font-size: 18px;
    margin: 12px 0 17px 15px;
`

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
    height: 100vh;
    width: 100%;
    min-width: 100vw;
    overflow: hidden;
    background: ${props => props.hide? 'transparent' : 'var(--offwhitefg)'};
    z-index: 1;
    transform: translateY(${props => props.offsetForNav}px);
    transition: transform .45s cubic-bezier(0.215, 0.61, 0.355, 1);
`

const Spacer = styled.div`
    height: 1000px;
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
        const {store, toggleFixedX, showFAH, isActive} = this.props
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
                <Tables expanded = {this.allCounties} devicewidth = {store.mobileDeviceWidth} >
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

                        toggleFixedX = {this.allCounties && isActive? toggleFixedX : () => {}}
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
    padding-bottom: 15px;
    width: ${props=>props.devicewidth}px;
    height: ${props=>props.expanded? 1600 : 600}px;
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
                    <IntersectionObserver
                        onChange = {(wat)=>this.props.onScrollPastReadout(!wat.isIntersecting)}
                        rootMargin = '-75px 0% 0% 0%'
                    >
                        <Readout tiny 
                            store = {store} 
                            forceCA = {this.props.forceCA}
                        />
                    </IntersectionObserver>
                    <DemoToggleWrap
                        currentMode = {county? 'show' : 'hide'}
                        modes = {{
                            hide: {width: 5, height: 38},
                            show: {width: 120, height: 38}
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
                    devicewidth = {store.mobileDeviceWidth}
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
                    devicewidth = {store.mobileDeviceWidth}
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
    height: ${p => p.devicewidth * 1.15}px;
    transform: translateY(${props=>props.zoomedOutOffset?0:40}px);
    transition: transform .5s ;
    z-index: 2;
`
const DemoWrap = styled.div`
    position: relative;
    z-index: 3;
    margin-top: 25px;
    transform: translateY(${props=>props.zoomedOutOffset?0:-(props.devicewidth * .75)/2.75}px);
    transition: transform .5s ;
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
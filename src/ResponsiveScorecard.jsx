import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import FlipMove from 'react-flip-move'

import {mapValues, find, debounce} from 'lodash'
import ScorecardStore from './ScorecardStore'
import Styles from './components/Styles'

import NavComponent, {PickingWorkflow} from './ResponsiveNav'
import ReadoutComponent from './components/Readout'
import BreakdownComponent from './components/Breakdown'
import LegendComponent from './components/Legend'
import MapComponent from './components/InteractiveMap'
// import DemoDataTable from './components/DemoDataTable'
import RaceBreakdownBar from './components/RaceBreakdownBar'
import InitBox from './components/InitBox'
import {DemoSources} from './components/Sources'
import DemoBox from './components/DemoBox'

import {Button} from './components/generic'

import indicators, {featuredInds} from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'
import countyLabels from './assets/countyLabels'
import pdfmanifest from './assets/pdfmanifest'
import semanticTitles from './assets/semanticTitles'

import media, {getMedia} from './utilities/media'
import {camelLower} from './utilities/toLowerCase'

import cnico from './assets/cnlogo-long.svg'
import maskImg from './assets/mask2.png'

import {capitalize} from './utilities/toLowerCase'

import browserCompatibility from './data/browserCompatibility'



const store = new ScorecardStore()
window.store = store

var flat = require('array.prototype.flat')
var includes = require('array-includes')
var values = require('object.values')
var assert = require('assert')

delete Array.prototype.flat
var shimmedFlat = flat.shim()
delete Array.prototype.includes;
var shimmedIncludes = includes.shim();

if(!Object.values) values.shim()

const Quadrant = styled.div`
    position: absolute;
    display: flex;
`

const App = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    background: var(--offwhitefg);
    margin: auto;
    @media ${media.optimal}{
        height: 960px;
    }
    @media ${media.compact}{
        height: 740px;
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

    @media ${media.optimal}{
        width: 1550px;
    }
    @media ${media.compact}{
        width: 1300px;
    }
`
const DarkBar = styled.div`
    position: absolute;
    width: 100%;
    left: 0;
    background: var(--offwhitebg, black);
    @media ${media.optimal}{
        /*padding: 0 calc(50% - 775px);*/
    }
    @media ${media.compact}{
        /*padding: 0 calc(50% - 650px);*/
    }
`
const Nav = styled(DarkBar)`
    top: 0;
    height: 90px;
    width: auto;
    @media ${media.optimal}{
        height: 90px;
    }
    @media ${media.compact}{
        height: 75px;
    }
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`

const TopRow = styled(Row)`
    position: relative;
    align-items: center;
    justify-content: space-between;
    @media ${media.optimal}{
        margin-top: 110px;
        height: 185px;
    } 
    @media ${media.compact}{
        margin-top: 90px;
        height: 150px;
    }
`

const BottomRow = styled(Row)`
    height: 100%;
    /*margin-top: 25px;*/
    @media ${media.optimal}{
        margin: 32px 0 100px 0;
    }
    @media ${media.compact}{
        margin: 25px 0 50px 0;
    }
`




const GreyMask = styled.div`
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    &::before, &::after{
        content: '';
        position: absolute;
        top: 0;
        transition: transform ${props=>props.show? .45 : .35}s linear;
        @media ${media.optimal}{
            transform: translateX(${props=>props.show?'calc(1550px + 300px)' : 0});
        }
        @media ${media.compact} {
            transform: translateX(${props=>props.show?'calc(1300px + 300px)' : 0});
        }
    }
    &::before{
        right: calc(100% + 300px);
        width: 100%;
        height: 100%;
        background: var(--offwhitefg);
    }
    &::after{
        width: 300px;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        left: -300px;
        background-image: url(${maskImg});

    }
`
const ShareSources = styled.div`
    flex-shrink: 0;
    @media ${media.optimal}{
        /*top: 90px;*/
        /*height: 185px;*/
    } 
    @media ${media.compact}{
        /*top: 75px;*/
        /*height: 150px;*/
    }
`
const pdfIcon = require('./assets/export.svg')
const sourcesIcon = require('./assets/sources.svg')

const Icon = styled.figure`
    position: absolute;
    right: 10px;
    /*outline: 1px solid black;*/
    width: 30px;
    height: 30px;
    background-repeat: no-repeat;
    margin-right: 12px;
    flex-shrink: 0;
    background-size: cover;
`
const BtnLabel = styled.div`
    display: flex;
    align-items: center;
`
const SourcesIcon = styled(Icon)`
    background-image: url(${sourcesIcon});
`
const PDFIcon = styled(Icon)`
    background-image: url(${pdfIcon});
`


const BtnWithRightIco = styled(Button)`
    padding-right: 60px;
    position: relative;
    &:hover{
        figure{
            background-position: 100% 50%;
        }
    }
`
const SourcesButton = styled(Button)`
    padding-right: 60px;
    position: relative;
    ${props => props.dark? `
        figure{
            background-position: 66.6666% 50%;
        }
        &:hover{
            figure{
                background-position: 100% 50%;
            }
        }
    `: `
        figure{
            background-position: 0% 50%;
        }
        &:hover{
            figure{
                background-position: 33.3333% 50%;
            }
        }
    `}
    
`

@observer
export default class ResponsiveScorecard extends React.Component{

    @observable browserBlock = null
    @action blockUserBrowser = (why) => this.browserBlock = why

    @action setInit = (tf) => {
        if(!tf){ 
            this.setRandomIndicatorCycle(false)
        }
        else if(tf) this.setRandomIndicatorCycle(true)
        store.init = tf

    }
    @action closeSplash = () => {
        this.setInit(false)
        this.openNav('indicator')
    }
    @observable navOpen = false

    @observable hoveredCounty = null
    @observable breakdownOffset = 0
        @action setBreakdownOffset = (val) => this.breakdownOffset = val

    @observable extraReadoutLines = ''

    @action reset = () => {
       store.completeWorkflow('race',null)
       store.completeWorkflow('county',null)
       store.completeWorkflow('indicator',null)
       this.openNav('indicator')
    }

    @action openNav = (status) => {
        console.log('nav', status)
        if(store.sourcesMode && status){
            store.setSourcesMode(false)
        }
        if(store.init && status){
            console.log('user opened nav while init')
            this.setInit(false)
        }
        if(!store.indicator && this.navOpen === 'indicator' && !status){
            this.setInit(true)
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
    @observable screen = getMedia()

    componentWillMount(){
        store.setIndicatorPages()
        // window.addEventListener('resize', this.resizeRefresh, false)
        //eventually....
        window.addEventListener('resize', store.resize, false)

        const browserName = store.browser.name
        const ver = store.browser.version
        if(!Object.keys(browserCompatibility).includes(browserName)){
            this.blockUserBrowser('browser')
        }else{
            if(ver >= browserCompatibility[browserName]){
                //it's fine
            }else{
                this.blockUserBrowser('version')
            }
        }
        //query params check

        const urlParams = new URLSearchParams(window.location.search)
        const urlInd = urlParams.get('ind')
        const urlCty = urlParams.get('cty')
        const urlRace = urlParams.get('race')
        const urlYr = urlParams.get('yr')
        if(urlParams.has('ind') && Object.keys(indicators).includes(urlInd)){
            console.log('url has valid indicator')
            this.setInit(false)
            store.completeWorkflow('indicator', urlInd)

            //we only care if theres cty/race if the url contains ind
            if(urlParams.has('cty')){
                if(Object.keys(countyLabels).includes(urlCty)){
                    store.completeWorkflow('county', urlCty)
                }
             }
            if(urlParams.has('race')){
                const races = ['asian','black','latinx','white','other']
                if(races.includes(urlRace)){
                    store.completeWorkflow('race', urlRace)
                }
            } 
            if(urlParams.has('yr')){
                if(indicators[store.indicator].years[urlYr]){
                    console.log(urlYr)
                    store.completeWorkflow('year',urlYr)
                }
            }
        }else{
            this.setRandomIndicatorCycle(true)   
        }

        



        
    }


    // @observable randInd = 0 
    @observable alreadyDisplayedRandomIndicators = []
    @action foistRandomIndicator = () => {
        let availableInds
        if(this.alreadyDisplayedRandomIndicators.length === featuredInds.length){
            availableInds = featuredInds
            this.alreadyDisplayedRandomIndicators = []
        } 
        else{
            availableInds = featuredInds.filter((ind)=>{
                return !this.alreadyDisplayedRandomIndicators.includes(ind)
            })
        }
        const randomIndex = Math.floor(Math.random() * availableInds.length)
        console.log(availableInds)
        const choice= availableInds[randomIndex]
        console.log(choice)

        store.completeWorkflow('indicator', choice)
        this.alreadyDisplayedRandomIndicators.push(choice)
    }
    setRandomIndicatorCycle = (tf) => {
        if(tf){
            console.log('starting interval for rand ')
            //set the first one too
            this.foistRandomIndicator()
            this.randomIndicatorInterval = setInterval(this.foistRandomIndicator, 5000)
        }
        else{ 
            console.log('clearing rand interval')
            store.completeWorkflow('indicator',null)
            clearInterval(this.randomIndicatorInterval)
        }
    }

    render(){
        const {indicator, year, race, screen} = store
        const dataForMap = indicator? mapValues(indicators[indicator].counties, (county)=>{
            return county[race||'totals'][year]
        }): ''
        return this.browserBlock? (<BrowserBlocker store = {store} why = {this.browserBlock}/>) : store.screen==='mobile'? (<MobileBlocker/>): (
            <React.Fragment>
            <Styles />
            <App>
                <Nav> 
                    <NavComponent 
                        init = {store.init}
                        store = {store}
                        open = {this.navOpen}
                        openNav = {this.openNav}
                        closeSplash = {this.closeSplash}
                        reset = {this.reset}
                    /> 
                </Nav>

                <TopRow>
                    <ReadoutComponent store = {store} setBreakdownOffset = {this.setBreakdownOffset} /> 
                    {store.indicator &&
                    <ShareSources>
                        <SourcesButton
                            dark = {store.sourcesMode} 
                            label = {store.sourcesMode? 
                               <BtnLabel>Hide sources and notes<SourcesIcon /></BtnLabel>
                                : <BtnLabel>View sources and notes<SourcesIcon /></BtnLabel>
                            }
                            className = {['default', store.sourcesMode? 'negative' : ''].join(' ')}
                            onClick = {()=>{store.setSourcesMode(!store.sourcesMode)}}
                        />
                        <BtnWithRightIco 
                            label = {<BtnLabel>Download PDF<PDFIcon /></BtnLabel>} 
                            style = {{marginLeft: '15px'}}
                            className = {'default'}
                            onClick = {()=>{
                                if(pdfmanifest[store.county||'california']){
                                    window.location.assign(pdfmanifest[store.county||'california'])
                                }
                                else alert(`Sorry -- PDF for ${countyLabels[store.county]} county coming soon.`)
                                
                            } }
                        />
                    </ShareSources>
                    }
                </TopRow>

                <BottomRow>
                    <DemoBox
                        id = "demobox"
                        // show = {!store.sourcesMode && !store.init}
                        show = {!store.init}
                        store = {store}
                        sources = {store.sourcesMode}
                    />
                 
                   <InitBox 
                        store = {store}
                        show = {store.init}
                        closeSplash = {this.closeSplash}
                    />
                    
                    <Breakdown
                        sources = {store.sourcesMode}
                    > 
                        {store.indicator &&
                        <BreakdownComponent 
                            offset = {this.breakdownOffset} 
                            store = {store} 
                            sources = {store.sourcesMode}
                        /> 
                        }
                    </Breakdown>

                    <MapContainer 
                        offset = {store.init || this.navOpen} 
                        // init = {store.init}
                    >
                        <MapComponent 
                            store = {store}
                            onHoverCounty = {(val) => store.setHover('county', val)}
                            hoveredCounty = {store.hoveredCounty}
                            onSelect = {store.completeWorkflow}
                            selected = {store.county}
                            defaultHighlight = {indicator? indicators[indicator].highlight : ''}
                            data = {dataForMap}
                            mode = {store.init? 'init' : this.navOpen? 'offset' : dataForMap?'heat':''}
                            clickedOutside = {this.navOpen? ()=>this.openNav(false): ()=>{}}
                            // mode = 'wire'
                        />
                        <RandomIndicatorLabel show = {store.init}>
                            {indicator&& semanticTitles[indicator].shorthand} 
                            {!store.init && !indicator&& this.alreadyDisplayedRandomIndicators.length>0&& semanticTitles[this.alreadyDisplayedRandomIndicators[this.alreadyDisplayedRandomIndicators.length-1]].shorthand} 
                            <SubRandLabel show = {store.init}>
                                {!race && 'All races'}, {indicator && indicators[indicator].years[year]}{!indicator && '2018'}
                            </SubRandLabel>

                        </RandomIndicatorLabel>
                        
                    </MapContainer>

                    <LegendContainer>
                        <LegendComponent 
                            store = {store}
                        />
                    </LegendContainer>
                </BottomRow>
                <GreyMask 
                    className = 'greymask'
                    show = {this.navOpen || store.init}
                    onClick = {()=>this.navOpen? ()=>this.openNav(false): ()=>{console.log('clicked grey mask')}}
                />
                
            </App>
            <Footer>
                    <FeedbackLink href = "mailto:research@childrennow.org?subject=Scorecard%20Feedback">
                    <Feedback
                        // onClick = {()=>{
                        //     window.location.href = "mailto:research@childrennow.org?subject=Scorecard%20Feedback";
                        // }}
                    >

                        <FeedbackIcon/> Provide feedback 
                    </Feedback>
                    </FeedbackLink>
                    <FooterContent>
                        <FooterLink href = 'https://www.childrennow.org/about-us/'>About us</FooterLink>
                        <FooterLink href = 'https://www.childrennow.org/about-us/contact/'>Contact</FooterLink>
                        <FooterLink href = 'https://www.childrennow.org/reports-research/scorecard/'>Credits & Acknowledgments</FooterLink>
                        <a href = "https://www.childrennow.org"><CNLogo /></a>
                    </FooterContent>
                </Footer>
            </React.Fragment>
        )
    }
}


const MapContainer = styled(Quadrant)`
    z-index: 2;
    transform-origin: 0% 100%;
    transition: transform .5s;
    position: absolute;

    @media ${media.optimal}{
        left: 666px;
        width: 530px;
        height: 100%;
        transform: translateX(${props => props.offset? '350px' : 0});
        transform: ${props => props.offset? 'translateX(350px)' : 'translateX(0) scale(1)'};
    }
    @media ${media.compact}{
        left: 520px;
        width: 430px; 
        height: 100%;
        transform: translateX(${props => props.offset? '320px' : 0});
    }
    @media ${media.mobile}{}
`
const RandomIndicatorLabel = styled.div`
    font-size: 13px;
    white-space: nowrap;
    text-align: right;

    position: absolute;

    transform: translateX(${props => props.show? '0px' : '50px'});
    opacity: ${props => props.show? 1: 0};
    transition: opacity .35s, transform .35s;


    @media ${media.optimal}{
        bottom: 20px; 
        right: 290px;
    } 
    @media ${media.compact}{
        bottom: 20px; 
        right: 290px;
    }

    color: var(--normtext);
`
const SubRandLabel = styled.div`
    margin-top: 3px;
    color: var(--fainttext);
    margin-right: -25px;

    transition: transform .35s;
    transform: translateX(${props => props.show? '0px' : '20px'});
`
const Breakdown = styled(Quadrant)`
    position: relative;
    top: 0; left: 0;
    height: 100%;
    @media ${media.optimal}{
        width: 610px;
    }
    @media ${media.compact}{
        width: 480px;
    }
    @media ${media.mobile}{}
    z-index: 1; 
`
const LegendContainer = styled.div`
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: 0;
    width: 300px; 
    /*height: 80px;*/
    @media ${media.optimal}{
        height: 80px;
    }
    @media ${media.compact}{
        height: 64px;
    }

`

const Footer = styled(DarkBar)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media ${media.optimal}{
        padding: 0 calc((100vw - 1550px) / 2);
        top: 960px;
    }
    @media ${media.compact}{
        padding: 0 calc((100vw - 1300px) / 2);
        top: 740px;
    }
    z-index: 3;
`
const CNLogo = styled.div`
    width: 175px; height: 21px;
    /*border: 1px solid white;*/
    background-image: url(${cnico});
    background-size: cover;
    background-repeat: none;

`
const FooterContent = styled.div`
    @media ${media.optimal}{
        width: 1550px;
    }
    @media ${media.compact}{
        width: 1295px;
    }
    display: flex;
    height: 75px;
    align-items: center;
    justify-content: flex-end;
`
const FooterLink = styled.a`
    color: white;
    margin-right: 70px;
    text-decoration: none;
    &:hover{
        color: var(--peach, orange);
    }
`

export const MobileBlocker = (props) => {
    return(
        <BlockUser>
            <Notif>
                Sorry, this application doesn't support your screen resolution and/or mobile devices yet. Check back soon!
                <MobileBlockActions>
                    <Button 
                        style = {{marginLeft: '15px'}} 
                        label = "Back to Children Now" 
                        className = 'negative' 
                        onClick = {()=>{
                            window.open('https://childrennow.org')
                        }}
                    />
                </MobileBlockActions>
            </Notif>
        </BlockUser>
    )
}

export const BrowserBlocker = (props) => {
    const {store} = props
    return(
        <BlockUser>
            <Notif>
                {props.why === 'version' &&
                    `Sorry, this application doesn't support your version (${store.browser.version}) of ${store.browser.name === 'ie'? 'Internet Explorer' : capitalize(store.browser.name)}. Please upgrade to version ${browserCompatibility[store.browser.name]} or greater.`
                }
                {props.why === 'browser' &&
                    `Sorry, this application doesn't support ${store.browser.name === 'ie'? 'Internet Explorer' : 'your browser'} - please visit us using a recent version of Google Chrome, Mozilla Firefox, or Safari!`
                }
                <MobileBlockActions>
                    <Button 
                        style = {{marginLeft: '15px'}} 
                        label = "Back to Children Now" 
                        className = 'negative' 
                        onClick = {()=>{
                            window.open('https://childrennow.org')
                        }}
                    />
                </MobileBlockActions>
            </Notif>
        </BlockUser>
    )
}

const MobileBlockActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
`

const BlockUser = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%; 
    /*background: lightgrey;*/
    background: #f3f3f5;
    background: var(--offwhitefg);
    padding: 20px;
    top: 0;
    left: 0;
    line-height: 160%;
`
const Notif = styled.div`
    background: white;
    color: var(--normtext, black);
    border: 1px solid grey;
    border: 1px solid var(--bordergrey);
    padding: 25px;
    max-width: 540px;

`
const feedbackico = require('./assets/feedback.svg')
const FeedbackIcon = styled.figure`
    width: 36px; height: 36px;
    background-image: url(${feedbackico});
    background-size: cover;
    margin-right: 10px;
`
const Feedback = styled.div`
    display: flex;
    text-decoration: none;
    align-items: center;
    color: var(--bordergrey);
    white-space: nowrap;
    cursor: pointer;
    &:hover{
        color: var(--peach);
        figure{
            background-position: 100% center;
        }
    }
`
const FeedbackLink = styled.a`
    text-decoration: none;
`
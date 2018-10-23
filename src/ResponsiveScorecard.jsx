import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {mapValues, find, debounce} from 'lodash'


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
import {DemoSources} from './components/Sources'
import DemoBox from './components/DemoBox'

import {Button} from './components/generic'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'
import countyLabels from './assets/countyLabels'
import pdfmanifest from './assets/pdfmanifest'

import media, {getMedia} from './utilities/media'
import {camelLower} from './utilities/toLowerCase'

import cnico from './assets/cnlogo-long.svg'
import maskImg from './assets/mask.png'

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
        margin-top: 95px;
        justify-content: flex
    }
    @media ${media.compact}{
        margin-top: 80px;
        width: 1300px;
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
    } 
    @media ${media.compact}{
        height: 150px;
    }
`

const ShareSources = styled.div`
    

`
const DarkBar = styled.div`
    position: fixed;
    width: 100%;
    left: 0;
    background: var(--offwhitebg);
    @media ${media.optimal}{
        padding: 0 calc(50% - 775px);
    }
    @media ${media.compact}{
        padding: 0 calc(50% - 650px);
    }
`

const Nav = styled(DarkBar)`
    top: 0;
    height: 90px;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
`

const GreyMask = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-origin: 0% 0%;
    transition: transform .75s;
    transform: translateX(${props=>props.show?0 : 'calc(-100% - 400px)'});
    // transform: scaleX(${props=>props.show?1 : 0});
    background: var(--offwhitefg);
    z-index: 2;
    &::after{
        content: '';
        position: absolute;
        top: 0;
        width: 400px;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        right: -400px;
        background-image: url(${maskImg});
    }
`
const SourcesButton = styled(Button)`
    width: 238px;
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

    @action reset = () => {
       store.completeWorkflow('race',null)
       store.completeWorkflow('county',null)
       store.completeWorkflow('indicator',null)
       this.openNav('indicator')
    }

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
    @observable screen = getMedia()
    @observable sourcesMode = false
    @action setSourcesMode = (tf) => this.sourcesMode = tf

    resizeRefresh = debounce(() => {
        console.log('at the end of resize, new screen size was: ')
        console.log(getMedia())
        if(this.screen !== getMedia()){
            window.location.reload()
        }
    }, 250)

    componentDidMount(){
        store.setIndicatorPages()
        window.addEventListener('resize', this.resizeRefresh, false)
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
                        reset = {this.reset}
                    /> 
                </Nav>
                <GreyMask 
                    show = {this.navOpen || this.init}
                    onClick = {()=>this.navOpen? ()=>this.openNav(false): ()=>{console.log('clicked grey mask')}}

                />
                <TopRow>
                    <ReadoutComponent store = {store} setBreakdownOffset = {this.setBreakdownOffset} /> 
                    {store.indicator &&
                    <ShareSources>
                        <SourcesButton 
                            label = {this.sourcesMode? "Hide sources and notes" : "View sources and notes"}
                            className = {this.sourcesMode? 'negative' : 'default' }
                            onClick = {()=>{this.setSourcesMode(!this.sourcesMode)}}
                        />
                        <Button label = "Download PDF" style = {{marginLeft: '15px'}}
                            onClick = {()=>{
                                if(pdfmanifest[store.county||'california']){
                                    window.open(pdfmanifest[store.county||'california'])
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
                        // show = {!this.sourcesMode && !this.init}
                        show = {!this.init}
                        store = {store}
                        sources = {this.sourcesMode}
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
                        offset = {this.init || this.navOpen} 
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

                <Footer>
                    <FooterContent>
                        <FooterLink href = 'https://www.childrennow.org/about-us/'>About us</FooterLink>
                        <FooterLink href = 'https://www.childrennow.org/about-us/contact/'>Contact</FooterLink>
                        <FooterLink href = 'https://www.childrennow.org/reports-research/scorecard/'>Credits & Acknowledgments</FooterLink>
                        <a href = "https://www.childrennow.org"><CNLogo /></a>
                    </FooterContent>
                </Footer>
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
        transform: translateX(${props => props.offset? '350px' : 0});
        transform: ${props => props.offset? 'translateX(350px)' : 'translateX(0) scale(1)'};
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
    z-index: 1;
    bottom: 0;
    right: 0;
    width: 300px; 
    height: 80px;

`

const Footer = styled(DarkBar)`
    
    @media ${media.optimal}{
        bottom: 0;
    }
    @media ${media.compact}{
        bottom: 0;
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
        color: var(--peach);
    }
`
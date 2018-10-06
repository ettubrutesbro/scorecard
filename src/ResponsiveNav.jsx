import React from 'react'
import styled, {css} from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex, find } from 'lodash'
import {findDOMNode} from 'react-dom'
import FlipMove from 'react-flip-move'

import Toggle from './components/Toggle'

import indicators from './data/indicators'
import { counties } from './assets/counties'
import countyLabels from './assets/countyLabels'
import semanticTitles from './assets/semanticTitles'

import CountyList from './components/CountyList'
import IndicatorList from './components/IndicatorList'
import {Tooltip} from './components/generic'

import media, {getMedia} from './utilities/media'
import {capitalize} from './utilities/toLowerCase'

import caret from './assets/caret.svg'


const Nav = styled.div`
    z-index: 3;
    display: flex;
    align-items: center;
    position: relative;
    @media ${media.optimal}{
        width: 1600px;
    }
    @media ${media.compact}{
        width: 1280px;
    }
`
const Dropdown = styled.div`
    position: relative;
    padding: 10px 45px 10px 20px;
    background: ${props => props.disabled? 'var(--offwhitebg)' : 'white'};
    color: ${props => props.disabled? 'var(--fainttext)' : 'black'};
    display: flex;
    align-items: center;
    outline: 1px solid var(--bordergrey);
    &::after{
        content: '';
        right: 15px;
        width: 13px;
        height: 6px;
        background-image: url(${caret});
        background-size: contain;
        background-repeat: no-repeat;   
        position: absolute;
    }
    transition: transform .25s;
    white-space: nowrap;


`  

const DropdownWorkflow = styled(Dropdown)`

`
const IndicatorSelect = styled(DropdownWorkflow)`
    width: 360px;

    transform: ${props=>props.offset?'translateX(-15px)':''};

`
const CountySelect = styled(DropdownWorkflow)`
    width: 200px;
    position: relative;
    transform: ${props=>props.offset?'translateX(15px)':'translateX(-1px)'};
`
const NormalDropdown = styled(Dropdown)`
    width: 145px;

    transform: translateX(${props=>(props.offset*15)-2}px);
    &::before{
        content: '';
        position: absolute;
        
        z-index: 10;
    }
    
    color: ${props => props.mode==='horz'&& props.allRacesSelected?'var(--strokepeach)' : props.disabled || props.mode === 'vert'? 'var(--fainttext)' : 'black'};
    ${props => props.mode==='horz'? `
        &::after{
            display: none;
        }
    `: ''}
    ${props => props.allRacesSelected && props.mode==='vert'? `
        &::before{
            width: 100%;
            height: 100%;
            left: 0; top: 0px;
            outline: 1px solid var(--bordergrey);
            // background: white;
        }
    ` : props.mode==='vert' && !props.allRacesSelected? `


    ` : props.allRacesSelected && props.mode==='horz'? `
        &::before{
            height: 100%;
            width: 77%;
            left: 0px; top: 0px;
            outline: 1px solid var(--strokepeach);
            background: var(--faintpeach);
        }
    `: ''}
`
const DropdownReading = styled.span`
    z-index: 11;

`

const RaceList = styled.ul`
    width: calc(100% + 2px);
    border: 1px solid var(--bordergrey);
    background: white;
    position: absolute;
    z-index: 4;
    top: 44px;
    border-top: none;
    left: -1px;
    padding: 0;
    margin: 0;
    transition: clip-path .2s;
    z-index: 10;
    // clip-path: ${props=>props.vertOpen? 'polygon(0% -1%, 100% -1%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'};
    display: ${props=>props.vertOpen? 'block' : 'none'};

`
const Race = styled.li`
    list-style-type: none;
    padding: 12px 20px;
    ${props => props.disabled? `
       color: var(--inactivegrey);
    `: ''}
    outline: 1px solid ${props=>props.selected?'var(--strokepeach)': 'transparent'};
    color: ${props=>props.disabled? 'var(--inactivegrey)' : props.selected? 'var(--strokepeach)' : 'black'};
    background: ${props=> props.selected? 'var(--faintpeach)' : 'white'};
    pointer-events: ${props=>props.disabled? 'none' : 'auto'};

`
const RaceToggle = styled.div`
    position: absolute;
    left: 77%;
    top: -1px;
    height: calc(100% + 2px);
    display: flex;
    align-items: center;
    width: 340px;
    transition: clip-path .45s;
    // clip-path: ${props=>props.open? 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)' : 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)'};
    display: ${props=>props.open? 'flex' : 'none'};
    

`
const HorzRace = styled.div`
    position: absolute;
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center; justify-content: center;
    border: 1px solid ${props=> props.selected?'var(--strokepeach)':'var(--bordergrey)'};
    left: 0;
    transform: translateX(${props=>props.open?( props.index*85) - (props.index) : 0}px);
    transition: transform ${props=> .2 + (props.index*.1)}s;
    z-index: ${props=> props.selected? 8 : 8 - props.index};
    background: ${props=> props.selected? 'var(--faintpeach)' : 'white'};
    color: ${props=>props.disabled? 'var(--inactivegrey)' : props.selected? 'var(--strokepeach)' : 'black'};
    pointer-events: ${props=>props.disabled? 'none' : 'auto'};

`

const Logo = (props) => {
    return(
        <LogoContainer />
    )
}
const logoSVG = require('./assets/cnlogo.svg')
const twIcon = require('./assets/twitter.svg')
const fbIcon = require('./assets/fb.svg')
const LogoContainer = styled.div`
    width: 65px;
    height: 50px;
    margin-right: 30px;
    background-image: url(${logoSVG});
    background-repeat: no-repeat;
    background-size: contain;

    background-position: center;
    cursor: pointer;
`

const countyIds = Object.keys(countyLabels)

@observer
export default class ResponsiveNav extends React.Component{
    @observable raceDropdown = false
    @action openRaceDropdown = () => {
        if(this.props.init) return
        // this.props.closeSplash()
        this.raceDropdown = !this.raceDropdown
        if(this.raceDropdown){
            document.addEventListener('click',this.dropdownHandleClickOutside)
        }
        else{
            document.removeEventListener('click',this.dropdownHandleClickOutside)
        }
        // this.props.closeSplash()
    }
    constructor(){
        super()
        this.nav = React.createRef()
        this.dropdown = React.createRef()
    }
    componentDidMount(){
    }
    componentDidUpdate(){
        if(this.props.open && this.raceDropdown) this.openRaceDropdown()
        if(this.props.open){
            document.addEventListener('click',this.handleClickOutside)
        }
        else if(!this.props.open){
            document.removeEventListener('click',this.handleClickOutside)
        }
    }

    handleClickOutside = (e) => {

        if(!this.nav.current.contains(e.target) && !countyIds.includes(e.target.id)){
            console.log('clicked outside: ', e.target)
            console.log(this.nav.current.contains(e.target))
            this.props.openNav()
        }
    }

    dropdownHandleClickOutside = (e) => {
        if(!this.dropdown.current.contains(e.target)){
            console.log('clicked outside open race dropdown, closing')
            this.openRaceDropdown()
        }
    }

    render(){
        const {openNav, open, store, closeInit, init} = this.props
        const {indicator, county, year, race} = store
        const ind = indicators[indicator]

        const noRace = indicator && !ind.categories.includes('hasRace')

        const noazn = !noRace && indicator && county && (ind.counties[county].asian[year] === '' || ind.counties[county].asian[year]==='*')
        const noblk = !noRace && indicator && county && (ind.counties[county].black[year] === '' || ind.counties[county].black[year]==='*')
        const noltx = !noRace && indicator && county && (ind.counties[county].latinx[year] === '' || ind.counties[county].latinx[year]==='*')
        const nowht = !noRace && indicator && county && (ind.counties[county].white[year] === '' || ind.counties[county].white[year]==='*')
        const nooth = !noRace && indicator && county && (ind.counties[county].other[year] === '' || ind.counties[county].other[year]==='*')


        return(
            <Nav ref = {this.nav}>
                <Logo />
                <IndicatorSelect 
                    onClick = {()=>openNav('indicator')} 
                    // offset = {open==='county'}
                >
                    {store.indicator? semanticTitles[store.indicator].shorthand : init? 'Indicator' : 'Pick an indicator'}
                </IndicatorSelect>
                <CountySelect 
                    // disabled = {!indicator}
                    onClick = {()=>openNav('county')}
                    offset = {open}
                >
                    {store.county? countyLabels[store.county] : init? 'County' : 'All counties' }
                    {store.notifications.unselectCounty &&
                        <Tooltip 
                            direction = 'below'
                            pos = {{x: 185, y: 0}}
                            caretOffset = {-75}
                        >
                                <ForcedUnselectTip>
                                    The indicator you picked doesn’t have any data for {store.notifications.unselectCounty} county, so we’re showing you statewide data now. 
                                </ForcedUnselectTip>   
                        </Tooltip>
                    }
                </CountySelect>
                

                
                    <NormalDropdown
                        ref = {this.dropdown}
                        // disabled = {!indicator} 
                        onClick = {!open? this.openRaceDropdown : ()=>{console.log('notopen')}} 
                        offset = { open? 2 : 0 }
                        allRacesSelected = {(open || this.raceDropdown) && !noRace && !race}
                        mode = {open? 'horz' : this.raceDropdown? 'vert' : ''}
                    >   <DropdownReading onClick = {open || this.raceDropdown? ()=>store.completeWorkflow('race',null) : ()=>{}}>
                            {(!open && !this.raceDropdown && store.race) || this.raceDropdown && store.race? capitalize(store.race) : init? 'Race' : this.raceDropdown? 'Pick race' : 'All races'}
                        </DropdownReading>
                        
                            <RaceList disabled = {noRace} vertOpen = {this.raceDropdown && !open} >
                                <Race selected = {!race}  onClick = {()=>store.completeWorkflow('race',null)}> All Races </Race>
                                <Race selected = {race==='asian'} disabled = {noRace || noazn} onClick = {!noazn?()=>store.completeWorkflow('race','asian'):()=>{}}> Asian </Race>
                                <Race selected = {race==='black'} disabled = {noRace || noblk} onClick = {!noblk?()=>store.completeWorkflow('race','black'):()=>{}}> Black </Race> 
                                <Race selected = {race==='latinx'} disabled = {noRace || noltx} onClick = {!noltx?()=>store.completeWorkflow('race','latinx'):()=>{}}> Latinx </Race> 
                                <Race selected = {race==='white'} disabled = {noRace || nowht} onClick = {!nowht?()=>store.completeWorkflow('race','white'):()=>{}}> White </Race> 
                                <Race selected = {race==='other'} disabled = {noRace || nooth} onClick = {!nooth?()=>store.completeWorkflow('race','other'):()=>{}}> Other </Race> 
                            </RaceList>

                            <RaceToggle disabled = {noRace} open = {open} >
                                <HorzRace selected = {race==='asian'} disabled = {noRace || noazn} index = {0} open = {open} onClick = {!noazn?()=>store.completeWorkflow('race','asian'):()=>{console.log('nazn')}}> Asian </HorzRace>
                                <HorzRace selected = {race==='black'} disabled = {noRace || noblk} index = {1} open = {open} onClick = {!noblk?()=>store.completeWorkflow('race','black'):()=>{}}> Black </HorzRace>
                                <HorzRace selected = {race==='latinx'} disabled = {noRace || noltx} index = {2} open = {open} onClick = {!noltx?()=>store.completeWorkflow('race','latinx'):()=>{}}> Latinx </HorzRace>
                                <HorzRace selected = {race==='white'} disabled = {noRace || nowht} index = {3} open = {open} onClick = {!nowht?()=>store.completeWorkflow('race','white'):()=>{}}> White </HorzRace>
                                <HorzRace selected = {race==='other'} disabled = {noRace || nooth} index = {4} open = {open} onClick = {!nooth?()=>store.completeWorkflow('race','other'):()=>{}}> Other </HorzRace>
                            </RaceToggle>

                        
                    </NormalDropdown>
                    <YearToggle 
                        store = {store}
                        offset = { open? 2 : 0 }
                        onClick = {value => store.completeWorkflow('year',value)}
                        selected = {store.year}
                    />

                    <Share nav = {open}>
                        <Fb />
                        <Twitter />
                    </Share>
                    
                        

                <FlipMove 
                    typeName = {null}
                    enterAnimation = {{
                        from: {opacity: 0, transform: 'translateY(-50px)'},
                        to: {opacity: 1, transform: 'translateY(0px)'}
                    }}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: 'translateY(0px)'},
                        to: {opacity: 0, transform: 'translateY(-50px)'}
                    }}
                >
                {open && <PickingWorkflow x = {()=>openNav(false)} store = {store} open = {open} close = {()=>openNav(false)} />}
                </FlipMove>
                {/*open && <X onClick = {()=>openNav(false)}/>*/}
            </Nav>

        )
    }
}
const ForcedUnselectTip = styled.div`
    font-size: 13px;
    width: 325px;
    line-height: 21px;
    white-space: normal;
`
const Share = styled.div`
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    transition: opacity .25s, transform .25s;
    transform: ${props => props.nav? 'translateX(100%)' : 'translateX(0)'};
    opacity: ${props => props.nav? 0 : 1};

    /*width: 320px;*/
`
const ShareIco = styled.div`
    cursor: pointer;
    width: 20px;
    height: 20px;
    background-color: var(--fainttext);
    background-position: center;
    background-size: contain;
`
const Fb = styled(ShareIco)`
    background-image: url(${fbIcon});
    background-position: center;
    background-size: contain;
    margin-right: 15px;
    border-radius: 2px;
    width: 19px;
    height: 19px;
    &:hover{
        background-color: #3b5998;
    }
`
const Twitter = styled(ShareIco)`
    background-image: url(${twIcon});
    &:hover{
        background-color:  #00aced;
    }

`

const xIcon = require('./assets/x.svg')

const X = styled.div`
    position: absolute;
    right: 30px;
    width:25px;
    height: 25px;
    cursor: pointer;
    background-image: url(${xIcon});
    opacity: 0.25;
    &:hover{
        opacity: 0.5;
    }
    z-index: 2;

`
const YearToggle = (props) =>{
    const {indicator} = props.store
    const years = indicator? indicators[indicator].years.map((yr,i)=>{
        return {label:yr, value: i}
    }): false

    return <YrToggle offset = {props.offset} hide = {!years}> 
            {years && <Toggle
                            size = "big"
                            options = {years}
                            onClick = {props.onClick}
                            selected = {props.selected}
                        />}

    </YrToggle>
        
    
}
const YrToggle = styled.div`
    margin-left: 15px;
    transition: transform .6s;
    transform: translateX(${props=>props.offset? 415 : 0}px);
`

const LargeWorkflow = styled.div`
    position: absolute;
    top: 65px;
    background: var(--offwhitefg);
    border: 1px solid var(--bordergrey);
    padding: 30px;
    z-index: 3;
    @media ${media.optimal}{
        width: 1000px;
        height: 720px;
        padding: 30px 45px;
    }
    @media ${media.compact}{
        width: 780px;
        height: 585px;
        padding: 20px 35px;
    }
`

const screen = getMedia()

@observer
export class PickingWorkflow extends React.Component{

    @observable workflowReadyToAnimate = true
    @action setAnimationReadyStatus = (tf) => {this.workflowReadyToAnimate = tf}

    handlePageChange =(evt, goTo)=>{
        if(!this.workflowReadyToAnimate) return
        const store = this.props.store
        if(goTo === -1 || goTo > store.indicatorPages.length-1) return
        else store.setIndicatorListPage(goTo)
        evt.preventDefault()
        evt.stopPropagation()   
    }

    render(){
        const {store, close} = this.props
        const which = this.props.open
        const {indicatorListPage, setIndicatorListPage, indicatorPages} = store
        return(
            <LargeWorkflow>
                <X onClick = {this.props.x} />  
                <FlipMove
                    // typeName = {null}
                    style = {{
                        position: 'absolute',
                        top: 0, left: 0,
                        padding: '25px 35px',
                        overflow: 'hidden',
                        width: '100%', height: '100%'    
                    }}
                    enterAnimation = {{
                        from: {opacity: 0, transform: `translateX(${which==='indicator'?-150:150}px)`},
                        to: {opacity: 1, transform: `translateX(0px)`},
                    }}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: `translateX(0px)`},
                        to: {opacity: -1, transform: `translateX(${which==='indicator'?150:-150}px)`},
                    }}
                >
                    {which === 'indicator' && 
                        <IndicatorList 
                            store = {store} 
                            closeNav = {this.props.close}
                            setNumPages = {this.setNumPages}
                            page = {this.page}
                            setReady = {this.setAnimationReadyStatus}
                        />
                    }
                    {which === 'county' && <CountyList store = {store} closeNav = {this.props.close}/>}
                </FlipMove>

                        <PageNext 
                            show = {indicatorListPage < indicatorPages.length-1}
                            onClick = {
                                (e)=>this.handlePageChange(e,indicatorListPage+1)
                            }   
                        />
                    
                        <PagePrev 
                            show = {indicatorListPage > 0}
                            onClick = {
                                (e)=>this.handlePageChange(e,indicatorListPage-1)

                            } 
                        />
                    

            </LargeWorkflow>
        )
    }
}

const PageBtn = styled.div`
    position: absolute;
    width: 50px; height: 95px; 
    // border-radius: 50%;
    border: 1px solid var(--bordergrey);
    background: white;
    top: 0; bottom: 0; margin: auto;
    // display: ${props => props.show? 'block' : 'none'};
    opacity: ${props => props.show? 1 : 0};
    transition: transform .25s, opacity .25s;
`
const PagePrev = styled(PageBtn)`
    left: -25px;
    transform: translateX(${props=>props.show?0:'15px'});
`
const PageNext = styled(PageBtn)`
    right: -25px;
    transform: translateX(${props=>props.show?0:'-15px'});
`
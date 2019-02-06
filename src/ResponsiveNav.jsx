import React from 'react'
import styled, {css, keyframes} from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex, find, pickBy, debounce } from 'lodash'
import {findDOMNode} from 'react-dom'
import FlipMove from 'react-flip-move'

import {Toggle, Button} from './components/generic'
import Icon from './components/generic/Icon'

import indicators from './data/indicators'
import { counties } from './assets/counties'
import countyLabels from './assets/countyLabels'
// import semanticTitles from './assets/semanticTitles'

import CountyList from './components/CountyList'
import IndicatorList from './components/IndicatorList'
import {Tooltip, DropdownToggle} from './components/generic'
import ExpandBox from './components/ExpandBox'

import media, {getMedia} from './utilities/media'
import {isValid} from './utilities/isValid'
import {capitalize} from './utilities/toLowerCase'

import caret from './assets/caret.svg'
import resetIco from './assets/reset.svg'

// import combo from '../src/utilities/trungCombo'

import stopwords from './utilities/stopwords'

const Nav = styled.div`
    z-index: 3;
    display: flex;
    align-items: center;
    position: relative;
    @media ${media.optimal}{
        /*width: 100%;*/
        width: 1550px;

    }
    @media ${media.compact}{
        /*width: 100%;*/
        width: 1300px;

    }
`
const Dropdown = styled.div`
    position: relative;
    font-weight: ${props => props.hasValue&&!props.isOpen? 500 : 400};
    box-shadow: ${props => props.isOpen?'inset 0px 0px 0px 1.5px var(--strokepeach)':''};
    @media ${media.optimal}{
        padding: 12px 45px 12px 20px;
    }
    @media ${media.compact}{
        height: 44px;
        padding: 10px 45px 10px 20px;
    }
    background: ${props => props.hasValue&&!props.isOpen? 'var(--faintpeach)' : props.disabled? 'var(--offwhitefg)' : 'white'};
    color: ${props => props.hasValue && props.isOpen? 'var(--fainttext)' : (props.hasValue&&!props.isOpen) || props.hovered? 'var(--strokepeach)' : props.disabled? 'var(--fainttext)' : 'black'};
    display: flex;
    align-items: center;
    /*outline: 1px solid var(--offwhitebg);*/
    transition: box-shadow .25s, background-color .25s, transform .25s;
    white-space: nowrap;
    cursor: pointer;
`  

const DropdownWorkflow = styled(Dropdown)`
    &::before{
        content: '';
        right: 18px;
        margin-top: 4px;
        width: 0px;
        border: 7px solid transparent;
        border-top-color: ${props => props.hasValue && props.hovered? 'var(--strokepeach)' : props.hasValue&&!props.isOpen? 'var(--peach)' : props.isOpen || props.hovered? 'var(--strokepeach)' : 'var(--normtext)'};
        height: 0px;
        position: absolute;
    }
    &::after{
        content: '';
        right: 18px;
        margin-top: 4px;
        width: 0px;
        border: 7px solid transparent;
        transform: scale(0.75);
        transform-origin: 50% 20%;
        border-top-color: white;
        height: 0px;
        position: absolute;
        transition: transform .25s;
        ${props => props.hovered || props.isOpen? `
            transform: scale(0.65);    
        ` : ''}
        ${props => props.hasValue&&!props.isOpen? `
            transform: scale(0);    
        ` : ''}
    }
`
const IndicatorSelect = styled(DropdownWorkflow)`
    width: 395px;
    transform: ${props=>props.offset?'translateX(-15px)':''};

`
const Ico = styled.div`
    position: absolute;
    /*outline: 1px solid black;*/
    width: 30px;
    height: 30px;
    background-repeat: no-repeat;
    margin-right: 10px;
    flex-shrink: 0;
    background-size: cover;
`
const indicatorIco = require('./assets/indicator-states.svg')
const countyIco = require('./assets/county-states.svg')
const IndicatorIcon = styled(Ico)`
    background-image: url(${indicatorIco});
    background-position: ${p => p.hasValue&&p.hovered&&!p.isOpen? '100% 50%' : p.hasValue&&!p.isOpen? '66.666% 50%' : p.hovered && !p.isOpen? '33.333% 50%' : '0% 50%'};
`
const CountyIcon = styled(Ico)`
    background-image: url(${countyIco});
    background-position: ${p => p.hasValue&&p.hovered&&!p.isOpen? '100% 50%' : p.hasValue&&!p.isOpen? '66.666% 50%' : p.hovered && !p.isOpen? '33.333% 50%' : '0% 50%'};
`
const SelectionValueContainer = styled.div`
    display: flex;
    max-width: 165px;
    align-items: center;
`
const SelectionValue = styled.div`
    width: 100%;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 35px;
    padding-left: 7px;
    /*margin-left: -7px;*/
    ${props => props.muteAnyways? 'color: var(--fainttext);' : ''}
    &::after{
        content: '${props => props.label}';
        color: rgba(0,0,0,0);
        position: absolute;
        top: calc(50% - 1px);
        left: -10px;
        padding: 0 13px;
        z-index: 5;
        bottom: 0; 
        margin: auto;
        border-top: 2px solid var(--strokepeach);
        transform: scaleX(${props => props.strikethrough? 1 : 0});
        transition: transform .2s;
        pointer-events: none;
        transform-origin: ${p=>p.hasValue? '100% 50%' : '0% 50%'};

    }
`
const CountySelect = styled(DropdownWorkflow)`
    width: 230px;
    position: relative;
    transform: ${props=>props.offset?'translateX(15px)':'translateX(1px)'};
`



const countyIds = Object.keys(countyLabels)

const NoRaceTip = styled.div`
    font-size: 13px;
`

@observer
export default class ResponsiveNav extends React.Component{

    @observable hoveredWorkflow = null
    @action onHoverWorkflow = (which) => this.hoveredWorkflow = which

    @observable raceDropdown = false
    @action setRaceDropdown = (tf) => {this.raceDropdown = tf}

    constructor(){
        super()
        this.nav = React.createRef()
        this.dropdown = React.createRef()
    }
    componentDidMount(){
    }
    componentWillUpdate(){
        if(this.props.open){
            document.addEventListener('click',this.handleClickOutside)

        }
        else if(!this.props.open){
            document.removeEventListener('click',this.handleClickOutside)
        }
    }

    handleClickOutside = (e) => {
        // if(this.props.open && this.nav.current){
            if(!this.nav.current.contains(e.target) && !countyIds.includes(e.target.id)){
                console.log('clicked something outside the nav:', e.target)
                this.props.openNav()
                if(this.props.store.indicatorSearchString) this.props.store.modifySearchString('indicator','')
                if(this.props.store.countySearchString) this.props.store.modifySearchString('county','')
            }
        // }
    }


    render(){
        const {openNav, open, store, closeInit, init} = this.props
        const {indicator, county, year, race} = store
        const ind = indicators[indicator]

        const noRace = indicator && !ind.categories.includes('hasRace')

        const noall = indicator && county && !isValid(ind.counties[county].totals[year]) //rare case [i.e. glenn health insurance]
        const noazn = !noRace && indicator && county && (ind.counties[county].asian[year] === '' || ind.counties[county].asian[year]==='*')
        const noblk = !noRace && indicator && county && (ind.counties[county].black[year] === '' || ind.counties[county].black[year]==='*')
        const noltx = !noRace && indicator && county && (ind.counties[county].latinx[year] === '' || ind.counties[county].latinx[year]==='*')
        const nowht = !noRace && indicator && county && (ind.counties[county].white[year] === '' || ind.counties[county].white[year]==='*')
        const nooth = !noRace && indicator && county && (ind.counties[county].other[year] === '' || ind.counties[county].other[year]==='*')

        const screen = getMedia()

        return(
            <Nav ref = {this.nav}>
                <IndicatorSelect 
                    onClick = {open!=='indicator'?()=>openNav('indicator'): (e)=>{
                            openNav()
                            // e.stopPropagation()
                        }}
                    hovered = {this.hoveredWorkflow === 'indicator' && this.props.open!=='indicator'}
                    hasValue = {!init? indicator : ''}
                    isOpen = {open==='indicator' && !this.raceDropdown}
                    onMouseEnter = {()=>{this.onHoverWorkflow('indicator')}} 
                    onMouseLeave = {()=>{this.onHoverWorkflow(null)}}
                    // offset = {open==='county'}
                >
                    <IndicatorIcon 
                        hovered = {this.hoveredWorkflow === 'indicator'}
                        hasValue = {!init? indicator : ''} 
                        isOpen = {open==='indicator'}
                    />
                    <SelectionValue>{!init && store.indicator? indicators[store.indicator].semantics.shorthand : 'Indicator' }</SelectionValue>
                </IndicatorSelect>
                <CountySelect 
                    // disabled = {!indicator}
                    onClick = {open!=='county'? ()=>openNav('county') : ()=>{ openNav()}}
                    hovered = {this.hoveredWorkflow === 'county' && open!=='county'}
                    hasValue = {county}
                    isOpen = {open==='county' && !this.raceDropdown}
                    onMouseEnter = {()=>{this.onHoverWorkflow('county')}} 
                    onMouseLeave = {()=>{this.onHoverWorkflow(null)}}
                    offset = {open}
                >
                    <CountyIcon 
                        hovered = {this.hoveredWorkflow === 'county'}
                        hasValue = {county} 
                        isOpen = {open==='county'}
                    />
                    <SelectionValueContainer>
                    <SelectionValue
                        hasValue = {county}
                        muteAnyways = {!county && open==='county'}
                        label = {store.county? countyLabels[store.county] : 'California'}
                        strikethrough = {county && this.hoveredWorkflow === 'countyStrikeout'}
                    >
                        { store.county? countyLabels[store.county] : init||open? 'County' : 'California' }
                        
                    </SelectionValue>
                    {county &&
                    <QuickClear 
                        img = "x"
                        color = "peach"
                        hoverColor = "strokepeach"
                        onMouseEnter = {()=>{this.onHoverWorkflow('countyStrikeout')} }
                        onMouseLeave = {()=>{this.onHoverWorkflow('county')} }
                        onClick = {county? (e)=>{
                            store.completeWorkflow('county',null)
                            e.stopPropagation()
                            // e.nativeEvent.stopImmediatePropagation()
                        } : ()=>{} }
                    />
                    }
                </SelectionValueContainer>
                    {/*store.notifications.unselectCounty &&
                        <Tooltip 
                            direction = 'below'
                            pos = {{x: 185, y: 0}}
                            caretOffset = {-75}
                        >
                                <ForcedUnselectTip>
                                    The indicator you picked doesn’t have any data for {store.notifications.unselectCounty} county, so we’re showing you statewide data now. 
                                </ForcedUnselectTip>   
                        </Tooltip>
                    */}
                </CountySelect>
                

                    <RaceDropdownToggle 
                        // dropdownOpen = {this.raceDropdown}
                        setDropdownState = {this.setRaceDropdown}
                        offset = {open}
                        selected = {race}
                        defaultWidth = {140}
                        disabled = {!store.init && noRace}
                        openOther = {store.init? ()=>{
                            openNav('indicator')
                        }: false}
                        toggleMode = {open && !noRace && screen==='optimal'}
                        options = {[
                            {label: init && !this.raceDropdown? 'Race':'All races', value: '', disabled: noall},
                            {label: 'Asian', value: 'asian', disabled: noazn},
                            {label: 'Black', value: 'black', disabled: noblk},
                            {label: 'Latinx', value: 'latinx', disabled: noltx},
                            {label: 'White', value: 'white', disabled: nowht},
                            {label: 'Other', value: 'other', disabled: nooth},
                        ]}
                        select = {(val)=>{
                            const valid = store.completeWorkflow('race',val)
                            if(valid) return true
                            else return false
                        }}
                    />

                    <YearToggle 
                        init = {init}
                        store = {store}
                        offset = { open && noRace? 1 : open? 2 : 0 }
                        onClick = {value => store.completeWorkflow('year',value)}
                        selected = {store.year}
                        bigscreen = {screen==='optimal'}
                    />

                    <PickingWorkflow 
                        muted = {this.raceDropdown}
                        x = {()=>openNav(false)} 
                        store = {store}
                        open = {open? true : false}
                        which = {open}
                        close = {()=>openNav(false)} 
                    />

                
                <Reset 
                    className = 'negativeOnDark' 
                    label = {<BtnLabel>Reset<ResetIcon /></BtnLabel>}
                    visible = {!init && indicator}
                    onClick = {this.props.reset}
                />

            </Nav>

        )
    }
}
const BtnLabel = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    padding-right: 30px;
`
const ResetIcon = styled.figure`
    position: absolute;
    right: -8px;
    top: 0px; bottom: 0; margin: auto;
    width: 30px;
    height: 30px;
    background-size: cover;
    /*border: 1px solid white;*/
    background-image: url(${resetIco});
    background-repeat: no-repeat;
    transform-origin: 50% 50%;
    transition: transform .2s;
`
const RaceDropdownToggle = styled(DropdownToggle)`
    transform: translateX(${props=>props.offset?30:3}px);
    transition: transform .25s;
    z-index: 4;
`

const Reset = styled(Button)`
    position: absolute;
    right: 0;
    transition: opacity .4s, transform .4s;
    pointer-events: ${props=>props.visible?'auto':'none'};
    opacity: ${props=>props.visible?1:0};
    transform: translateX(${props => props.visible? 0 : 50}px);
    &:hover{
        figure{ 
            background-position: 100% 0; 
            transform: rotate(-90deg);
        }
    }
`

const ForcedUnselectTip = styled.div`
    font-size: 13px;
    width: 325px;
    line-height: 21px;
    white-space: normal;
`

const ShareIco = styled.div`
    cursor: pointer;
    width: 20px;
    height: 20px;
    background-color: var(--fainttext);
    background-position: center;
    background-size: contain;
`

const X = styled(Icon)`
     position: absolute;
     right: 22px;
     top: 22px;
     width:25px;
     height: 25px;
     cursor: pointer;
     z-index: 2;
`
const QuickClear = styled(Icon)`
    width: 15px; height: 15px;
    margin-bottom: 0px;
    margin-right: -5px;
    margin-left: 8px;
    flex-shrink: 0;

`
const YearToggle = (props) =>{
    const {init} = props
    const {indicator,county,race} = props.store
    const years = !init && indicator? indicators[indicator].years.map((yr,i)=>{
        const val = indicators[indicator].counties[county||'california'][race||'totals'][i]
        const disabled = val!==0 && (!val || val==='*')
        return {label:yr, value: i, disabled: disabled}
    }): false

    return <YrToggle 
                offset = {props.offset} 
                hide = {!years}
                bigscreen = {props.bigscreen}
            > 
            {years && 
                <Toggle
                    size = "big"
                    theme = "negativeNoStroke"
                    options = {years}
                    onClick = {props.onClick}
                    selected = {Number(props.selected)}
                />
            }

    </YrToggle>
        
    
}
const YrToggle = styled.div`
    margin-left: 15px;
    transition: transform ${props=>props.bigscreen? .65 :.25}s;
    transform: translateX(${props=>props.offset===2 && props.bigscreen? 468 : (props.offset===2 && !props.bigscreen) || props.offset===1? 25: 0}px);
`



const Triangle = styled.div`
    position: absolute;
    z-index: 1000;
    transition: transform ${props => props.speed}; 
    @media ${media.optimal}{
        transform: translate(${props => props.hide? '0, 2px' : props.active==='indicator'? '35px, 2px' : '440px, 2px'});
    }
    @media ${media.compact}{
        transform: translate(${props => props.hide? '0, 2px' : props.active==='indicator'? '40px, 2px' : '450px, 2px'});
    }
    &::after, &::before{
        position: absolute;
        content: '';
        width: 0; height: 0;
    }
    &::after{
        left: 1px;
        top: -25px;
        border: 13px solid transparent;
        border-bottom: 12.5px white solid;
    }
    &::before{
        left: 0;
        top: -28px;
        border: 14px solid transparent;
        border-bottom: 13.5px var(--bordergrey) solid;
    }

`

@observer
export class PickingWorkflow extends React.Component{

    @observable pageAnimDirection = 'left'
    @observable hoveredPageBtn = false

    @observable animationType = 'mount' //mount or change

    @action setSearchFocus = (which, tf) =>{
        console.log('nav set search focus')
        if(!tf) window.onkeyup = this.keyHandler
        this[which+'SearchFocus'] = tf
    }
    @observable indicatorSearchFocus = false
    @observable countySearchFocus = false

    exit = () => {
        const store = this.props.store
        if(store.indicatorSearchString) store.modifySearchString('indicator','')
        this.props.x()
    }
    keyHandler = (e) => {
        const {store} = this.props
        console.log(e.which)
        if(e.key==='Escape'||e.key==='Esc'){
            this.exit()
        }
        else if(e.key==='ArrowLeft'){
            const {indicatorListPage} = this.props.store
            this.handlePageChange(null,indicatorListPage-1)
        }
        else if(e.key==='ArrowRight'){
            const {indicatorListPage} = this.props.store
            this.handlePageChange(null,indicatorListPage+1)
        }
        else if(e.which >= 65 && e.which <= 90){ //user typed letter
            //searching indicator or county?
            if(this.props.which === 'indicator' && !this.indicatorSearchFocus){
                //searchinput is not already focused: enter key and focus
                if(!store.indicatorSearchString){
                    store.modifySearchString('indicator', e.key)
                    this.setSearchFocus('indicator', true)
                }
            }
            else if(this.props.which === 'county' && !this.countySearchFocus){
                if(!store.countySearchString){
                    store.modifySearchString('county', e.key)
                    this.setSearchFocus('county', true)
                }
            }
        }
    }
    @action
    handlePageChange =(evt, goTo)=>{

        const store = this.props.store
        
        if(goTo > store.indicatorListPage) this.pageAnimDirection = 'left'
        else if(goTo < store.indicatorListPage) this.pageAnimDirection = 'right'

        if(goTo === -1 || goTo > store.indicatorPages.length-1) return
        else store.setIndicatorListPage(goTo)
        // evt.preventDefault()
        // evt.stopPropagation()   
    }
    @action onHoverPageBtn = (val) => this.hoveredPageBtn = val

    componentDidUpdate(oldProps){
        if(oldProps.which !== this.props.which){
            if(oldProps.which === 'indicator' && this.props.store.indicatorSearchString){
                this.props.store.modifySearchString('indicator','')
            }
            else if(oldProps.which === 'county' && this.props.store.countySearchString){
                this.props.store.modifySearchString('county','')
            }
            if(this.props.which) this.setLastList(this.props.which)
        }
    }

    componentWillUpdate(newProps){
        if(this.props.open !== newProps.open){ 
            this.setAnimationMode('mount')
            console.log('setting mount/unmount animation, last list shown is', this.lastListShown)
            console.log(this.animationType)
            if(newProps.open){
                console.log('setting keyhandler')
                window.onkeyup = this.keyHandler
            }
            else{
                window.onkeyup = () => {}
            }
        }
        else if(this.props.which !== newProps.which){
            this.setAnimationMode('change')
        }
    }

    @observable display = false
    @action setDisplay = (tf) => {
        console.log('seting display to ', tf)
        this.display = tf
    }
    @observable lastListShown = ''
    @action setLastList = (list) => this.lastListShown = list
    @action setAnimationMode = (mode) => this.animationType = mode

    render(){
        const {store, close, which, open} = this.props
        const {indicatorListPage, setIndicatorListPage, indicatorPages, screen} = store

        const showInd = which === 'indicator' || (!open && this.lastListShown === 'indicator')
        const showCounty = which === 'county' || (!open && this.lastListShown === 'county')

        const modeSizes = screen === 'optimal'? {
            closed: {width: 95, height: 72},
            open: {width: 950, height: 720},
        }: screen === 'compact'? {
            closed: {width: 78, height: 57},
            open: {width: 780, height: 575},
        } : {}

        return(

            <LargeWorkflow
                style = {{
                    opacity: open? 1 : 0,
                    transition: 'opacity .3s',
                    transitionDelay: open? '0s' : '0.1s',
                    pointerEvents: open? 'auto' : 'none',
                }}
            >
                <X 
                    img = "x_thin" 
                    color = "bordergrey"
                    hoverColor = "strokepeach"
                    onClick = {this.exit}
                />
                <Lists
                    currentMode = {open? 'open' : 'closed'}
                    modes = {modeSizes}
                    // duration = {.375}
                    delay = {open?'.125s':'0s'}
                    duration = {.35}
                >
                <FlipMove
                    // typeName = {null}
                    style = {{
                        position: 'absolute',
                        top: 0, left: 0,
                        padding: screen==='optimal'? '35px 50px' : '25px 35px',
                        overflow: 'hidden',
                        width: modeSizes.open.width + 'px' ,    
                        height: modeSizes.open.height + 'px'
                    }}
                    disableAllAnimations = {this.animationType==='mount'}
                    enterAnimation = {{
                        from: {
                            opacity: 0, 
                            transform: `translateX(${which==='indicator'?-150:150}px)`
                        },
                        to: {
                            opacity: 1, 
                            transform: `translateX(0px)`
                        },
                    }}
                    leaveAnimation = {{
                        from: {
                            opacity: 1, 
                            transform: `translateX(0px)`
                        },
                        to: {
                            opacity: -1,
                            transform: `translateX(${which==='indicator'?150:-150}px)`
                        },
                    }}
                    maintainContainerHeight = {true}
                >
                    {showInd &&
                        <IndicatorList 
                            muted = {this.props.muted}
                            store = {store} 
                            closeNav = {this.props.close}
                            setNumPages = {this.setNumPages}
                            page = {this.page}
                            animDir = {this.pageAnimDirection}
                            prevOffset = {this.hoveredPageBtn}

                            searchString = {store.indicatorSearchString}
                            focusInput = {this.indicatorSearchFocus}
                            setSearchFocus = {(tf)=>this.setSearchFocus('indicator', tf)}
                            onSearch = {(val)=>{store.modifySearchString('indicator', val)}}
                        />
                    }
                    {showCounty &&
                        <CountyList 
                            muted = {this.props.muted}
                            store = {store} 
                            closeNav = {this.props.close}

                            // searchResults = {store.}
                            searchString = {store.countySearchString}
                            focusInput = {this.countySearchFocus}
                            setSearchFocus = {(tf)=>this.setSearchFocus('county', tf)}
                            onSearch = {(val)=>{store.modifySearchString('county', val)}}
                            // muted = {this.props.muted}
                        />
                    }
                </FlipMove>
                </Lists>

                        <PageNext 
                            show = {which==='indicator' && indicatorListPage < indicatorPages.length-1 && !store.sanityCheck.indicator}
                            delay = {this.animationType === 'mount' && open? '.5s' : '0s'}
                            onClick = {
                                (e)=>{
                                    this.setAnimationMode('page')
                                    this.handlePageChange(e,indicatorListPage+1)
                                }
                                
                            }
                            onMouseEnter = {()=>{this.onHoverPageBtn('next')}}
                            onMouseLeave = {()=>{this.onHoverPageBtn(false)}}   
                        >
                            <ChevIcon img = "chevright_thin" color = ''/>
                        </PageNext>
                    
                        <PagePrev 
                            show = {which==='indicator' && indicatorListPage > 0 && !store.sanityCheck.indicator}
                            delay = {this.animationType === 'mount' && open? '.5s' : '0s'}
                            onClick = {
                                (e)=>{
                                    this.setAnimationMode('page')
                                    this.handlePageChange(e,indicatorListPage-1)
                                }                           
                            }
                            onMouseEnter = {()=>{this.onHoverPageBtn('prev')}}
                            onMouseLeave = {()=>{this.onHoverPageBtn(false)}} 
                        >
                            <ChevIcon img = "chevleft_thin" color = ''/>
                        </PagePrev>
                <Triangle
                    hide = {!open}
                    active = {which}
                    speed = {this.animationType === 'mount' && which==='county'? '0s' : '.25s'}
                 />
                        </LargeWorkflow>
                    


        )
    }
}
const LargeWorkflow = styled.div`
    position: absolute;
    /*border: 1px solid var(--bordergrey);*/
    z-index: 3;
    transform-origin: 0% 0%;
    opacity: ${props => props.muted? 0.5 : 1};
    @media ${media.optimal}{
        width: 950px;
        height: 720px;
        /*padding: 30px 45px;*/
        top: 100px;
    }
    @media ${media.compact}{
        top: 90px;
        width: 780px;
        height: 575px;
        /*padding: 20px 35px;*/
    }
`



const Lists = styled(ExpandBox)`
    background: var(--offwhitefg);
`


const PageBtn = styled.div`
    position: absolute;


    top: 0; bottom: 0; margin: auto;
    opacity: ${props => props.show? 1 : 0};
    transition: transform .25s, opacity .25s;
    transition-delay: ${props => props.delay};
    width: 50px;
    height: 95px;
    z-index: 4;
    display: flex; justify-content: center;
    align-items: center;
    background: white;
    border: 1px solid var(--fainttext);
    cursor: pointer;
    background: var(--offwhitefg);
    fill: var(--normtext);
    &:hover{
        fill: var(--strokepeach);
    }
    &::before, &::after{
        content: '';
        position: absolute;
        height: 15px; 
        width: 3px; 
        background: var(--offwhitefg);
    }
    &::before{
        top: -16px;
    }
    &::after{
        bottom: -16px;
    }

`
const PagePrev = styled(PageBtn)`
    padding-right: 4px;
    left: -32px;
    transform: translateX(${props=>props.show?0:'15px'});
    &::after, &::before{
        right: 15px;
    }
`
const PageNext = styled(PageBtn)`
    padding-left: 4px;
    right: -32px;
    transform: translateX(${props=>props.show?0:'-15px'});
    &::after, &::before{
        left: 16px;
    }
`
const ChevIcon = styled(Icon)`
    width: 35px;
    height: 35px;
`
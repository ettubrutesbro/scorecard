import React from 'react'
import styled, {css} from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex, find } from 'lodash'
import {findDOMNode} from 'react-dom'
import FlipMove from 'react-flip-move'

import {Toggle, Button} from './components/generic'

import indicators from './data/indicators'
import { counties } from './assets/counties'
import countyLabels from './assets/countyLabels'
import semanticTitles from './assets/semanticTitles'

import CountyList from './components/CountyList'
import IndicatorList from './components/IndicatorList'
import {Tooltip, DropdownToggle} from './components/generic'

import media, {getMedia} from './utilities/media'
import {isValid} from './utilities/isValid'
import {capitalize} from './utilities/toLowerCase'

import caret from './assets/caret.svg'
import resetIco from './assets/reset.svg'

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
    // box-shadow: ${props => props.hasValue&&!props.isOpen?'inset 0px 0px 0px 2px var(--peach)':''};
    @media ${media.optimal}{
        padding: 12px 45px 12px 20px;
    }
    @media ${media.compact}{
        padding: 10px 45px 10px 20px;
    }
    background: ${props => props.hasValue&&!props.isOpen? 'var(--faintpeach)' : props.disabled? 'var(--offwhitefg)' : 'white'};
    color: ${props => (props.hasValue&&!props.isOpen) || props.hovered? 'var(--strokepeach)' : props.disabled? 'var(--fainttext)' : 'black'};
    display: flex;
    align-items: center;
    /*outline: 1px solid var(--offwhitebg);*/
    transition: box-shadow .25s, background-color .25s, color .25s, transform .25s;
    white-space: nowrap;
    cursor: pointer;
`  

const DropdownWorkflow = styled(Dropdown)`
    &::before{
        content: '';
        right: 18px;
        margin-top: 3px;
        width: 0px;
        border: 7px solid transparent;
        border-top-color: ${props => props.hasValue && props.hovered? 'var(--strokepeach)' : props.hasValue&&!props.isOpen? 'var(--peach)' : props.isOpen || props.hovered? 'var(--strokepeach)' : 'var(--normtext)'};
        height: 0px;
        position: absolute;
    }
    &::after{
        content: '';
        right: 18px;
        margin-top: 3px;
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
const Icon = styled.div`
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
const IndicatorIcon = styled(Icon)`
    background-image: url(${indicatorIco});
    background-position: ${p => p.hasValue&&p.hovered&&!p.isOpen? '100% 50%' : p.hasValue&&!p.isOpen? '66.666% 50%' : p.hovered && !p.isOpen? '33.333% 50%' : '0% 50%'};
`
const CountyIcon = styled(Icon)`
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
    @observable hoveredWorkflow = null
    @action onHoverWorkflow = (which) => this.hoveredWorkflow = which

    // @observable raceSelectIsHovered = false
    // @action hoveredRaceSelect = (tf) => {this.raceSelectIsHovered = tf}

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
            console.log('clicked something outside the nav:', e.target)
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
                    onClick = {()=>openNav('indicator')}
                    hovered = {this.hoveredWorkflow === 'indicator' && this.props.open!=='indicator'}
                    hasValue = {indicator}
                    isOpen = {this.props.open==='indicator'}
                    onMouseEnter = {()=>{this.onHoverWorkflow('indicator')}} 
                    onMouseLeave = {()=>{this.onHoverWorkflow(null)}}
                    // offset = {open==='county'}
                >
                    <IndicatorIcon 
                        hovered = {this.hoveredWorkflow === 'indicator'}
                        hasValue = {indicator} 
                        isOpen = {this.props.open==='indicator'}
                    />
                    <SelectionValue>{store.indicator? semanticTitles[store.indicator].shorthand : 'Indicator' }</SelectionValue>
                </IndicatorSelect>
                <CountySelect 
                    // disabled = {!indicator}
                    onClick = {()=>openNav('county')}
                    hovered = {this.hoveredWorkflow === 'county' && this.props.open!=='county'}
                    hasValue = {county}
                    isOpen = {this.props.open==='county'}
                    onMouseEnter = {()=>{this.onHoverWorkflow('county')}} 
                    onMouseLeave = {()=>{this.onHoverWorkflow(null)}}
                    offset = {open}
                >
                    <CountyIcon 
                        hovered = {this.hoveredWorkflow === 'county'}
                        hasValue = {county} 
                        isOpen = {this.props.open==='county'}
                    />
                    <SelectionValueContainer>
                    <SelectionValue
                        hasValue = {county}
                        label = {store.county? countyLabels[store.county] : 'California'}
                        strikethrough = {county && this.hoveredWorkflow === 'countyStrikeout'}
                    >
                        {store.county? countyLabels[store.county] : 'California' }
                        
                    </SelectionValue>
                    {county &&
                    <QuickClear 
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
                        offset = {open}
                        selected = {race}
                        defaultWidth = {140}
                        disabled = {noRace}
                        toggleMode = {open && !noRace && screen==='optimal'}
                        options = {[
                            {label: 'All races', value: '', disabled: noall},
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
                        store = {store}
                        offset = { open && noRace? 1 : open? 2 : 0 }
                        onClick = {value => store.completeWorkflow('year',value)}
                        selected = {store.year}
                        bigscreen = {store.screen==='optimal'}
                    />

                    

                <FlipMove 
                    typeName = {null}
                    duration = {200}
                    enterAnimation = {{
                        from: {opacity: 0, transform: 'translateY(0px)'},
                        to: {opacity: 1, transform: 'translateY(0px)'}
                    }}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: 'translateY(0px)'},
                        to: {opacity: 0, transform: 'translateY(0px)'}
                    }}
                >
                {open && <PickingWorkflow x = {()=>openNav(false)} store = {store} open = {open} close = {()=>openNav(false)} />}
                </FlipMove>
                {/*open && <X onClick = {()=>openNav(false)}/>*/}
                
                <Reset 
                    className = 'negativeOnDark' 
                    label = {<BtnLabel>Reset<ResetIcon /></BtnLabel>}
                    visible = {indicator}
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

const xIcon = require('./assets/x.svg')
const peachX = require('./assets/peach-x.svg')

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
const QuickClear = styled.div`
    width: 15px; height: 15px;
    margin-bottom: 2px;
    margin-right: -5px;
    margin-left: 8px;
    flex-shrink: 0;
    background: url(${peachX}) no-repeat;
    &:hover{
        opacity: 1;
    }
    opacity: 0.5;
    transition: opacity .2s;
    
`
const YearToggle = (props) =>{
    const {indicator,county,race} = props.store
    const years = indicator? indicators[indicator].years.map((yr,i)=>{
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
                    options = {years}
                    onClick = {props.onClick}
                    selected = {props.selected}
                />
            }

    </YrToggle>
        
    
}
const YrToggle = styled.div`
    margin-left: 15px;
    transition: transform ${props=>props.bigscreen? .65 :.25}s;
    transform: translateX(${props=>props.offset===2 && props.bigscreen? 468 : (props.offset===2 && !props.bigscreen) || props.offset===1? 25: 0}px);
`

const LargeWorkflow = styled.div`
    position: absolute;
    top: 90px;
    background: var(--offwhitefg);
    border: 1px solid var(--bordergrey);
    z-index: 3;
    transform-origin: 0% 0%;
    @media ${media.optimal}{
        width: 1000px;
        height: 745px;
        padding: 30px 45px;
    }
    @media ${media.compact}{
        width: 780px;
        height: 585px;
        padding: 20px 35px;
    }
`

@observer
export class PickingWorkflow extends React.Component{

    @observable pageAnimDirection = 'left'
    @observable hoveredPageBtn = false

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

    render(){
        const {store, close} = this.props
        const which = this.props.open
        const {indicatorListPage, setIndicatorListPage, indicatorPages} = store
        const screen = store.screen
        return(
            <LargeWorkflow>
                <X onClick = {this.props.x} />  
                <FlipMove
                    // typeName = {null}
                    style = {{
                        position: 'absolute',
                        top: 0, left: 0,
                        padding: screen==='optimal'? '35px 50px' : '25px 35px',
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
                            animDir = {this.pageAnimDirection}
                            prevOffset = {this.hoveredPageBtn}
                            // animating = {this.animating}
                            // onStartAnim = {()=>{this.setAnimStatus(true)}}
                            // onFinishAnim = {()=>{this.setAnimStatus(false)}}
                        />
                    }
                    {which === 'county' && <CountyList store = {store} closeNav = {this.props.close}/>}
                </FlipMove>

                        <PageNext 
                            show = {which==='indicator' && indicatorListPage < indicatorPages.length-1 && !store.sanityCheck.indicator}
                            onClick = {
                                (e)=>this.handlePageChange(e,indicatorListPage+1)
                                
                            }
                            onMouseEnter = {()=>{this.onHoverPageBtn('next')}}
                            onMouseLeave = {()=>{this.onHoverPageBtn(false)}}   
                        />
                    
                        <PagePrev 
                            show = {which==='indicator' && indicatorListPage > 0 && !store.sanityCheck.indicator}
                            onClick = {
                                (e)=>this.handlePageChange(e,indicatorListPage-1)
                            
                            }
                            onMouseEnter = {()=>{this.onHoverPageBtn('prev')}}
                            onMouseLeave = {()=>{this.onHoverPageBtn(false)}} 
                        />
                    

            </LargeWorkflow>
        )
    }
}
const arrow = require('./assets/arrow.svg')

const PageBtn = styled.div`
    position: absolute;
    width: 50px; height: 95px; 
    border: 1px solid var(--fainttext);
    background: white;
    /*background-position: center;*/
    /*background-repeat: no-repeat;*/
    /*background-image: url(${arrow});*/
    top: 0; bottom: 0; margin: auto;
    // display: ${props => props.show? 'block' : 'none'};
    opacity: ${props => props.show? 1 : 0};
    transition: transform .25s, opacity .25s;
    cursor: pointer;
    z-index: 4;
    &::before, &::after{
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        mask-image: url(${arrow});
        mask-position: center;
        mask-repeat: no-repeat;
        transform-origin: 50% 50%;
    }
    &::before{
        background: var(--normtext);
        transition: opacity .25s;
    }
    &::after{
        background: var(--strokepeach);
        opacity: 0;
        clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
        transition: opacity .1s, clip-path .25s;
    }
    &:hover{
        &::before{
            opacity: 0.25;
        }
         &::after{
            opacity: 1;
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
    }
`
const PagePrev = styled(PageBtn)`
    left: -25px;
    transform: translateX(${props=>props.show?0:'15px'});
    &::before, &::after{
        transform: rotate(180deg);
    }
    &::after{
        /*clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);*/
    }
`
const PageNext = styled(PageBtn)`
    right: -25px;
    transform: translateX(${props=>props.show?0:'-15px'});
`
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
import semanticTitles from './assets/semanticTitles'

import CountyList from './components/CountyList'
import IndicatorList from './components/IndicatorList'

import media from './utilities/media'
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


`  

const DropdownWorkflow = styled(Dropdown)`

`
const IndicatorSelect = styled(DropdownWorkflow)`
    width: 350px;

    transform: ${props=>props.offset?'translateX(-15px)':''};

`
const CountySelect = styled(DropdownWorkflow)`
    width: 200px;
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

@observer
export default class ResponsiveNav extends React.Component{
    @observable raceDropdown = false
    @action openRaceDropdown = () => {
        if(this.props.init) return
        // this.props.closeSplash()
        this.raceDropdown = !this.raceDropdown
        // this.props.closeSplash()
    }

    componentDidUpdate(){
        if(this.props.open && this.raceDropdown) this.openRaceDropdown()
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
            <Nav>
                <Logo />
                <IndicatorSelect 
                    onClick = {()=>openNav('indicator')} 
                    // offset = {open==='county'}
                >
                    {store.indicator? semanticTitles[store.indicator].shorthand : init? 'Indicator' : 'Pick an indicator'}
                </IndicatorSelect>
                <CountySelect 
                    disabled = {!indicator}
                    onClick = {()=>openNav('county')}
                    offset = {open}
                >
                    {store.county? find(counties, (o)=>{return o.id===store.county}).label : init? 'County' : 'All counties' }
                </CountySelect>
                
                    <NormalDropdown
                        disabled = {!indicator} 
                        onClick = {!open? this.openRaceDropdown : ()=>{}} 
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

                    <Share>
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
                {open && <PickingWorkflow store = {store} open = {open} close = {()=>openNav(false)} />}
                </FlipMove>
                {open && <X onClick = {()=>openNav(false)}/>}
            </Nav>

        )
    }
}
const Share = styled.div`
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
        /*border: 1px solid green;*/
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

const X = styled.div`
    position: absolute;
    right: 30px;
    width: 50px;
    height: 50px;
    border: 1px solid red;

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
    transition: transform .5s;
    transform: translateX(${props=>props.offset? 335 : 0}px);
`

const LargeWorkflow = styled.div`
    position: absolute;
    overflow: hidden;
    top: 65px;
    background: white;
    border: 1px solid var(--bordergrey);
    padding: 30px;
    z-index: 3;
    @media ${media.optimal}{
        width: 1000px;
        height: 720px;
    }
    @media ${media.compact}{
        width: 780px;
        height: 575px;
    }
`

export class PickingWorkflow extends React.Component{
    render(){
        const {store, close} = this.props
        const which = this.props.open
        return(
            <LargeWorkflow> 
                <FlipMove
                    typeName = {null}
                    enterAnimation = {{
                        from: {opacity: 0, transform: `translateX(${which==='indicator'?-150:150}px)`},
                        to: {opacity: 1, transform: `translateX(0px)`},
                    }}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: `translateX(0px)`},
                        to: {opacity: -1, transform: `translateX(${which==='indicator'?150:-150}px)`},
                    }}
                >
                    {which === 'indicator' && <IndicatorList store = {store} closeNav = {this.props.close}/>}
                    {which === 'county' && <CountyList store = {store} closeNav = {this.props.close}/>}
                </FlipMove>
            </LargeWorkflow>
        )
    }
}
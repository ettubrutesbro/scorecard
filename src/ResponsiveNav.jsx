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


const Nav = styled.div`
z-index: 3;
    display: flex;
    align-items: center;
    @media ${media.optimal}{
        width: 1600px;
    }
    @media ${media.compact}{
        width: 1280px;
    }
`
const Dropdown = styled.div`
    position: relative;
    padding: 15px 45px 15px 20px;
    background: white;
    display: flex;
    align-items: center;
    outline: 1px solid var(--bordergrey);
    &::after{
        content: '';
        right: 15px;
        width: 15px;
        height: 15px;
        border: 1px solid black;
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
    transform: ${props=>props.offset?'translateX(15px)':''};
`
const NormalDropdown = styled(Dropdown)`
    width: 130px;
    transform: translateX(${props=>props.offset*15}px);
    &::before{
        content: '';
        position: absolute;
        border: none;
        z-index: 10;
    }
    background:${props => props.allRacesSelected? 'var(--faintpeach)' : 'white'};
    color: ${props => props.allRacesSelected?'var(--strokepeach)' : 'black'};
    outline-color: ${props => props.allRacesSelected?'var(--strokepeach)' : 'var(--bordergrey)'};
    ${props => props.allRacesSelected && props.mode==='vert'? `
        &::before{
            width: 100%;
            height: 0;
            left: 0; bottom: 1px;
            border-top: 1px solid var(--strokepeach);
        }
    ` : props.allRacesSelected && props.mode==='horz'? `
        &::before{
            height: 100%;
            width: 0;
            right: 29px; top: 0px;
            border-left: 1px solid var(--strokepeach);
        }
    `: ''}
`
const RaceList = styled.ul`
    width: calc(100% + 2px);
    border: 1px solid var(--bordergrey);
    background: white;
    position: absolute;
    z-index: 4;
    top: 45px;
    border-top: none;
    left: -1px;
    padding: 0;
    padding-top: 5px;
    margin: 0;
    transition: clip-path .2s;
    clip-path: ${props=>props.vertOpen? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'};
    &::after{
        content: '';
        width: 100%;
        height: 0;
        left: 0;
        border: none;
        border-bottom: 1px solid var(--bordergrey);
        position: absolute;
        top: 0;
        transition: transform .2s;
        transform: ${props=>props.vertOpen?'translateY(172px)':'translateY(0px)'};

    }
`
const Race = styled.li`
    list-style-type: none;
    padding: 12px 20px;
    ${props => props.disabled? `
       color: var(--inactivegrey);
    `: ''}
    outline: 1px solid ${props=>props.selected?'var(--strokepeach)': 'transparent'};
    color: ${props=>props.disabled? 'var(--inactivegrey)' : props.selected? 'var(--strokepeach)' : 'black'};
    background: ${props=> props.selected? 'var(--faintpeach)' : 'white'}

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
    clip-path: ${props=>props.open? 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)' : 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)'};
    

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

    color: ${props=>props.disabled? 'var(--inactivegrey)' : props.selected? 'var(--strokepeach)' : 'black'}
  

    ${props => props.disabled? `
       color: var(--inactivegrey);
    `: ''}

`

@observer
export default class ResponsiveNav extends React.Component{
    @observable raceDropdown = false
    @action openRaceDropdown = () => this.raceDropdown = !this.raceDropdown

    componentDidUpdate(){
        if(this.props.open && this.raceDropdown) this.openRaceDropdown()
    }

    render(){
        const {openNav, open, store} = this.props
        const {indicator, county, year, race} = store
        const ind = indicators[indicator]

        const noRace = indicator && !ind.categories.includes('hasRace')

        const noazn = indicator && county && (ind.counties[county].asian[year] === '' || ind.counties[county].asian[year]==='*')
        const noblk = indicator && county && (ind.counties[county].black[year] === '' || ind.counties[county].black[year]==='*')
        const noltx = indicator && county && (ind.counties[county].latinx[year] === '' || ind.counties[county].latinx[year]==='*')
        const nowht = indicator && county && (ind.counties[county].white[year] === '' || ind.counties[county].white[year]==='*')


        return(
            <Nav>
                <IndicatorSelect 
                    onClick = {()=>openNav('indicator')} 
                    // offset = {open==='county'}
                >
                    {store.indicator? semanticTitles[store.indicator].shorthand : 'Pick an indicator'}
                </IndicatorSelect>
                <CountySelect 
                    onClick = {()=>openNav('county')}
                    offset = {open}
                >
                    {store.county? find(counties, (o)=>{return o.id===store.county}).label : 'All counties' }
                </CountySelect>
                
                    <NormalDropdown 
                        onClick = {!open? this.openRaceDropdown : ()=>{}} 
                        offset = { open? 2 : 0 }
                        allRacesSelected = {(open || this.raceDropdown) && !race}
                        mode = {open? 'horz' : this.raceDropdown? 'vert' : ''}
                    >   <span onClick = {open || this.raceDropdown? ()=>store.completeWorkflow('race',null) : ()=>{}}>
                            {!open && !this.raceDropdown && store.race? capitalize(store.race) : 'All races'}
                        </span>
                        
                            <RaceList disabled = {noRace} vertOpen = {!noRace && this.raceDropdown && !open} >
                                <Race selected = {race==='asian'} disabled = {noazn} onClick = {!noazn?()=>store.completeWorkflow('race','asian'):()=>{}}> Asian </Race>
                                <Race selected = {race==='black'} disabled = {noblk} onClick = {!noblk?()=>store.completeWorkflow('race','black'):()=>{}}> Black </Race> 
                                <Race selected = {race==='latinx'} disabled = {noltx} onClick = {!noltx?()=>store.completeWorkflow('race','latinx'):()=>{}}> Latinx </Race> 
                                <Race selected = {race==='white'} disabled = {nowht} onClick = {!nowht?()=>store.completeWorkflow('race','white'):()=>{}}> White </Race> 
                            </RaceList>

                            <RaceToggle disabled = {noRace} open = {!noRace && open} >
                                <HorzRace selected = {race==='asian'} disabled = {noazn} index = {0} open = {open} onClick = {!noazn?()=>store.completeWorkflow('race','asian'):()=>{console.log('nazn')}}> Asian </HorzRace>
                                <HorzRace selected = {race==='black'} disabled = {noblk} index = {1} open = {open} onClick = {!noblk?()=>store.completeWorkflow('race','black'):()=>{}}> Black </HorzRace>
                                <HorzRace selected = {race==='latinx'} disabled = {noltx} index = {2} open = {open} onClick = {!noltx?()=>store.completeWorkflow('race','latinx'):()=>{}}> Latinx </HorzRace>
                                <HorzRace selected = {race==='white'} disabled = {nowht} index = {3} open = {open} onClick = {!nowht?()=>store.completeWorkflow('race','white'):()=>{}}> White </HorzRace>
                            </RaceToggle>

                        
                    </NormalDropdown>
                    <YearToggle 
                        store = {store}
                        offset = { open? 2 : 0 }
                        onClick = {value => store.completeWorkflow('year',value)}
                        selected = {store.year}
                    />
                    
                        

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
    top: 75px;
    background: white;
    border: 1px solid var(--bordergrey);
    padding: 30px;
    z-index: 3;
    @media ${media.optimal}{
        width: 1000px;
    }
    @media ${media.compact}{
        width: 780px;
        height: 640px;
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
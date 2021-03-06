
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {findDOMNode} from 'react-dom'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import {find, findIndex} from 'lodash'

import FlipMove from 'react-flip-move'

import {Toggle, Button, Tooltip, Tip} from './generic'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import countyLabels from '../assets/countyLabels'
import {capitalize} from '../utilities/toLowerCase'
import {isValid} from '../utilities/isValid'
// import semanticTitles from '../assets/semanticTitles'

import media, {getMedia} from '../utilities/media'
import Icon from './generic/Icon'

const IndRows = styled.ul`
    position: relative;
    padding: 0; 
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    margin: 0;
    @media ${media.optimal}{
        margin-top: 10px;
    }
    @media ${media.compact}{
        margin-top: 5px;
    }
    opacity: ${props => props.raceDropdown? 0.4 : 1};
    transition: opacity .5s;
`
const RowItem = styled.li`
    /*flex-grow: ${props => props.lastPage||props.isolated? 0 : 1};*/
    position: relative;
    // width: 50%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    @media ${media.optimal}{
        padding: 15px 30px;
    }
    @media ${media.compact}{
        padding: 10px 25px;
    }
    white-space: normal;
    // margin: 10px;
    list-style-type: none;
    border: 1px solid ${props=> props.muted && !props.disabled? '#DFDFDF' : props.disabled&&!props.isolated? 'transparent' : props.selected? 'var(--strokepeach)' : 'var(--bordergrey)'};
    color: ${props=> props.selected? 'var(--strokepeach)' : props.disabled&&!props.isolated? 'var(--fainttext)' : 'black'};
    background: ${props => props.muted||(props.disabled&&!props.isolated)? 'transparent' : props.selected? 'var(--faintpeach)' : 'white'};
    transition: border-color .2s, background-color .2s ${props=>props.muted||props.disabled?', color .2s':''};
    /*transform: translateY(-${props => props.index * 1}px);*/
    /*margin-top: ${props=>props.isolated?10:-1}px;*/
    margin-top: -1px;
    z-index: ${props=>props.isolated?10:props.selected? 2: 1};
    pointer-events: ${props => props.muted? 'none' : 'auto'};
    cursor: pointer;
    &:hover{
        color: ${props => props.isolated? 'var(--normtext)' : 'var(--strokepeach)'};
        h4{
            color: ${props => props.disabled? 'var(--fainttext)' : 'var(--peach)'};
        }
    }

    // box-shadow: var(--shadow);

` 
class Row extends React.Component{
    render(){
        const {children, ...restOfProps} = this.props
        return(
            <RowItem className = "listitem" {...restOfProps}> {children} </RowItem>
        )
    }
}


const IndLeft = styled.div`
    // font-size: 16px;
    line-height: 150%;
    transition: opacity .25s;
    opacity: ${p => p.muted? 0.2 : 1};
`

const Years = styled.h4`
    display: inline;
    font-weight: normal;
    margin: 0;
    margin-left: 8px;
    margin-right: 7px;
    font-size: 13px;
    // color: var(--fainttext);
`

const Percentage = styled.div`
    /*margin-top: -2px;*/
    transition: opacity .25s;
    opacity: ${p => p.muted? 0.2 : 1};
    margin-left: 20px;
    @media ${media.optimal}{
        font-size: 24px;
        font-weight: normal;
        min-height: 35px;
    }
    @media ${media.compact}{
        font-weight: 500;
        font-size: 16px;
    }
    letter-spacing: .0rem;
    min-width: 45px;
    display: flex;
    justify-content: flex-end;
    display: flex;
    align-items: center;
`
const indicatorFilterOptions = [
    {label: getMedia()==='optimal'?'All topics':'All', value: 'all'},
    {label: 'Health', value: 'health'},
    {label: 'Education', value: 'education'},
    {label: 'Child Welfare', value: 'welfare'},
    {label: 'Early Childhood', value: 'earlyChildhood'},
]


const ToggleBlock = styled.div`

`
const Caption = styled.div`
    color: var(--fainttext);
    font-size: 13px;
    margin-bottom: 2px;
`
const Title = styled.h1`
    /*height: 32px; flex-shrink: 0;*/
    position: relative;
    display: flex; align-items: center;
    margin: 0 20px 0 0;
        opacity: ${props=>props.raceDropdown? 0.4 : props.muted?0.2:1};
    transition: opacity .5s;
    font-weight: 400;
    @media ${media.optimal}{
        font-size: 24px;
    }
    @media ${media.compact}{
        font-size: 24px;
    }
`
const ChoosePrompt = styled.span`
    opacity: ${props => props.hide? 0: 1};
    transform: translateX(${props => props.hide?-20:0}px);
    transition: opacity .35s, transform .35s;
    transition-delay: ${props=>props.hide?0:.15}s;

`
const Search = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    font-size: 13px;
    color: var(--fainttext);
    fill: var(--bordergrey);
    cursor: text;
    position: absolute;
    transition: transform .5s, fill .2s;
    height: 36px;
    &::after{
        position: absolute;
        bottom: 0;
        border-bottom: 1px solid var(--bordergrey);
        content: '';
        transform-origin: 0% 50%;
        transform: scaleX(${props=>props.active?1:0});
        transition: transform .5s, border-color .2s;
    }
    ${props => props.inputFocused? `
        fill: var(--fainttext);
        &::after{
            border-bottom-color: var(--fainttext);
        }
    ` : !props.active? `
        &:hover{
            color: var(--strokepeach);
            fill: var(--peach);
        }
    `: ''}
    @media ${media.optimal}{
        left: 250px;
        width: 400px;
        transform: translateX(${props=>props.active?-250:0}px);
        &::after{ width: 400px; }
    }
    @media ${media.compact}{
        left: 250px;
        width: 375px;
        transform: translateX(${props=>props.active?-250:0}px);
        &::after{ width: 375px; }
    }

`
const SearchIcon = styled(Icon)`
    width: 18px; 
    height: 18px;
    /*margin-right: 6px;*/
`
const SearchPrompt = styled.span`
    margin-left: 6px;
`
const SearchInput = styled.input`
    position: absolute;
    border: none;
    left: 20px;
    appearance: none;
    outline: none;
    font-size: 16px;
    background: none;
    margin-left: 5px;
    padding-left: 0px;
    letter-spacing: 0.7px;
    width: calc(100% - 20px);

`
const CancelSearch = styled.div`
    position: absolute;
    right: -10px;
    color: var(--strokepeach);
    font-size: 13px;
    letter-spacing: .5px;
    margin-left: 20px;
    transition: opacity .25s, transform .25s;
    transform: ${props => props.hide? 'translateX(0)' : 'translateX(100%)'};
    transition-delay: ${props => props.hide? 0 : 0.25}s;
    opacity: ${props => props.hide? 0 : 1};
    pointer-events: ${props => props.hide? 'none' : 'auto'};
    cursor: pointer;
`

const Label = styled.div`
    font-size: 16px;

`


@observer
export default class IndicatorList extends React.Component{

    @observable isolated = null
    @observable sanityCheckPosition = 0
    @observable sanityCheckSide = 'below'
    @observable animating = false
    @observable interrupt = false

    @action setAnimating = (tf) => {
        // console.log('animating: ', tf)
        this.animating = tf
    }
    @action setInterrupt = (tf) => {this.interrupt = tf}
    @action isolate = (val) => {this.isolated = val}

    @action handleSelection = (e,ind,i) => {
        const {store} = this.props
        if(store.sanityCheck.indicator) return
        const screen = getMedia()
        // console.log('attempting to select', ind)
        // this.isolate(ind)
        const select = this.props.store.completeWorkflow('indicator',ind)
        if(select) this.props.closeNav() //went through
        else{
            const target = document.getElementById(ind+'row') //e.target
            if(i+1 > store.indicatorPageSize/2){ //bottom half of page, appear above

                //container height minus top/y of selected item = differencte on bottom side
                const containerHeight = this.list.current.getBoundingClientRect().height
                this.sanityCheckSide = 'above'
                this.sanityCheckPosition = 0
            } 
            else{ //top half of page, appear below
                // console.log('set pos', e.target.getBoundingClientRect().y)
                this.sanityCheckSide = 'below'
                this.sanityCheckPosition = target.offsetHeight
            }

        }
        // this.props.closeNav()
    }

    constructor(){
        super()
        this.list = React.createRef()
        this.searchInput = React.createRef()
    }

    componentDidUpdate(){
        if(this.props.focusInput){
            console.log('ind focus updated')
            this.searchInput.current.focus()
            window.onkeyup = (e) => {
                if(e.key==='Escape'||e.key==='Esc'){
                    this.props.onSearch('') //clears string
                    this.searchInput.current.blur()
                }
            }
        }
        else{
            this.searchInput.current.blur()
        }
    }

    render(){
        const {store, animDir, prevOffset} = this.props
        const {county, race, indicatorFilter} = store
        const page = store.indicatorPages[store.indicatorListPage]

        const indRangeEnd = (store.indicatorListPage+1)*store.indicatorPageSize
        const numInds = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            if(!store.indicatorSearchResults) return false
            if(store.indicatorSearchString && store.indicatorSearchResults.length === 0) return false
            if(store.indicatorSearchString && store.indicatorFilter === 'all'){
                return store.indicatorSearchResults.includes(ind)
            }
            else if(store.indicatorSearchString){
                return store.indicatorSearchResults.includes(ind) && cats.includes(store.indicatorFilter)
            }
            else return store.indicatorFilter === 'all'? true : cats.includes(store.indicatorFilter)
        }).length

        const showSanityCheck = store.sanityCheck.indicator
        // console.log('sanity', showSanityCheck)
        const searchActive = this.props.focusInput || this.props.searchString

        return(
            <Workflow>


            <Title
                muted = {showSanityCheck}
                raceDropdown = {this.props.muted}
            > 
                <ChoosePrompt
                    hide = {searchActive}
                >
                    Choose an indicator. 
                </ChoosePrompt>
                <Search
                    active = {searchActive} 
                    inputFocused = {this.props.focusInput}
                    onClick = {()=> this.props.setSearchFocus(true)}
                >
                    <SearchIcon img = "searchzoom" />
                    {!this.props.searchString && 
                        <SearchPrompt>Type to search...</SearchPrompt>
                    }
                    <SearchInput
                        ref = {this.searchInput}
                        onFocus = {()=> this.props.setSearchFocus(true)}
                        onBlur = {()=> this.props.setSearchFocus(false)}
                        value = {this.props.searchString}
                        onChange = {(e)=> this.props.onSearch(e.target.value)}
                    />
                    <CancelSearch 
                        hide = {!this.props.searchString}
                        onClick = {()=>this.props.onSearch('')}
                    >
                        Cancel
                    </CancelSearch>
                </Search>
            </Title>
            <ListStatus 
                muted = {showSanityCheck}
                raceDropdown = {this.props.muted}
                className = "caption"
            >
                <Toggle
                    options = {indicatorFilterOptions}
                    onClick = {store.setIndicatorFilter}
                    selected = {findIndex(indicatorFilterOptions,(o)=>{return o.value===store.indicatorFilter})}
                />
                 <Readout>
                   <AboutPcts>
                       {`${county?countyLabels[county]:'Statewide'} %'s for ${race==='other'?'other race':race?capitalize(race):'all race'}s`}
                    </AboutPcts> 
                    {numInds > 0 &&
                        <React.Fragment>
                           Viewing {(store.indicatorPageSize * store.indicatorListPage)+1} 
                           &#8212; 
                           {indRangeEnd > numInds? numInds : indRangeEnd}
                            &nbsp;of {numInds}
                        </React.Fragment>
                    } 
                    {numInds === 0 &&
                        <React.Fragment>
                            No results
                        </React.Fragment>
                    }
                    

                </Readout>
            </ListStatus>
                                
            <IndRows 
                raceDropdown = {this.props.muted}
                ref = {this.list}
            >
                {!page &&
                        <EmptyPage>
                            <h1>No indicators seem to match &ldquo;{store.indicatorSearchString}&rdquo;.</h1>
                            <h2> Try different keywords or browsing by topic. </h2>
                        </EmptyPage>
                    }
                <FlipMove
                    typeName = {null}
                    duration = {300}
                    staggerDelayBy = {12}
                    style = {{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                    maintainContainerHeight = {true}
                    duration = {250}
                    // leaveAnimation = {{
                    //     from: {opacity: 1, transform: 'translateX(0)'},
                    //     to: animDir==='left'?{opacity: 0, transform: `translateX(-150px)`}
                    //         : {opacity: 0, transform: 'translateX(150px)'}
                    // }}
                    leaveAnimation = {null}
                    enterAnimation = {{
                        from: {opacity: 0, transform: `translateX(${animDir==='left'?150:-150}px)`},
                        to: {opacity: 1, transform: 'translateX(0px)'}
                    }}
                    onStartAll = {()=>{
                        if(this.animating) this.setInterrupt(true)
                        this.setAnimating(true)
                    }}
                    onFinishAll = {()=>{
                        this.setAnimating(false)
                        if(this.interrupt) this.setInterrupt(false)
                    }}
                >   

                    {page && page.map((ind, i, arr)=>{
                        const indicator = indicators[ind]
                        const cats = indicator.categories
                        const selected = this.props.store.indicator === ind
                        const noRace = !cats.includes('hasRace')

                        const noRaceNeedRace = noRace && race
                        let valArr
                        let val
                        if(!noRaceNeedRace && indicator.counties[county||'california'][race||'totals']){
                            valArr = indicator.counties[county||'california'][race||'totals'].filter((v)=>{return isValid(v)})
                        }
                        else{
                            valArr = indicator.counties[county||'california'].totals.filter((v)=>{return isValid(v)})
                        }
                        if(valArr.length > 0 ){
                            val = valArr[valArr.length-1]
                        }
                        else val = ''
                        // val = val && val!=='*'? val[val.length-1] : ''

                        const disabled = (county && !val) || (county && val==='*') || noRaceNeedRace

                        const missingCounties = true
                        const isolated = ind === showSanityCheck


                        return (
                            <Row
                                index = {i}
                                selected = {selected}
                                isolated = {isolated}
                                id = {ind+'row'}
                                key = {ind+'row'}
                                // noRaceNeedRace = {noRace && race}
                                muted = {showSanityCheck && !isolated}
                                disabled = {disabled}
                                lastPage = {store.indicatorListPage === store.indicatorPages.length-1}
                                onClick = {(e)=>{
                                    if(!isolated) this.handleSelection(e,ind, i)
                                }}
                            > 
                                <IndLeft muted = {showSanityCheck && !isolated}>
                                        <IndLabel>{indicator.semantics.label}</IndLabel>
                                        {noRace &&
                                            <NoRaceBadge needRace = {noRaceNeedRace}> No Race Data </NoRaceBadge>
                                        }
                                </IndLeft>
                                <Percentage muted = {showSanityCheck && !isolated}>
                                    {!disabled && val+'%'}
                                    {disabled && '\u2014\u2014'}
                                </Percentage>
                                    {isolated &&
                                        <SanityCheck 
                                            key = {showSanityCheck+'sanitycheck'}
                                            store = {store} 
                                            yPos = {this.sanityCheckPosition}
                                            side = {this.sanityCheckSide} 

                                        />
                                    }
                            </Row>
                        ) 
                    })}


                    </FlipMove>

            </IndRows>
             
                
            
            </Workflow>
        )
    }
}

const EmptyPage = styled.div`
    position: absolute;
    text-align: center;
    @media ${media.optimal}{
        top: 130px;
    }
    @media ${media.compact}{
        top: 130px;
    }
    width: 100%;
    color: var(--fainttext);
    align-items: center;
    justify-content: center;
    h1{
        font-weight: 500;
        font-size: 24px;
        letter-spacing: .92px;
        margin: 0;
    }
    h2{
        margin: 10px;
        font-weight: 400;
        font-size: 16px;
        letter-spacing: .7px;
    }

`

@observer
class SanityCheck extends React.Component{
    constructor(){
        super()
        this.sanityCheck = React.createRef()
    }
    handleClick = (e) => {
        // console.log(this.sanityCheck)
        if(this.props.store.sanityCheck.indicator){
            if(!findDOMNode(this.sanityCheck.current).contains(e.target)){
                this.props.store.clearSanityCheck('indicator')
            }
        }
    }
    componentDidMount(){
        document.addEventListener('click', this.handleClick)
    }
    componentWillUnmount(){
        // console.log('unmounting sanitycheck')
        document.removeEventListener('click', this.handleClick)
    }

    render(){
        const {yPos, store, side} = this.props
        const data = store.sanityCheck
        const screen = store.screen
        const xPos = screen==='optimal'? 464 : 300
        return(
            <ModTip
                ref = {this.sanityCheck} 
                pos = {{x: screen==='optimal'? -15 : -10, y: this.props.yPos}}
                direction = {side}
                // verticalAnchor = {side==='above'?'bottom':'top'}
                horizontalAnchor = 'right'
                duration = {'.35s'}
                className = 'actionable'
            >
            <Check>
                {data.message}
                <SanityControls>
                    <Button 
                        className = {screen==='compact'?'compact':''}
                        label = 'Nevermind, back to list' 
                        style = {{marginRight: '15px'}}
                        onClick = {(e)=>{
                            store.clearSanityCheck('indicator')
                            e.nativeEvent.stopImmediatePropagation()
                        }}
                    />
                    <Button 
                        label = 'Yes, continue' 
                        className = {`dark ${screen}`} 
                        onClick = {()=>{
                            data.action()
                            store.clearSanityCheck('indicator')
                        }}

                    />
                </SanityControls>
            </Check>
            </ModTip>
        )
    }
}

const ModTip = styled(Tip)`
    cursor: auto;
    margin-top: ${p=>p.direction==='above'?-20:20}px;
    transform-origin: ${p=>p.direction==='above'?'50% 100%':'50% 0%'}; 
    &::after{
        left: calc(50% - 9.5px);
        ${p=>p.direction==='above'? 'bottom' : 'top'}: -19px;
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 9.5px solid transparent;
    }
    &::before{
        left: calc(50% - 10.5px);
        ${p=>p.direction==='above'? 'bottom' : 'top'}: -21.5px;
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 10.5px solid transparent;
    }
        &::before { border-${p => p.direction === 'above'? 'top' : 'bottom'}: 10.5px var(--bordergrey) solid; }
        &::after{ border-${p => p.direction === 'above'? 'top' : 'bottom'}: 9.5px var(--offwhitefg) solid;  }
        animation: ${p=>p.direction==='above'? tooltipabove : tooltipanim} .3s forwards;
`       


const tooltipanim = keyframes`
    from {
        opacity: 0; 
        transform: scale(0.8) translateY(-60px);
        /*clip-path: polygon(0% -10%, 100% -10%, 100% 0%, 0% 0%);*/
    }
    to {
        opacity: 1;
        transform: translateY(0);
        /*clip-path: polygon(0% -10%, 100% -10%, 100% 100%, 0% 100%);*/
    }
`
const tooltipabove = keyframes`
    from {
        opacity: 0; 
        transform: scale(0.8) translateY(-100%) translateY(60px);
        /*clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);*/
    }
    to {
        opacity: 1;
        transform: translateY(-100%) translateY(0);
        /*clip-path: polygon(0% 0%, 100% 0%, 100% 110%, 0% 110%);*/
    }
`

const SanityControls = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const Check = styled.div`
    width: 480px;
    line-height: 180%;
    @media ${media.optimal}{
        font-size: 16px;
        padding: 30px;
    }
    @media ${media.compact}{
        font-size: 13px;
        padding: 20px;
    }
`

const Dashes = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 16px;
    align-items: flex-end;
`

const Workflow = styled.div`
`

const ListStatus = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: ${props=>props.raceDropdown? 0.4 : props.muted?0.2:1};
    transition: opacity .5s;
    font-size: 13px;
    height: 65px;
    flex-shrink: 0;
`


const Readout = styled.div `
    text-align: right;
    color: var(--fainttext);
`
const Strong = styled.span`
    color: var(--normtext);
    font-weight: 500;
`
const AboutPcts = styled.div`
    
    color: var(--normtext);
    margin-bottom: 2px;
`
const IndLabel = styled.span`
    margin-right: 7px;
`
const NoRaceBadge = styled.div`
    color: ${props => props.needRace? 'var(--normtext)' : 'var(--fainttext)'};
    /*border-bottom: 1px solid var(--bordergrey);*/
    /*padding: 1.5px 7px;*/
    /*margin-left: 7px;*/
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    letter-spacing: 0.75px;
`

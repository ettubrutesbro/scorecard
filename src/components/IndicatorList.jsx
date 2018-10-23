
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {findDOMNode} from 'react-dom'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import {find, findIndex} from 'lodash'

import FlipMove from 'react-flip-move'

import {Search, Toggle, Button, Tooltip, Tip} from './generic'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import countyLabels from '../assets/countyLabels'
import {capitalize} from '../utilities/toLowerCase'
import {isValid} from '../utilities/isValid'
import semanticTitles from '../assets/semanticTitles'

import media, {getMedia} from '../utilities/media'

const IndRows = styled.ul`
    position: relative;
    padding: 0; 
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    margin: 0;

`
const RowItem = styled.li`
    &:first-of-type{
        border-radius: 4px 4px 0 0;
    }
    &:last-of-type{
        border-radius: 0 0 4px 4px;
    }
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
    cursor: ${props=>props.disabled? 'auto' : 'pointer'};

    &:hover{
        color: ${props => props.isolated? 'var(--normtext)' : props.disabled? 'var(--fainttext)' : 'var(--strokepeach)'};
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
    {label: 'Welfare', value: 'welfare'},
    {label: 'Early Childhood', value: 'earlyChildhood'},
]

const SearchIndicators = styled.input`
    appearance: none;
    position: relative;
    padding: 10px 20px 10px 45px;
    border: none;
    outline: none;
    border-bottom: 1px solid var(--bordergrey);
`
const ToggleBlock = styled.div`

`
const Caption = styled.div`
    color: var(--fainttext);
    font-size: 13px;
    margin-bottom: 2px;
`
const Title = styled.h1`
    margin: 0 20px 0 0;
        opacity: ${props=>props.muted?0.2:1};
    transition: opacity .5s;
    font-weight: 400;
    @media ${media.optimal}{
        font-size: 24px;
    }
    @media ${media.compact}{
        font-size: 24px;
    }
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
    }

    render(){
        const {store, animDir, prevOffset} = this.props
        const {county, race, indicatorFilter} = store
        // const page = this.pages[this.currentPage]
        // console.log(store.indicatorPages.toJS())
        // console.log(store.indicatorListPage)
        const page = store.indicatorPages[store.indicatorListPage]
        // console.log(page)

        // this.props.setNumPages(this.pages.length)

        const indRangeEnd = (store.indicatorListPage+1)*store.indicatorPageSize
        const numInds = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            return indicatorFilter === 'all'? true : cats.includes(indicatorFilter)
        }).length

        const showSanityCheck = store.sanityCheck.indicator
        // console.log('sanity', showSanityCheck)

        return(
            <Workflow>


            <Title
                muted = {showSanityCheck}
            > Choose an indicator. </Title>
                {/* 
                <Search 
                    placeholder = "Search indicators..."
                />
                */}

            <ListStatus 
                muted = {showSanityCheck}
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
                   Viewing {(store.indicatorPageSize * store.indicatorListPage)+1} 
                   &#8212; 
                   {indRangeEnd > numInds? numInds : indRangeEnd}
                    &nbsp;of {numInds}
                    

                </Readout>
            </ListStatus>
            <IndRows ref = {this.list}>
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
                    {page.map((ind, i, arr)=>{
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
                                        {semanticTitles[ind].label}
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

@observer
class SanityCheck extends React.Component{
    constructor(){
        super()
        this.sanityCheck = React.createRef()
    }
    handleClick = (e) => {
        // console.log(this.sanityCheck)
        if(!findDOMNode(this.sanityCheck.current).contains(e.target)){
            this.props.store.clearSanityCheck('indicator')
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
    height: 100%;
    display: flex;
    flex-direction: column;
`

const ListStatus = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: ${props=>props.muted?0.2:1};
    transition: opacity .5s;
    font-size: 13px;
    @media ${media.optimal}{
        margin-top: 10px;
        margin-bottom: 15px;
    }
    @media ${media.compact}{
        margin-top: 12px;
        margin-bottom: 15px;
    }
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
const NoRaceBadge = styled.div`
    color: ${props => props.needRace? 'var(--normtext)' : 'var(--fainttext)'};
    /*border-bottom: 1px solid var(--bordergrey);*/
    /*padding: 1.5px 7px;*/
    margin-left: 7px;
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    letter-spacing: 0.75px;
`

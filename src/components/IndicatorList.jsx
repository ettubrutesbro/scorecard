
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import {find, findIndex} from 'lodash'

import FlipMove from 'react-flip-move'

import {Search, Toggle, Button, Tooltip} from './generic'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import countyLabels from '../assets/countyLabels'
import {capitalize} from '../utilities/toLowerCase'
import semanticTitles from '../assets/semanticTitles'

import media, {getMedia} from '../utilities/media'

const IndRows = styled.ul`
    padding: 0; 
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    margin: 0;

`
const RowItem = styled.li`
    flex-grow: ${props => props.lastPage||props.isolated? 0 : 1};
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
    border: 1px solid ${props=> props.disabled&&!props.isolated? 'transparent' : props.selected? 'var(--strokepeach)' : 'var(--bordergrey)'};
    color: ${props=> props.selected? 'var(--strokepeach)' : props.disabled&&!props.isolated? 'var(--fainttext)' : 'black'};
    background: ${props => props.muted||(props.disabled&&!props.isolated)? 'transparent' : props.selected? 'var(--faintpeach)' : 'white'};
    opacity: ${props=>props.muted?0.2:1};
    transition: opacity .5s;
    /*transform: translateY(-${props => props.index * 1}px);*/
    /*margin-top: ${props=>props.isolated?10:-1}px;*/
    margin-top: -1px;
    z-index: ${props=>props.selected? 2: 1};
    cursor: pointer;
    &:hover{
        color: ${props => props.disabled? 'var(--fainttext)' : 'var(--strokepeach)'};
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
    @action isolate = (val) => {this.isolated = val}


    @action handleSelection = (e,ind,i) => {
        const {store} = this.props
        const screen = getMedia()
        // console.log('attempting to select', ind)
        // this.isolate(ind)
        const select = this.props.store.completeWorkflow('indicator',ind)
        if(select) this.props.closeNav() //went through
        else{
            console.log(e.target.getBoundingClientRect())
            if(i+1 >= store.indicatorPageSize/2){ //bottom half of page, appear above

                //container height minus top/y of selected item = differencte on bottom side
                const containerHeight = this.list.current.getBoundingClientRect().height
                console.log('set pos', containerHeight - e.target.getBoundingClientRect().y)
                this.sanityCheckSide = 'above'
                this.sanityCheckPosition = containerHeight - e.target.getBoundingClientRect().y + screen==='optimal'?50:20
            } 
            else{ //top half of page, appear below
                console.log('set pos', e.target.getBoundingClientRect().y)
                this.sanityCheckSide = 'below'
                this.sanityCheckPosition = e.target.getBoundingClientRect().y - (screen==='optimal'?100:130)
            }

        }
        // this.props.closeNav()
    }

    constructor(){
        super()
        this.list = React.createRef()
    }

    render(){
        const {store} = this.props
        const {county, race, indicatorFilter} = store
        // const page = this.pages[this.currentPage]
        console.log(store.indicatorPages.toJS())
        console.log(store.indicatorListPage)
        const page = store.indicatorPages[store.indicatorListPage]
        console.log(page)

        // this.props.setNumPages(this.pages.length)

        const indRangeEnd = (store.indicatorListPage+1)*store.indicatorPageSize
        const numInds = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            return indicatorFilter === 'all'? true : cats.includes(indicatorFilter)
        }).length

        console.log(store.indicatorFilter)

        return(
            <Workflow>


            <Title
                muted = {store.sanityCheck.indicator}
            > Choose an indicator. </Title>
                {/* 
                <Search 
                    placeholder = "Search indicators..."
                />
                */}

            <ListStatus 
                muted = {store.sanityCheck.indicator}
                className = "caption"

            >
                <Toggle
                    options = {indicatorFilterOptions}
                    onClick = {store.setIndicatorFilter}
                    selected = {findIndex(indicatorFilterOptions,(o)=>{return o.value===store.indicatorFilter})}
                />
                 <Readout>
                   <AboutPcts>
                       {`${county?countyLabels[county]:'Statewide'} %s for ${race==='other'?'other race':race?capitalize(race):'all race'}s`}
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
                    staggerDelayBy = {10}
                    style = {{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                    maintainContainerHeight = {true}
                    duration = {250}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: 'translateX(0)'},
                        to: {opacity: 0, transform: 'translateX(-150px)'}
                    }}
                    enterAnimation = {{
                        from: {opacity: 0, transform: 'translateX(150px)'},
                        to: {opacity: 1, transform: 'translateX(0px)'}
                    }}
                    onStartAll = {()=>this.props.setReady(false)}
                    onFinishAll = {()=>this.props.setReady(true)}
                    // onStartAll = {this.animationStarted}
                    // disableAllAnimations = {this.stillAnimating}
                    // onFinishAll = {this.doneAnimating}
                >
                    {page.map((ind, i)=>{
                        const indicator = indicators[ind]
                        const cats = indicator.categories
                        const selected = this.props.store.indicator === ind
                        const noRace = !cats.includes('hasRace')

                        const noRaceNeedRace = noRace && race

                        let val = indicator.counties[county||'california'][race||'totals']
                        val = val && val!=='*'? val[val.length-1] : ''

                        const disabled = (county && !val) || (county && val==='*') || noRaceNeedRace

                        const missingCounties = true
                        const isolated = ind === store.sanityCheck.indicator


                        return (
                            <Row
                                index = {i}
                                selected = {selected}
                                isolated = {isolated}
                                key = {ind}
                                // noRaceNeedRace = {noRace && race}
                                muted = {store.sanityCheck.indicator && !isolated}
                                disabled = {disabled}
                                lastPage = {store.indicatorListPage === store.indicatorPages.length-1}
                                onClick = {(e)=>{
                                    // if(!cats.includes('hasRace')&&race) this.props.store.completeWorkflow('race',null)
                                    // this.props.store.completeWorkflow('indicator',ind)
                                    this.handleSelection(e,ind, i)
                                    // this.isolateIndicator(ind)
                                }}
                            > 
                                <IndLeft>
                                        {semanticTitles[ind].label}
                                        <Years className = "caption">
                                            {indicator.years.map((yr)=>{
                                                return yr
                                            }).join(',\xa0')}
                                        </Years>
                                        {noRace &&
                                            <NoRaceBadge needRace = {noRaceNeedRace}> No Race Data </NoRaceBadge>
                                        }
                                </IndLeft>
                                <Percentage>
                                    {!disabled && val+'%'}
                                    {disabled && '\u2014\u2014'}
                                </Percentage>
                            </Row>
                        ) 
                    })}
                    {store.sanityCheck.indicator &&
                        <SanityCheck 
                            store = {store} 
                            yPos = {this.sanityCheckPosition}
                            side = {this.sanityCheckSide} 

                        />
                    }
                    </FlipMove>
            </IndRows>
             
                
            
            </Workflow>
        )
    }
}

@observer
class SanityCheck extends React.Component{
    render(){
        const {yPos, store, side} = this.props
        const data = store.sanityCheck
        const screen = getMedia()
        const xPos = screen==='optimal'? 464 : 300
        return(
            <Tooltip 
                pos = {{x: screen==='optimal'? -20 : -10, y: this.props.yPos}}
                direction = {side}
                verticalAnchor = {side==='above'?'bottom':'top'}
                horizontalAnchor = 'right'
                customAnimation = {side === 'below'? tooltipanim : tooltipabove}
                duration = {'.35s'}
                theme = 'actionable'
            >
            <Check>
                {data.message}
                <SanityControls>
                    <Button 
                        className = 'compact'
                        label = 'Nevermind, back to list' 
                        style = {{marginRight: '15px'}}
                        onClick = {()=>{console.log('close sanity check')}}
                    />
                    <Button 
                        label = 'Yes, continue' 
                        className = 'dark compact' 
                        onClick = {data.action}
                    />
                </SanityControls>
            </Check>
            </Tooltip>
        )
    }
}

const tooltipanim = keyframes`
    from {
        opacity: 0; 
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`
const tooltipabove = keyframes`
    from {
        opacity: 0; 
        transform: translateY(-100%) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(-100%) translateY(0);
    }
`

const SanityControls = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const Check = styled.div`
    /*margin-top: 25px;*/
    /*background: var(--offwhitefg);*/
    width: 480px;
    line-height: 180%;
    /*padding: 30px;*/
    /*border: 1px solid var(--bordergrey);*/
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
    border: 1px solid var(--bordergrey);
    padding: 1.5px 7px;
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    letter-spacing: 0.75px;
`

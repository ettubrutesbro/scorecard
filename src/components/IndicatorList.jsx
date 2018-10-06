
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import {find, findIndex} from 'lodash'

import FlipMove from 'react-flip-move'
import Toggle from './Toggle'

import {Search} from './generic'

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
    background: ${props => props.disabled&&!props.isolated? 'transparent' : props.selected? 'var(--faintpeach)' : 'white'};
    /*transform: translateY(-${props => props.index * 1}px);*/
    margin-top: ${props=>props.isolated?25:-1}px;
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
    @action isolate = (val) => {this.isolated = val}

    handleSelection = (ind) => {
        // console.log('attempting to select', ind)
        // this.isolate(ind)
        this.props.store.completeWorkflow('indicator',ind)
        // this.props.closeNav()
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


                <Title> Choose an indicator. </Title>
                {/* 
                <Search 
                    placeholder = "Search indicators..."
                />
                */}

            <ListStatus className = "caption">
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
            <IndRows>
                <FlipMove
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
                        const isolated = ind === store.sanityCheckIndicator


                        return store.sanityCheckIndicator && isolated || !store.sanityCheckIndicator? (
                            <Row
                                index = {i}
                                selected = {selected}
                                isolated = {isolated}
                                key = {ind}
                                // noRaceNeedRace = {noRace && race}
                                disabled = {disabled}
                                lastPage = {store.indicatorListPage === store.indicatorPages.length-1}
                                onClick = {()=>{
                                    // if(!cats.includes('hasRace')&&race) this.props.store.completeWorkflow('race',null)
                                    // this.props.store.completeWorkflow('indicator',ind)
                                    this.handleSelection(ind)
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
                        ) : null
                    })}
                    {store.sanityCheckIndicator &&
                        <SanityCheck>
                            

                        </SanityCheck>
                    }
                    </FlipMove>
            </IndRows>
             
                
            
            </Workflow>
        )
    }
}

const SanityCheck = styled.div`
    
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

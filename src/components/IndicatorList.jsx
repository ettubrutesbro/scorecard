
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
import semanticTitles from '../assets/semanticTitles'

import media, {getMedia} from '../utilities/media'

const IndRows = styled.ul`
    padding: 0; 
    @media ${media.optimal}{
        margin-top: 15px;
    }
    @media ${media.compact}{
        margin-top: 10px;
    }
`
const RowItem = styled.li`

    // width: 50%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    // margin: 10px;
    list-style-type: none;
    border: 1px solid ${props=> props.disabled? 'transparent' : props.selected? 'var(--strokepeach)' : 'var(--bordergrey)'};
    color: ${props=> props.selected? 'var(--strokepeach)' : props.disabled? 'var(--fainttext)' : 'black'};
    background: ${props => props.disabled? 'transparent' : props.selected? 'var(--faintpeach)' : 'white'};
    /*transform: translateY(-${props => props.index * 1}px);*/
    
    z-index: ${props=>props.selected? 2: 1};
    cursor: ${props => props.disabled? 'auto' : 'pointer'};
    &:hover{
        color: ${props => props.disabled? 'var(--fainttext)' : 'var(--strokepeach)'};
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



const IndicatorListHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

`
const HeaderRight = styled.div`
    
`
const IndLeft = styled.div`
    // font-size: 16px;
    line-height: 150%;
`
const Categories = styled.div`  
    margin-top: 4px;
    display: flex;
    align-items: center;
`
const Years = styled.span`
    margin-left: 8px;
    font-size: 13px;
    color: var(--fainttext);
`
const IndRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    white-space: nowrap;
    margin-left: 20px;
`
const Where = styled.div`
    color: var(--fainttext);
    margin-top: 0px;
    font-size: 13px;

    margin-right: 2px;
`
const Percentage = styled.div`
    /*margin-top: -2px;*/
    @media ${media.optimal}{
        font-size: 24px;
    }
    @media ${media.compact}{
        font-size: 16px;
    }
    font-weight: normal;
    letter-spacing: .0rem;
    min-width: 45px;
    display: flex;
    justify-content: flex-end;
    min-height: 35px;
    display: flex;
    align-items: center;
`
const indicatorFilterOptions = [
    {label: 'All topics', value: 'all'},
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
    font-weight: normal;
    margin: 0 20px 0 0;
    @media ${media.optimal}{
        font-size: 24px;
    }
    @media ${media.compact}{
        display: none;
        font-size: 16px;
    }
`
const Label = styled.div`
    font-size: 16px;

`


@observer
export default class IndicatorList extends React.Component{
    @observable filter = 'all'
    @observable currentPage = 0
    @observable pages = []
    @observable pageSize = 24

    @observable singledOut = null
    @action isolateIndicator = (ind) => {
        //for singling out indicators that've been selected
        //despite some sort of disabled status:
        this.singledOut = ind
    }

    @action goToPage = (pg) => {
        console.log('going to page', pg)
        console.log(this.pages[pg])
        this.currentPage = pg

    }
    @action setFilter = (value) =>{ 
        this.goToPage(0)

        this.paginate()
        this.filter = value
    }

    handleSelection = (ind) =>{
        this.props.store.completeWorkflow('indicator' , ind)
        this.props.closeNav() 
    }

    constructor(){
        super()
        this.paginate()
        //resize?
    }

    // componentDidUpdate(){
    //     this.paginate()
    // }

    @action
    paginate = () => {
        const screen = getMedia()
        let pages = []
        if(screen==='optimal'){
            this.pageSize = 8
        }
        else if(screen==='compact'){
            this.pageSize = 5
        }
        const indKeys = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            return this.filter === 'all'? true : cats.includes(this.filter)
        })
        console.log('total inds:', indKeys.length)
        for(var i = 0; i<indKeys.length/this.pageSize; i++){
            pages.push(indKeys.slice(i*this.pageSize, (i+1)*this.pageSize))
        }

        this.pages = pages
    }

    render(){
        const {county, race} = this.props.store
        const page = this.pages[this.currentPage]

        this.props.setNumPages(this.pages.length)

        const numInds = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            return this.filter === 'all'? true : cats.includes(this.filter)
        }).length

        return(
            <Workflow>

            <IndicatorListHeader>

                <Title> Choose an indicator. </Title>
                {/* 
                <Search 
                    placeholder = "Search indicators..."
                />
                */}
                <Toggle
                    options = {indicatorFilterOptions}
                    onClick = {this.setFilter}
                    selected = {findIndex(indicatorFilterOptions,(o)=>{return o.value===this.filter})}
                />

            </IndicatorListHeader>

            <ListStatus className = "caption">
                 <Readout>
                   Viewing indicators {(this.currentPage * this.pageSize) + 1} - {this.currentPage !== this.pages.length-1? (this.currentPage+1) * this.pageSize : numInds} of {numInds}
                </Readout>
            </ListStatus>
            <IndRows>
                <FlipMove
                    staggerDelayBy = {10}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: 'translateX(0)'},
                        to: {opacity: 0, transform: 'translateX(-100px)'}
                    }}
                    enterAnimation = {{
                        from: {opacity: 0, transform: 'translateX(100px)'},
                        to: {opacity: 1, transform: 'translateX(0px)'}
                    }}
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
                        const isolated = ind === this.singledOut


                        return this.singledOut && isolated || !this.singledOut? (<Row
                            index = {i}
                            selected = {selected}
                            key = {ind}
                            // noRaceNeedRace = {noRace && race}
                            disabled = {disabled}
                            onClick = {()=>{
                                // if(!cats.includes('hasRace')&&race) this.props.store.completeWorkflow('race',null)
                                // this.props.store.completeWorkflow('indicator',ind)
                                this.handleSelection(ind)
                                // this.isolateIndicator(ind)
                            }}
                        > 
                            <IndLeft>
                                {noRace &&
                                    <NoRaceBadge>
                                        NR
                                    </NoRaceBadge>
                                }
                                    {semanticTitles[ind].label}
                                    <Years className = "caption">
                                        {indicator.years.map((yr)=>{
                                            return yr
                                        }).join(',\xa0')}
                                    </Years>
                            </IndLeft>
                            <IndRight>
                                <Percentage>
                                    {!disabled && val+'%'}
                                    {disabled && <Dashes>{'\u2014\u2014'}</Dashes>}
                                </Percentage>
                            </IndRight>
                        </Row>) : <div />
                    })}
                    </FlipMove>
            </IndRows>
             
                
            
            </Workflow>
        )
    }
}

const Dashes = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 16px;
    align-items: center;
`

const Workflow = styled.div`

`

const ListStatus = styled.div`
    font-size: 13px;
    @media ${media.optimal}{
        margin-top: 10px;
    }
    @media ${media.compact}{
        margin-top: 15px;
    }
`


const Readout = styled.div `
    color: var(--fainttext);
`
const PageBtn = styled.div`
    position: absolute;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    top: 0; bottom: 0; margin: auto;

    padding: 10px 25px;
    border: 1px solid ${props => props.disabled?'var(--bordergrey)':'black'};
    display: flex;
    align-items: center;


`
const Prev = styled(PageBtn)`
    left: -25px;
`

const Next = styled(PageBtn)`
    right: -25px;
`

const NoRaceBadge = styled.div`
    color: white;
    background: var(--bordergrey);
    padding: 0px 6px;
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.75px;
`

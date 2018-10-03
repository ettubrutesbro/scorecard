
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import {find, findIndex} from 'lodash'

import FlipMove from 'react-flip-move'
import Toggle from './Toggle'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'

import {getMedia} from '../utilities/media'

const ColumnList = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    flex-grow: 1;
    padding: 20px 0;

    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    margin: 0;
`
const ColumnItem = styled.li`
    // width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    // margin: 10px;
    list-style-type: none;
    border: 1px solid ${props=>props.noRaceNeedRace? 'transparent' : props.selected? 'var(--strokepeach)' : 'var(--bordergrey)'};
    color: ${props=> props.selected? 'var(--strokepeach)' : props.noRaceNeedRace? 'var(--fainttext)' : 'black'};
    background: ${props => props.selected? 'var(--faintpeach)' : props.noRaceNeedRace? 'var(--offwhitebg)' : 'white'};

    // box-shadow: var(--shadow);

` 
const IndicatorListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    h1{
        font-size: 24px;
        font-weight: 400;
        margin: 0;
    }
`
const HeaderRight = styled.div`
    
`
const IndLeft = styled.div`
    font-size: 13px;
    line-height: 150%;
`
const Categories = styled.div`  
    margin-top: 4px;
    display: flex;
    align-items: center;
`
const Years = styled.span`
    margin-left: 6px;
    font-size: 13px;
    color: var(--fainttext);
    margin-right: 5px;
`
const NoRace = styled.div`
    color: #b1b1b1;
    font-size: 13px;
    /*margin-right: 8px;*/
    margin-left: 5px;
    background:${props => props.needRace? 'red' : ''}
`
const HealthTag = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: red;
`
const EduTag = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: blue;
    margin-left: 5px;
    &:first-child{ margin-left: 0; }
`
const WelfTag = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: goldenrod;
    margin-left: 5px;
    &:first-child{ margin-left: 0; }
`
const EarlTag = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: purple;
    margin-left: 5px;
    &:first-child{ margin-left: 0; }
`
const IndRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    white-space: nowrap;
    margin-left: 20px;
`
const Where = styled.div`
    color: #b1b1b1;
    margin-top: 3px;
    font-size: 13px;
`
const Percentage = styled.div`
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .05rem;
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
    font-size: 24px;
    font-weight: normal;
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
        this.filter = value
        this.goToPage(0)
        this.paginate()
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
            this.pageSize = 12
        }
        else if(screen==='compact'){
            this.pageSize = 8
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
        console.log(this.pages)
    }

    render(){
        const {county, race} = this.props.store

        const page = this.pages[this.currentPage]
        console.log(page)

        const numInds = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            return this.filter === 'all'? true : cats.includes(this.filter)
        }).length

        return(
            <IndList>

            <IndicatorListHeader>

                <Title> Choose an indicator. </Title>
                <Toggle
                    options = {indicatorFilterOptions}
                    onClick = {this.setFilter}
                    selected = {findIndex(indicatorFilterOptions,(o)=>{return o.value===this.filter})}
                />

            </IndicatorListHeader>
            <ColumnList>
                    {page.map((ind)=>{
                        const indicator = indicators[ind]
                        const cats = indicator.categories
                        const selected = this.props.store.indicator === ind
                        const noRace = !cats.includes('hasRace')

                        const isolated = ind === this.singledOut

                        return <ColumnItem
                            selected = {selected}
                            noRaceNeedRace = {noRace && race}
                            onClick = {()=>{
                                // if(!cats.includes('hasRace')&&race) this.props.store.completeWorkflow('race',null)
                                this.props.store.completeWorkflow('indicator',ind)
                                this.handleSelection(ind)
                                // this.isolateIndicator(ind)
                            }}
                        > 
                            <IndLeft>
                                {semanticTitles[ind].label}
                                <Years>
                                    {indicator.years.map((yr)=>{
                                        return yr
                                    }).join(', ')}
                                </Years>
                                {noRace &&
                                    <NoRaceBadge>
                                        (No Race Data)
                                    </NoRaceBadge>
                                }
                            </IndLeft>
                            <IndRight>
                                <Percentage>
                                    {!county && indicator.counties.california.totals[indicator.counties.california.totals.length-1] + '%'}
                                    {county && indicator.counties[county].totals[indicator.counties[county].totals.length-1] + '%'}
                                </Percentage>
                                <Where>
                                    {county && find(counties, (o)=>{return o.id===county}).label }
                                    {!county && 'CA avg'}
                                    
                                </Where>
                            </IndRight>
                        </ColumnItem>
                    })}

            </ColumnList>
            
                <PageControls>
                <Prev disabled = {this.currentPage===0} onClick = {this.currentPage === 0? () => {} : ()=>this.goToPage(this.currentPage-1)}>
                    back 
                </Prev>
                <Readout>
                   Viewing indicators {(this.currentPage * this.pageSize) + 1} - {this.currentPage !== this.pages.length-1? (this.currentPage+1) * this.pageSize : numInds} of {numInds}
                </Readout>
                <Next disabled = {this.currentPage===this.pages.length-1} onClick = {this.currentPage === this.pages.length-1? ()=>{} : ()=>this.goToPage(this.currentPage+1)}>
                    next page
                </Next>
                </PageControls>
            </IndList>
        )
    }
}

const IndList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`

const PageControls = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Readout = styled.div `
    color: var(--fainttext);
`
const PageBtn = styled.div`
    padding: 10px 25px;
    border: 1px solid ${props => props.disabled?'var(--bordergrey)':'black'};
    display: flex;
    align-items: center;


`
const Prev = styled(PageBtn)`

`

const Next = styled(PageBtn)`

`

const NoRaceBadge = styled.span`
    color: var(--fainttext);

`

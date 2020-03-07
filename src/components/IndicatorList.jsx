
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

const ColumnList = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;

    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    margin: 0;
    padding: 0;
`
const ColumnItem = styled.li`
    // width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    // margin: 10px;
    list-style-type: none;
    border: 1px solid #dedede;
    background: ${props => props.noRaceNeedRace? '#d7d7d7' : 'white'};

` 
const IndicatorListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    h1{
        font-size: 24px;
        font-weight: 400;
        margin: 0;
    }
`
const HeaderRight = styled.div`
    display: flex;
    align-items: center;
`
const IndLeft = styled.div``
const Categories = styled.div`  
    margin-top: 4px;
    display: flex;
    align-items: center;
`
const Years = styled.div`
    font-size: 13px;
    color: #b1b1b1;
    margin-left: 8px;
`
const NoRace = styled.div`
    color: #b1b1b1;
    font-size: 13px;
    /*margin-right: 8px;*/
    margin-left: 8px;
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
    margin-top: 4px;
    font-size: 13px;
`
const Percentage = styled.div`
    font-weight: 600;
    letter-spacing: .05rem;
`
const indicatorFilterOptions = [
    {label: 'All', value: 'all'},
    {label: 'Health', value: 'health'},
    {label: 'Education', value: 'education'},
    {label: 'Welfare', value: 'welfare'},
    {label: 'Early Childhood', value: 'earlyChildhood'},
]
@observer
export default class IndicatorList extends React.Component{
    @observable filter = 'all'
    @action setFilter = (value) => this.filter = value
    render(){
        const {county, indicator, race} = this.props.store
        return(
            <React.Fragment>
            <IndicatorListHeader>
                <h1> Choose an indicator. </h1>
                <HeaderRight>
                    Topics: 
                    <Toggle
                        options = {indicatorFilterOptions}
                        onClick = {this.setFilter}
                        selected = {findIndex(indicatorFilterOptions,(o)=>{return o.value===this.filter})}
                    />
                </HeaderRight>

            </IndicatorListHeader>
            <ColumnList>

                    {Object.keys(indicators).filter((ind)=>{
                        const cats = indicators[ind].categories
                        return this.filter === 'all'? true : cats.includes(this.filter)
                    }).map((ind)=>{
                        const indicator = indicators[ind]
                        const cats = indicator.categories
                        return <ColumnItem
                            noRaceNeedRace = {!cats.includes('hasRace') && race}
                            onClick = {()=>{
                                // if(!cats.includes('hasRace')&&race) this.props.store.completeWorkflow('race',null)
                                this.props.store.completeWorkflow('indicator',ind)
                            }}
                        > 
                            <IndLeft>
                                {semanticTitles[ind].label}
                                <Categories>
                                    
                                    {cats.includes('health') && <HealthTag />}
                                    {cats.includes('education') && <EduTag />}
                                    {cats.includes('welfare') && <WelfTag />}
                                    {cats.includes('early') && <EarlTag />}
                                    {!cats.includes('hasRace') && 
                                        <NoRace needRace = {race}> No race data </NoRace>
                                    }
                                    <Years>
                                        {indicator.years.map((yr)=>{
                                            return yr
                                        }).join(', ')}
                                    </Years>
                                </Categories>
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
            </React.Fragment>
        )
    }
}
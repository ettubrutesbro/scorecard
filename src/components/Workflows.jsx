
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
import demopop from '../data/demographicsAndPopulation.json'

const fadeIn = keyframes`
    from {opacity: 0;}
    to {opacity: 1;}
`
const rightColMount = keyframes`
    from {transform: scaleX(0.01);}
    to {transform: scaleX(1);}
`
const rightColUnmount = keyframes`
    from {transform: scaleX(1);}
    to {transform: scaleX(0.01);}
`

const Wkflw = styled.div`
    border: 1px solid black;
    transform-origin: 50% 0%;
    /*border-top-color: transparent;*/
    flex-grow: 1;
    padding: 10px;
    margin-top: 15px;
`
const Wrapper = styled.div`
`
const Content = styled.div`
    position: absolute;
    z-index: 2;
    padding: 20px;
    width: ${props => props.doublewide?'160%' : '100%'};
    height: 100%;   
    top: 0; left: 0;
    opacity: 0;
    animation: ${fadeIn} .5s forwards;
    animation-delay: .5s;
    // visibility: ${props=>!props.mounting? 'hidden' : 'visible'};
`
const RightColumn = styled.div`
    position: absolute;
    left: calc(100% - 0.5px); 
    top: -2px;
    width: 60%;
    height: calc(100% + 3px);
    border: 1px solid black;
    border-left-color: white;
    background: white;
    transform-origin: 0% 50%;
    transform: scaleX(0);
    animation: ${rightColMount} .5s forwards};

`
const GridList = styled.ul`
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    flex-wrap: wrap;
    height: 100%;
    justify-content: space-between;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    padding: 0;
`
const GridItem = styled.li`
    // margin: 1%;
    padding: 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    // justify-content: center;
    &:hover{
        background: #f3f3f5;
    }
`
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

` 
const IndicatorListHeader = styled.div`
    width: 100%;
    margin-bottom: 15px;
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
class IndicatorList extends React.Component{
    @observable filter = 'all'
    @action setFilter = (value) => this.filter = value
    render(){
        const {county, indicator, race} = this.props.store
        return(
            <React.Fragment>
            <IndicatorListHeader>
                Filter by category: 
                <Toggle
                    options = {indicatorFilterOptions}
                    onClick = {this.setFilter}
                    selected = {findIndex(indicatorFilterOptions,(o)=>{return o.value===this.filter})}
                />

            </IndicatorListHeader>
            <ColumnList>
                <FlipMove
                    typeName = {null}
                    staggerDelayBy = {15}
                    enterAnimation = 'fade'
                    leaveAnimation = {null}
                >
                    {Object.keys(indicators).filter((ind)=>{
                        const cats = indicators[ind].categories
                        return this.filter === 'all'? true : cats.includes(this.filter)
                    }).map((ind)=>{
                        const indicator = indicators[ind]
                        const cats = indicator.categories
                        return <ColumnItem
                            onClick = {()=>{this.props.store.completeWorkflow('indicator',ind)}}
                        > 
                            <IndLeft>
                                {semanticTitles[ind].label}
                                <Categories>
                                    
                                    {cats.includes('health') && <HealthTag />}
                                    {cats.includes('education') && <EduTag />}
                                    {cats.includes('welfare') && <WelfTag />}
                                    {cats.includes('early') && <EarlTag />}
                                    {!cats.includes('hasRace') && 
                                        <NoRace> No race data </NoRace>
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
                </FlipMove>
            </ColumnList>
            </React.Fragment>
        )
    }
}

const CountyList = (props) => {
    return(
        <GridList>
            {counties.sort((a,b)=>{
                if(a.id < b.id) return -1
                else if (a.id > b.id) return 1
                else return 0
            }).map((county)=>{
                return <GridItem
                    onClick = {()=>{props.store.completeWorkflow('county',county.id)}}
                > 
                    {county.label}
                </GridItem>
            })
            }
        </GridList>
    )
}
const RaceRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px 20px;
    border: 1px solid #dedede;
    h1{ 
        margin: 0;
        font-size: 16px;
        font-weight: 400;
    }
    h3{ 
        font-weight: 400;
        font-size: 13px;
        margin: 0;
        margin-top: 4px;
    }
    &:not(:first-of-type){
        margin-top: 15px;
    }
`
const RowList = styled.div`

`
const races = ['asian','black','latinx','white','other']
const RaceList = (props) => {
    return(
        <RowList>
            {races.map((race)=>{
                return <RaceRow
                    onClick = {()=>props.store.completeWorkflow('race',race)}
                >
                    <h1>
                        {race.charAt(0).toUpperCase()+ race.substr(1)} children
                    </h1>
                    <h3> 
                        {demopop.california[race]}% of California's kids
                    </h3>
                </RaceRow>
            })}
        </RowList>
    )
}

const workflowManifest = {
    indicator: <IndicatorList />,
    race: <RaceList />,
    county: <CountyList />,
}
    

export default class Workflow extends React.Component{
    render(){
        const {store, target} = this.props

        console.log(workflowManifest[target])
        return(
            <Wkflw target = {target}>
                <Wrapper 
                    mounting = {store.activeWorkflow === target}
                    // onClick = {()=>store.completeWorkflow(target,'black')}
                >
                    <Content
                        doublewide = {target==='county'|| target==='indicator'}
                    >
                    {React.cloneElement(
                        workflowManifest[target],
                        // {clickedItem: store.completeWorkflow}
                        {store: store}
                    )}
                    </Content>
                    {(target === 'indicator' || target === 'county') &&
                        <RightColumn 
                            active = {store.activeWorkflow === target}
                        />
                    }
                </Wrapper>
            </Wkflw>
        )
    }
}





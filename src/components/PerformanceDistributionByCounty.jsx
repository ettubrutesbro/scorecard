
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'
import FlipMove from 'react-flip-move'

import {counties} from '../assets/counties'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

import ordinal from 'ordinal'

const config = 'distribution' //top5

function indexOfClosest(nums, target) {
  let closest = 1000;
  let index = 0;

  nums.forEach((num, i) => {
    let dist = Math.abs(target - num);
    if (dist < closest) {
      index = i;
      closest = dist;
    }
  });

  return index;
}

@observer
export default class PerformanceDistributionByCounty extends React.Component{

    @observable width = 400
    @observable selectedIndex = null

    @action generateDistribution = () => {
        const {county, indicator, year} = this.props.store

        const ind = indicators[indicator]

        const countiesWithRanks = Object.keys(ind.counties).filter((county)=>{
            const rank = ind.counties[county].ranks[year]
            return rank && typeof rank === 'number'
        })

        const countyCount = countiesWithRanks.length
        const unit = parseInt((countyCount / (this.props.entries-1)).toFixed(0))
        const offset = parseInt((Math.abs(((countyCount-1) - (unit*(this.props.entries-2))) - unit) / 2).toFixed(0))
            //-1 for california...
        let distribution = []
        for(let i = 1; i<this.props.entries-1; i++){
            distribution.push((i*unit)+offset)
        }
        distribution.unshift(0)
        distribution.push(countyCount-1)
        if(county){
            const mustInclude = ind.counties[county].ranks[year] - 1
            let replaceIndex = indexOfClosest(distribution, mustInclude)
            if(replaceIndex===0 && mustInclude !==0) replaceIndex = 1 //don't replace the first-ranked item
            this.selectedIndex = replaceIndex
            distribution[replaceIndex] = mustInclude
        }
        return distribution


    }

    componentDidMount(){
        this.setGraphDimensions()
        window.addEventListener('resize', this.setGraphDimensions)
    }

    setGraphDimensions = () => {
        this.width = findDOMNode(this.graph).offsetWidth 
    }

    render(){
        const {county, indicator, year} = this.props.store
        const ind = indicators[indicator]
        //all counties' performance in this indicator 
        let performance = Object.keys(ind.counties).map((cty)=>{
            const rank = ind.counties[cty].ranks[year]
            const value = ind.counties[cty].totals[year]
            return {county: cty, rank: rank, value: value}
        }).filter((item)=>{
            return !item.rank? false : typeof item.rank !== 'number'? false : true
        }).sort((a,b)=>{
            return a.rank > b.rank? 1 : a.rank < b.rank? -1 : 0 
        })
        console.log(ind.counties)

        //if a county is selected, insert item at selectedIndex+1
        if(county){
//             const insertIndex = findIndex(performance, (item)=>{return item.county===county})
// 
//             console.log('inserting filler at ', insertIndex)
//             performance.splice(insertIndex+1, 0, {
//                 county: 'filler', rank: 0, value: 0
//             })
        }

        console.log(performance)

        return (
            <GraphTable
                ref = {(graph)=>{this.graph=graph}}
            >
                <Header>
                    Distribution
                </Header>
                <FlipMove
                    duration = {250}
                    staggerDurationBy = {25}
                    typeName = {null}
                    enterAnimation = {null}
                    leaveAnimation = {null}
                >
                    {performance.filter((e,i)=>{
                        //based on even distribution vvv (alt: on racial population)
                        return county&&e.county==='filler'? true: this.generateDistribution().includes(i)})
                    .map((item,i,arr)=>{
                        const tied = i>0? item.rank===arr[i-1].rank : false
                        const filler = item.county==='filler'
                        console.log(item.county)
                            //this won't work for anything more than a two-way tie.
                            return filler?(
                                <FillerRow 
                                    key = {'fillerAt'+this.selectedIndex}
                                >
                                    {/* 
                                    <FillerLabel />
                                    <AnnotationRow>
                                        Asian Black Latinx White Other (should be sorted)
                                    </AnnotationRow>
                                    */}
                                </FillerRow>
                            )
                            :(
                                <Row key = {item.county}>
                                    <Label>
                                        <Rank>
                                            {tied && `T-${item.rank}`}
                                            {!tied && ordinal(item.rank)}
                                        </Rank> 
                                        {find(counties,(o)=>{return o.id===item.county}).label
                                        }
                                    </Label>
                                    <Bar
                                        //RaceDividedBar 
                                        selected = {i === this.selectedIndex}
                                        percentage = {item.value}
                                        height = {100/(this.props.entries)} 
                                    >
                                        {/*ind.categories.includes('hasRace') &&
                                            <React.Fragment>
                                                <PopSeg 
                                                    className = 'asian'
                                                    populationPercentage = {demopop[item.county].asian}
                                                    popIndPerformance = {ind.counties[item.county].asian[year]}
                                                />
                                                <PopSeg 
                                                    className = 'black'
                                                    populationPercentage = {demopop[item.county].black}
                                                    popIndPerformance = {ind.counties[item.county].black[year]}
                                                />
                                                <PopSeg 
                                                    className = 'latinx'
                                                    populationPercentage = {demopop[item.county].latinx}
                                                    popIndPerformance = {ind.counties[item.county].latinx[year]}
                                                />
                                                <PopSeg 
                                                    className = 'white'
                                                    populationPercentage = {demopop[item.county].white}
                                                    popIndPerformance = {ind.counties[item.county].white[year]}
                                                />
                                            </React.Fragment>
                                        */}
                                    </Bar>
                                </Row>

                            )
                    })}
                    </FlipMove>
                
                    <AverageLine 
                        percentage = {ind.counties.california.totals[year]}
                        offset = {(ind.counties.california.totals[year]/100)*(this.width-labelWidth)}
                    />


            </GraphTable>


        )
    }
}

const GraphTable = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    /*width: 100%;*/
    max-width: 800px;
    border: 1px solid red;
`
const Header = styled.div`
    width: 100%;
`

const labelWidth = 175

const Label = styled.div`
    display: inline-flex;
    width: ${labelWidth}px;
    align-items: center;
    flex-shrink: 0;
    justify-content: flex-end;
    padding-right: 10px;
`
const Rank = styled.span`
    margin-right: 5px;
    color: #898989;
`
const FillerRow = styled.div`
    /*position: absolute;*/
    height: 80px;
    width: 100%;
    border: 1px solid black;
    display: flex;
`
const FillerLabel = styled.div`
    flex-shrink: 0;
    width: ${labelWidth}px;
`
const AnnotationRow = styled.div ``
const Row = styled.div`
    font-size: 13px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
    /*height: 100%;*/
`
const AverageLine = styled.div`
    position: absolute;
    bottom: 0;
    left: ${labelWidth}px;
    width: 0px;
    height: calc(100% - 10px);
    border-right: 1px solid black;
    z-index: 2;
    // margin-left: calc(${props=>props.percentage}% - 200px);
    transition: transform .5s;
    transform: translateX(${props=>props.offset}px);
    &::before{  
        content: '';
        position: absolute;
        width: 25px;
        height: 1px;
        border-bottom: 1px black solid;
        top: -1px;
        left: -12px;
    }
    &::after{
        content: 'CA avg';
        position: absolute;
        white-space: nowrap;
        /*width: 0;*/
        transform: translateX(-50%);
        top: -20px;
        text-align: center;
    }
`
const Bar = styled.div`
    width: 100%;
    height: 100%;
    transform-origin: 0% 0%;
    background: ${props => props.selected? 'orange' : 'green'};
    transition: transform .25s;
    transform: scaleX(${props=> props.percentage/100});
    
`

const RaceDividedBar = styled.div`
    width: 100%;
    height: 100%;
    transform-origin: 0% 0%;
    background: ${props => props.selected? 'lightgrey' : 'grey'};
    transition: transform .25s;
    transform: scale(${props=> props.percentage/100}, ${props=>props.selected?4.25:1});
    z-index: ${props=>props.selected?1:0};
    display: flex;
    justify-content: flex-start;
`
const PopSeg = styled.div`
    position: relative;
    &.asian{ background: red; }
    &.black{ background: blue; }
    &.latinx{ background: green; }
    &.white{ background: orange; }
    &.other{ background: lightgrey; }
    width: ${props=>props.populationPercentage}%;
    &::after{
        transform-origin: 50% 100%;
        content: '';
        position: absolute;
        bottom: 0; width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.25);
        transform: scaleY(${props=>props.popIndPerformance/100});
    }
`

PerformanceDistributionByCounty.defaultProps = {
    entries: 12,
    // mustInclude: 5, 
}

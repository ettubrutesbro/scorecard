
import React from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import indicators from '../data/indicators'

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

    generateDistribution = () => {
        const {county, indicator, year} = this.props.store
        const countyCount = Object.keys(indicators[indicator].counties).length - 1
        const unit = parseInt((countyCount / (this.props.entries-1)).toFixed(0))
        const offset = parseInt((Math.abs(((countyCount-1) - (unit*(this.props.entries-2))) - unit) / 2).toFixed(0))
            //-1 for california...
        let distribution = []
        for(let i = 1; i<this.props.entries-1; i++){
            distribution.push((i*unit)+offset)
        }
        distribution.unshift(0)
        distribution.push(countyCount-2)
        if(county){
            const mustInclude = indicators[indicator].counties[county].ranks[year] - 1
            const replaceIndex = indexOfClosest(distribution, mustInclude)
            distribution[replaceIndex] = mustInclude
        }
        return distribution


    }

    render(){
        const {county, indicator, year} = this.props.store
        //map through indicator.counties, looking at totals[year] or race[year]
        const performance = Object.keys(indicators[indicator].counties).map((county)=>{
            const rank = indicators[indicator].counties[county].ranks[year]
            const value = indicators[indicator].counties[county].totals[year]
            return {county: county, rank: rank, value: value}
        }).filter((item)=>{
            return !item.rank? false : typeof item.rank !== 'number'? false : true
        }).sort((a,b)=>{
            return a.rank > b.rank? 1 : a.rank < b.rank? -1 : 0 
        })
        console.log(performance)
        const distribution = this.generateDistribution()

        return config==='top5'?(
            <div>
                top 5 counties for {indicator} {indicators[indicator].years[year]}
                {
                    performance.slice(0,5).map((item,i,arr)=>{
                        const tied = i>0? item.rank===arr[i-1].rank : false
                        //this won't work for anything more than a two-way tie.
                        return <div>{tied && `T-${item.rank}`}{!tied && item.rank}.{item.county} : {item.value}</div>
                    })
                }

            </div>
        ):(
            <GraphTable>
                <Header>
                    Distribution
                </Header>
                <InfoColumn>
                    {performance.filter((e,i)=>{return distribution.includes(i)}).map((item,i,arr)=>{
                        const tied = i>0? item.rank===arr[i-1].rank : false
                            //this won't work for anything more than a two-way tie.
                            return <div>{tied && `T-${item.rank}`}{!tied && item.rank}.{item.county} : {item.value}</div>
                    })}

                </InfoColumn>
                <GraphColumn>
                    {performance.filter((e,i)=>{return distribution.includes(i)}).map((item)=>{
                        return <GraphRow 
                            percentage = {item.value}
                            height = {100/this.props.entries} 
                        />
                    })}

                </GraphColumn>
            </GraphTable>


        )
    }
}

const GraphTable = styled.div`
    display: flex;
    flex-wrap: wrap;
    /*width: 100%;*/
    max-width: 800px;
    border: 1px solid red;
`
const Header = styled.div`
    width: 100%;
`
const InfoColumn = styled.div`
    flex-shrink: 0;
    margin-right: 30px;
`
const GraphColumn = styled.div`
    max-width: 400px;
    /*width: 100%;*/
    flex-grow: 1;
    border: 1px solid black;
`
const GraphRow = styled.div`
    width: 100%;
    transform-origin: 0% 50%;
    background: green;
    transition: transform .25s;
    height: ${props=> props.height}%;
    transform: scaleX(${props=> props.percentage/100});
    
`

PerformanceDistributionByCounty.defaultProps = {
    entries: 12,
    // mustInclude: 5, 
}

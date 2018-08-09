
import React from 'react'
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
            <div>
                distribution
                {performance.filter((e,i)=>{return distribution.includes(i)}).map((item,i,arr)=>{
                    const tied = i>0? item.rank===arr[i-1].rank : false
                        //this won't work for anything more than a two-way tie.
                        return <div>{tied && `T-${item.rank}`}{!tied && item.rank}.{item.county} : {item.value}</div>
                })}

            </div>


        )
    }
}

PerformanceDistributionByCounty.defaultProps = {
    entries: 12,
    // mustInclude: 5, 
}

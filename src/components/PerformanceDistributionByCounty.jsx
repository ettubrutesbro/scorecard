
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

import HorizontalBarGraph from './HorizontalBarGraph'

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
        const {county, indicator, year, race} = this.props.store

        const ind = indicators[indicator]

        const validCounties = Object.keys(ind.counties).filter((cty)=>{
            if(!race){
                const rank = ind.counties[cty].ranks[year]
                 return cty!=='california' && rank && typeof rank === 'number'
            }
            else{
                const value = ind.counties[cty][race][year]
                return cty!=='california' && value && typeof value == 'number'   
            }
        })

        const countyCount = validCounties.length
        const unit = parseInt((countyCount / this.props.entries).toFixed(0))
        const offset = parseInt((Math.abs((countyCount - (unit*(this.props.entries-2))) - unit) / 2).toFixed(0))
            //-1 for california...
        let distribution = []
        for(let i = 1; i<this.props.entries-1; i++){
            distribution.push((i*unit+offset))
        }
        distribution.unshift(0)
        distribution.push(countyCount-1)

        if(county){
            let mustInclude = ind.counties[county].ranks[year] - 1
                //to find the equivalent in race, we need to find its place in the entire pecking order
            if(race){
                const valueSortedCounties = Object.keys(ind.counties).map((cty)=>{
                    return {county: cty, value: ind.counties[cty][race][year]}
                }).filter((item)=>{
                    return item.county!=='california' && item.value!=='' && item.value !== '*'
                })
                .sort((a,b)=>{
                     return a.value > b.value? -1 : a.value < b.value? 1 : 0
                })
                console.log(county)
                mustInclude = findIndex(valueSortedCounties, (item)=>{return item.county===county})
                // console.log(valueSortedCounties)
                console.log('race: mustinclude is', mustInclude)
            }
                
            let replaceIndex = indexOfClosest(distribution, mustInclude)
            if(replaceIndex===0 && mustInclude !==0) replaceIndex = 1 //don't replace the first-ranked item
            if(replaceIndex===this.props.entries-1 && mustInclude !==this.props.entries-1) replaceIndex = this.props.entries-2
            this.selectedIndex = replaceIndex
            distribution[replaceIndex] = mustInclude
        }
        console.log('distribution')
        console.log(distribution)
        return distribution
    }

    render(){
        const {county, indicator, year, race} = this.props.store
        const ind = indicators[indicator]
        //all counties' performance in this indicator 
        let performance = Object.keys(ind.counties).filter((cty)=>{
            if(cty==='california') return false
            if(race){
                const value = ind.counties[cty][race?race:'totals'][year]
                return value !== '' && value !== '*'
            }
            else{
                const rank = ind.counties[cty].ranks[year]
                return !rank? false : typeof rank !== 'number'? false : true
            }
        }).map((cty)=>{
            const rank = ind.counties[cty].ranks[year]
            const value = ind.counties[cty][race?race:'totals'][year]
            return {
                //label should be dom element featuring rank ordinal
                label: find(counties,(c)=>{return c.id===cty}).label, 
                rank: !race?rank:'', 
                value: value
            }
        }).sort((a,b)=>{
            if(race) return a.value > b.value? -1 : a.value < b.value? 1 : 0
            else return a.rank > b.rank? 1 : a.rank < b.rank? -1 : 0 
        }).map((cty,i)=>{
            if(!race) return cty
            else return {...cty, rank: i+1}
        }).filter((e,i)=>{
            return this.generateDistribution().includes(i)
        })

        console.log(performance)

        return (
            <HorizontalBarGraph
                labelWidth = {175}
                bars = {performance}
                average = {ind.counties.california[race||'totals'][year]}
            />
        )
    }
}

PerformanceDistributionByCounty.defaultProps = {
    entries: 12,
}

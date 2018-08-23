
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'

import {counties} from '../assets/counties'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import semanticTitles from '../assets/semanticTitles'

import ordinal from 'ordinal'

import HorizontalBarGraph from './HorizontalBarGraph'
import Button from './Button'

const defaultEntries = 8

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
export default class IndicatorByCounties extends React.Component{

    @observable distribute = true
    @action toggleDistribute = () => {this.distribute = !this.distribute}

    @action generateDistribution = () => {
        console.log('generating distribution')
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
        const unit = parseInt((countyCount / defaultEntries).toFixed(0))
        const offset = parseInt((Math.abs((countyCount - (unit*(defaultEntries-2))) - unit) / 2).toFixed(0))
            //-1 for california...
        let distribution = []
        for(let i = 1; i<defaultEntries-1; i++){
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
                // console.log(county)
                mustInclude = findIndex(valueSortedCounties, (item)=>{return item.county===county})
                // console.log(valueSortedCounties)
                // console.log('race: mustinclude is', mustInclude)
            }
                
            let replaceIndex = indexOfClosest(distribution, mustInclude)
            if(replaceIndex===0 && mustInclude !==0) replaceIndex = 1 //don't replace the first-ranked item
            if(replaceIndex===defaultEntries-1 && mustInclude !==defaultEntries-1) replaceIndex = defaultEntries-2
            this.selectedIndex = replaceIndex
            distribution[replaceIndex] = mustInclude
        }
        // console.log('distribution')
        console.log(distribution)
        return distribution
    }

    render(){
        const {county, indicator, year, race, colorScale} = this.props.store
        const ind = indicators[indicator]
        const {distribution} = this
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
        }).map((cty,i)=>{
            const rank = ind.counties[cty].ranks[year]
            const value = ind.counties[cty][race?race:'totals'][year]
            return {
                //label should be dom element featuring rank ordinal
                label: `${!race?ordinal(rank):''} ${find(counties,(c)=>{return c.id===cty}).label}`, 
                rank: !race?rank:'', 
                value: value,
                //should i do this at the bargraph level?
                fill: colorScale? colorScale(value): '',
                // condensed: !distrib.includes(i)
            }
        }).sort((a,b)=>{
            if(race) return a.value > b.value? -1 : a.value < b.value? 1 : 0
            else return a.rank > b.rank? 1 : a.rank < b.rank? -1 : 0 
        }).map((cty,i)=>{
            // const distrib = this.generateDistribution()
            if(!race) return {
                ...cty,
                // condensed: !distrib.includes(i)
            }
            else return {
                ...cty,
                label:  `${ordinal(i+1)} ${cty.label}`,
                rank: i+1,
                // condensed: !distrib.includes(i)
            }
        })
        .filter((e,i)=>{
            return this.distribute? this.generateDistribution().includes(i) : true
        })

        console.log(performance)

        return (
            <div>
            <HorizontalBarGraph
                header = {`${defaultEntries} ${race||''} ${semanticTitles[indicator].label}: distribution`}
                labelWidth = {175}
                bars = {performance}
                average = {ind.counties.california[race||'totals'][year]}
                disableAnim = {this.distribute}
            />
                <Button label = "See full list" onClick = {this.toggleDistribute}/>
            </div>
        )
    }
}

// IndicatorByCounties.defaultProps = {
//     entries: 12,
// }

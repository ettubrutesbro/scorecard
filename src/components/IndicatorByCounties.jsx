
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
const moreEntries = 12

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

    @observable performance = []
    @observable distribution = []
    @observable condensed = []

    @action calculatePerformance = () => {
        console.log('calculating performance')
        const {county, indicator, year, race, colorScale} = this.props.store
        const ind = indicators[indicator]
        //all counties' performance in this indicator 
        this.performance = Object.keys(ind.counties).filter((cty)=>{
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
                id: cty,
                label: find(counties,(c)=>{return c.id===cty}).label, 
                leftLabel: !race? ordinal(rank) : '',
                rank: !race?rank:'', 
                value: value,
                //should i do this at the bargraph level?
                fill: colorScale? colorScale(value): ''
            }
        }).sort((a,b)=>{
            if(race) return a.value > b.value? -1 : a.value < b.value? 1 : 0
            else return a.rank > b.rank? 1 : a.rank < b.rank? -1 : 0 
        }).map((cty,i)=>{
            if(!race) return {...cty}
            else return {
                ...cty,
                leftLabel: ordinal(i+1),
                rank: i+1,
            }
        })

        console.log(this.performance.toJS())
    } 

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

        // const entries = this.props.store.county? moreEntries : defaultEntries
        const entries = defaultEntries
        const countyCount = validCounties.length
        const unit = parseInt((countyCount / entries).toFixed(0))
        const offset = parseInt((Math.abs((countyCount - (unit*(entries-2))) - unit) / 2).toFixed(0))
            //-1 for california...
        let distribution = []
        for(let i = 1; i<entries-1; i++){
            distribution.push((i*unit+offset))
        }
        distribution.unshift(0)
        distribution.push(countyCount-1)

        if(county){
            let mustInclude = findIndex(this.performance, (o)=>{return o.id===county})
            //get actual index of this county within the performance list

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
            console.log('mustInclude is', mustInclude, 'replaceIndex is', replaceIndex)
            if(replaceIndex===0 && mustInclude !==0) replaceIndex = 1 //don't replace the first-ranked item
            if(replaceIndex===defaultEntries-1 && mustInclude !==defaultEntries-1) replaceIndex = defaultEntries-2
            this.selectedIndex = replaceIndex
            distribution[replaceIndex] = mustInclude

            console.log('adjusted distribution:', distribution)

            // this.condensed = distribution.slice(0)
            // this.condensed.splice(replaceIndex,1)
            // if(replaceIndex !== 0) this.condensed.splice(0,1)
            // if(replaceIndex !== this.condensed.length - 1) this.condensed.splice(this.condensed.length-1,1)

        }
        else if (!county){
            this.condensed = []
        }
        // console.log('distribution')
        console.log(distribution)
        // return distribution
        this.distribution = distribution
    }


    componentDidMount(){
        this.calculatePerformance()
        this.generateDistribution()
        // this.averageTweeners()
    }

    componentDidUpdate(oldProps){
        console.log('updated')
        if(this.props.store !== oldProps.store){
            console.log('store changed')

            this.calculatePerformance()
            this.generateDistribution()


            // this.averageTweeners()
        }
        // this.generateDistribution()
        // this.averageTweeners()
    }

    render(){

        const {county, race, year, indicator, completeWorkflow} = this.props.store
        let {performance} = this 
        const ind = indicators[indicator]

        performance = performance.map((e,i,arr)=>{
            const distrib = this.distribution

            if(!this.distribute) return e
            // else if(this.condensed.includes(i)){
            //     return {...e, condensed: true}
            // }
            else if(distrib.includes(i)) return e
            else return null
        })
        .filter((e,i)=>{
            if(!this.distribute) return true
            if(e===null) return false
            else return true
        })

        return (
            <div>
            <HorizontalBarGraph
                selected = {county}
                header = {'COUNTY DISTRIBUTION'}
                labelWidth = {150}
                bars = {performance}
                average = {ind.counties.california[race||'totals'][year]}
                disableAnim = {this.distribute}
                selectBar = {this.props.store.completeWorkflow}
                onHover = {()=>console.log('hovering graph')}
                onClickGraph = {this.toggleDistribute}
                graphHoverPrompt = 'Click to see full list (47 counties)'
                expandable
            />
            </div>
        )
    }
}

const Prompt = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 10px;
    opacity: ${props => props.visible? 1 : 0};
`

// IndicatorByCounties.defaultProps = {
//     entries: 12,
// }

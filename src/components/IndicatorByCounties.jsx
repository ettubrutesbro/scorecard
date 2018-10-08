
import React, {Fragment} from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'
import commaNumber from 'comma-number'

import {counties} from '../assets/counties'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import semanticTitles from '../assets/semanticTitles'

import {capitalize} from '../utilities/toLowerCase'

import ordinal from 'ordinal'

import HorizontalBarGraph from './HorizontalBarGraph'
import Button from './Button'

// const defaultEntries = 8
// const moreEntries = 12

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
        // console.log('calculating performance')
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
                // leftLabel: !race? ordinal(rank) : '',
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
                // leftLabel: ordinal(i+1),
                rank: i+1,
            }
        })

        // console.log(this.performance.toJS())
    } 

    @action toggleDistribute = () => {this.distribute = !this.distribute}

    @action generateDistribution = () => {
        // console.log('generating distribution')
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
        const entries = this.props.entries
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
            // console.log('mustInclude is', mustInclude, 'replaceIndex is', replaceIndex)
            if(replaceIndex===0 && mustInclude !==0) replaceIndex = 1 //don't replace the first-ranked item
            if(replaceIndex===entries-1 && mustInclude !== distribution[entries-1]) replaceIndex = entries-2
            else if(replaceIndex===entries-1 && mustInclude === distribution[entries-1]) console.log('last one')

            this.selectedIndex = replaceIndex
            distribution[replaceIndex] = mustInclude

            // console.log('adjusted distribution:', distribution)

            // this.condensed = distribution.slice(0)
            // this.condensed.splice(replaceIndex,1)
            // if(replaceIndex !== 0) this.condensed.splice(0,1)
            // if(replaceIndex !== this.condensed.length - 1) this.condensed.splice(this.condensed.length-1,1)

        }
        else if (!county){
            this.condensed = []
        }
        // console.log('distribution')
        // console.log(distribution)
        // return distribution
        this.distribution = distribution
    }


    componentDidMount(){
        // this.calculatePerformance()
        // this.generateDistribution()
        const wtf = autorun(()=>{
            const {indicator, race, county, year} = this.props.store
            // console.log(indicator, race, county, year)
            this.calculatePerformance()
            this.generateDistribution()
        })
        // this.averageTweeners()
    }

    


    render(){

        const {county, race, year, indicator, completeWorkflow, colorScale} = this.props.store
        let {performance} = this 
        const ind = indicators[indicator]



        performance = performance.map((e,i,arr)=>{
            const distrib = this.distribution
            if(!this.distribute) return e
            else if(distrib.includes(i)){ 
                return {
                    ...e,
                    label: i===0? (<Fragment> <Faint>1.</Faint> {e.label}  </Fragment>)
                        : i===arr.length-1? <Fragment><Faint>{arr.length}.</Faint> {e.label} </Fragment>
                        : e.id===county? <Fragment><SelectedNum>{e.rank}.</SelectedNum> {e.label} </Fragment>
                        : e.label,
                }

            }
            else return null
        })
        .filter((e,i)=>{
            if(!this.distribute) return true
            if(e===null) return false
            else return true
        })

        const sem = semanticTitles[indicator]
        let expandedHeader = `${sem.descriptor||''} ${race?capitalize(race):''} ${sem.who} who ${sem.what}`
        expandedHeader = expandedHeader.slice(0,1).toUpperCase() + expandedHeader.substr(1)


        let highestValue = 0
        let withRace = !race? '' : Object.keys(demopop)
            .filter((cty)=> {return cty!=='california'})
            .map((cty)=>{
                const pop = parseInt(((demopop[cty][race]/100) * demopop[cty].population).toFixed(0))
                if(pop > highestValue) highestValue = pop
                return {
                    id: cty,
                    label: find(counties, (c)=>{return c.id===cty}).label,
                    value: pop,
                }
            })
            .sort((a,b)=>{
                return a.value>b.value? -1: a.value<b.value? 1 : 0
            })
            .slice(0,this.props.entries) //TODO: use entries instead of 5 (but needs to be responsive)
            .map((cty)=>{
                //if indicator active, value is indicator perf.

                //TODO: right now, most populous county is '100%'
                //and the rest are fractions of it, but a true, static 100% should
                //be the largest % of the largest county (hmm, maybe?)

                //or it could be the total of all [race] in CA
                const val = indicators[indicator].counties[cty.id][race][year]
                const selected = cty.id===county
                return {
                    ...cty, 
                    label: selected? <SelectedCounty>{cty.label}</SelectedCounty> : cty.label,   
                    value: val,
                    fill: selected? 'var(--peach)'  : colorScale? colorScale(val): '',
                    trueValue: val + '%'

                }
            })
        if(race && county){
            if(find(withRace, (o)=>{return o.id===county})){
                console.log('withRace bars already includes selected county, no need to replace last')
            }
            else{
                withRace[withRace.length-1] = {
                    label: <SelectedCounty>{find(counties,(o)=>{return o.id===county}).label}</SelectedCounty>,
                    value: indicators[indicator].counties[county][race][year],
                    fill: 'var(--peach)',
                }
            }
        }

        return (
            <HorizontalBarGraph
                selected = {county}
                selectable
                header = {
                    race==='other'? 'In counties with the most children of other races' 
                    : race? `In counties with the most ${capitalize(race)} children:` 
                    : 'County overview'}
                expandedHeader = {expandedHeader}
                expandedSubHeader = {performance.length + ' counties reported data'}
                labelWidth = {140}
                bars = {race? withRace : performance}
                average = {ind.counties.california[race||'totals'][year]}
                disableAnim = {this.distribute}
                selectBar = {(id)=>{console.log(id); this.props.store.completeWorkflow('county',id)}}
                // onHover = {()=>console.log('hovering graph')}
                // onClickGraph = {this.toggleDistribute}
                // graphHoverPrompt = 'Click to see full list (47 counties)'
                // expandable
                // selectable

                // entries = {this.props.entries}
            />
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


const Faint = styled.span`
    color: var(--fainttext);
    margin-right: 4px;
`

const SelectedNum = styled.span`
    color: var(--peach);
    margin-right: 4px;
`
const SelectedCounty = styled.span`
    color: var(--strokepeach);
    // margin-right: 4px;
`
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'
import commaNumber from 'comma-number'

import {counties} from '../assets/counties'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import semanticTitles from '../assets/semanticTitles'

import ordinal from 'ordinal'

import HorizontalBarGraph from './HorizontalBarGraph'

export default class CountiesByRacePopulation extends React.Component{
    render(){
        const {race, indicator, year} = this.props.store
        let highestValue = 0

        const ranksByIndicatorPerf = indicator? Object.keys(indicators[indicator].counties).map((cty)=>{
            return {name: cty, value: indicators[indicator].counties[cty][race][year]}
        }).filter((o)=>{
            return o.value!=='*'&&o.value
        }).sort((a,b)=>{
            return a.value>b.value?-1:a.value<b.value?1:0
        }).map((o,i)=>{
            return {...o, rank: i+1}
        }): ''

        console.log(ranksByIndicatorPerf)

        const top5 = Object.keys(demopop)
            .filter((cty)=> {return cty!=='california'})
            .map((cty)=>{
                const pop = parseInt(((demopop[cty][race]/100) * demopop[cty].population).toFixed(0))
                if(pop > highestValue) highestValue = pop
                return {
                    id: cty,
                    label: find(counties, (c)=>{return c.id===cty}).label,
                    value: pop,
                    trueValue: commaNumber(pop),
                }
            })
            .sort((a,b)=>{
                return a.value>b.value? -1: a.value<b.value? 1 : 0
            })
            .slice(0,5)
            .map((cty)=>{
                //if indicator active, value is indicator perf.

                //TODO: right now, most populous county is '100%'
                //and the rest are fractions of it, but a true, static 100% should
                //be the largest % of the largest county (hmm, maybe?)

                //or it could be the total of all [race] in CA
                return {
                    ...cty, 
                    label: !indicator? cty.label 
                        : `${cty.label} ${ordinal(find(ranksByIndicatorPerf,(o)=>{return o.name===cty.id}).rank)}`,
                    value: !indicator? (cty.value/highestValue)*100
                        : indicators[indicator].counties[cty.id][race][year],

                }
            })



        console.log(top5)
        console.log('highest pop:', highestValue)

        return(
            <HorizontalBarGraph 
                header = {`Counties with most ${race} children${indicator? `: ${semanticTitles[indicator].label}` : ''}`}
                labelWidth = {140}
                bars = {top5}
                average = {indicator? indicators[indicator].counties.california[race][year] : ''}
            />
        )
    }
}
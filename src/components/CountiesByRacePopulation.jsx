import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'

import {counties} from '../assets/counties'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

import ordinal from 'ordinal'

import HorizontalBarGraph from './HorizontalBarGraph'

export default class CountiesByRacePopulation extends React.Component{
    render(){
        const {race, indicator, year} = this.props.store
        let highestValue = 0
        const top10 = Object.keys(demopop)
            .filter((cty)=> {return cty!=='california'})
            .map((cty)=>{
                const pop = parseInt(((demopop[cty][race]/100) * demopop[cty].population).toFixed(0))
                if(pop > highestValue) highestValue = pop
                return {
                    id: cty,
                    label: find(counties, (c)=>{return c.id===cty}).label,
                    value: pop,
                    racepop: pop
                }
            })
            .sort((a,b)=>{
                return a.value>b.value? -1: a.value<b.value? 1 : 0
            })
            .slice(0,10)
            .map((cty)=>{
                //if indicator active, value is indicator perf.
                
                return {
                    ...cty, 
                    label: !indicator? cty.label 
                        : 'rank '+ cty.label,
                    value: !indicator? (cty.value/highestValue)*100
                        : indicators[indicator].counties[cty.id][race][year]

                }
            })

        console.log(top10)
        console.log('highest pop:', highestValue)

        return(
            <HorizontalBarGraph 
                labelWidth = {140}
                bars = {top10}
                average = {indicator? indicators[indicator].counties.california[race][year] : ''}
            />
        )
    }
}
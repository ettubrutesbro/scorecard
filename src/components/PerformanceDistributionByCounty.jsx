
import React from 'react'
import styled from 'styled-components'

import indicators from '../data/indicators'

export default class PerformanceDistributionByCounty extends React.Component{
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
        return(
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
        )
    }
}
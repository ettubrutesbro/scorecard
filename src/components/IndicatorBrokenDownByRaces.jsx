
import React from 'react'
import styled from 'styled-components'

import indicators from '../data/indicators'

const races = [
    'asian', 'black', 'latinx', 'white', 'other'
]

export default class IndicatorBrokenDownByRaces extends React.Component{
    render(){
        const {indicator, year, county} = this.props.store
        const ind =  county? indicators[indicator].counties[county] : indicators[indicator].counties.california
        return(
            <div>
                {indicator} in {county || 'california'} by race: 
                {races.map((race)=>{
                    return(
                        <div>{race} : {ind[race][year]}</div>
                    )
                })}
            </div>
        )
    }
}
import React from 'react'
import styled from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import {find} from 'lodash'
import {findDOMNode} from 'react-dom'
import commaNumber from 'comma-number'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'
import demopop from '../data/demographicsAndPopulation.json'

const ReadoutBlock = styled.div`
    transform-origin: 50% 0%;
    padding: 30px;
    font-size: 24px;
    position: relative;
    /*flex-grow: ${props=> props.compact? 0: 1};*/
    b{
        font-weight: 600;
    }
    h1{
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        font-size: 48px;
        font-weight: 600;
    }
`
const IndentedTitle = styled.div`
    max-width: 400px;
    line-height: 36px;
    padding-top: 18px;
`
const Crumb = styled.span`
    // display: inline-flex;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 5px;
    border-bottom: ${props => props.active? '1px solid black' : '1px solid transparent'};
    margin: ${props => props.active? '0 .5rem' : '0 0 0 0.4rem'};
    
`
@observer
export default class Readout extends React.Component{
    @observable bigNumberWidth = 0
    @action setBigNumberWidth = () => {
        const width = findDOMNode(this.bigNumber).offsetWidth
        this.bigNumberWidth = width
    }
    componentDidMount = () => {
        if(this.props.store.indicator) this.setBigNumberWidth() 
    }
    componentDidUpdate = (newProps) => {
        if(this.props.store.indicator) this.setBigNumberWidth()
    }


    render(){
        const {county, indicator, race, year} = this.props.store


        const raceString = race? `${race.charAt(0).toUpperCase() + race.substr(1)}` : ''
        const countyString = county? `${find(counties,{id:county}).label} county.` : 'California.'
        const who = indicator? semanticTitles[indicator].who : 'children'
        const what = indicator? semanticTitles[indicator].what : ''

        console.log(demopop[county])
        const popCount = county&&race? ((demopop[county][race] / 100) * demopop.county.population).toFixed(0)
        : county? demopop[county].population 
        : race? ((demopop.california[race]/100) * demopop.california.population).toFixed(0) : ''

        const ind = indicators[indicator]

        return(
            <ReadoutBlock
                compact = {this.props.store.activeWorkflow}
            >
                {!indicator && (county || race) && 
                    <React.Fragment>
                    <b>{commaNumber(popCount)} </b> 
                    {raceString} {who} live in {countyString}
                    </React.Fragment>
                }
                {indicator && 
                    <div style = {{position: 'relative'}}>
                        <h1 ref = {(h1)=>{this.bigNumber = h1}}>
                            {county && race && ind.counties[county][race][year]}
                            {county && !race && ind.counties[county].totals[year]}
                            {!county && race && ind.counties.california[race][year]}
                            {!county && !race && ind.counties.california.totals[year]}
                            %
                        </h1>
                        <IndentedTitle
                            style = {{
                                textIndent: this.bigNumberWidth+10 + 'px'
                            }}
                        > 
                            of {who} {raceString} {what} in {countyString}
                        </IndentedTitle>

                    </div >
                }
            </ReadoutBlock>
        )
    }
}

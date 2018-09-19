import React from 'react'
import styled from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import {find} from 'lodash'
import {findDOMNode} from 'react-dom'
import commaNumber from 'comma-number'

import CountingNumber from './CountingNumber'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'
import demopop from '../data/demographicsAndPopulation.json'

import media from '../utilities/media'

const ReadoutBlock = styled.div`
    left: 0;
    top: 0;
    transform-origin: 50% 0%;
    font-size: 24px;
    position: absolute;
    padding-right: 30px;
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

const ShadowNum = styled.div`
    opacity: 0;
`
@observer
export default class Readout extends React.Component{
    @observable bigNumberWidth = 0
    @action setBigNumberWidth = () => {
        const width = findDOMNode(this.bigNumber).offsetWidth
        this.bigNumberWidth = width
    }
    @observable firstLine = ''
    @observable subsequentLines = ``


    @action computeLineBreaks = (str) => {
        const {county, indicator, race, year} = this.props.store

        const raceString = race? `${race!=='white'? race.charAt(0).toUpperCase() + race.substr(1):race}` : ''
        const countyString = county? `${find(counties,{id:county}).label} county` : 'California'
        const who = indicator? semanticTitles[indicator].who : 'children'
        const what = indicator? semanticTitles[indicator].what : ''
        const descriptor = indicator? semanticTitles[indicator].descriptor : ''
        const ind = indicators[indicator]
        const actualYear = ind? ind.years[year] : ''

        const readout = `of ${descriptor||''} ${raceString} ${who} ${what} in ${countyString} in ${actualYear}.`

        const firstLineBreakPoint = 60
        const minCharsInSubsequent = 15

        if(readout.length > firstLineBreakPoint){
            let i = 0
            let actualBreakIndex 
            while (i < firstLineBreakPoint){
                if(readout[firstLineBreakPoint-i]===' ' && readout.slice(firstLineBreakPoint-i).length > minCharsInSubsequent ){
                    console.log('blank space (that wont widow) at', firstLineBreakPoint-i)
                    actualBreakIndex = firstLineBreakPoint - i
                    break;
                }
                i++
            }
            this.firstLine = readout.slice(0,actualBreakIndex)
            this.subsequentLines = this.nbspString(readout.slice(actualBreakIndex))
        }
        else this.firstLine = readout
    }

    nbspString = (str) => {

        //what if theres less than 3 words?

        const words = str.split(' ')
        if(words.length >= 3){

            return words.slice(0,words.length-3).join(' ') + ' ' + words.slice(words.length-3).join('\xa0')

            // const secondLastWord = str.indexOf(words[words.length-2])-1
            // const lastWord = str.indexOf(words[words.length-1])-1
            // let newStr = str.slice(0)
            // newStr = newStr.slice(0,secondLastWord) + '&nbsp;' + newStr.slice(secondLastWord, lastWord) + '&nbsp;' + newStr.slice(lastWord)

            // return newStr
        }
        else return str
    }

    componentDidMount = () => {
        if(this.props.store.indicator) this.setBigNumberWidth() 
        this.computeLineBreaks()
    }
    componentDidUpdate = (newProps) => {
        if(this.props.store.indicator) this.setBigNumberWidth()
        this.computeLineBreaks()
    }


    render(){
        const {county, indicator, race, year} = this.props.store


        const raceString = race? `${race!=='white'? race.charAt(0).toUpperCase() + race.substr(1):race}` : ''
        const countyString = county? `${find(counties,{id:county}).label} county` : 'California'
        const who = indicator? semanticTitles[indicator].who : 'children'
        const what = indicator? semanticTitles[indicator].what : ''
        const descriptor = indicator? semanticTitles[indicator].descriptor : ''

        const popCount = county&&race? ((demopop[county][race] / 100) * demopop[county].population).toFixed(0)
        : county? demopop[county].population 
        : race? ((demopop.california[race]/100) * demopop.california.population).toFixed(0) : ''

        const ind = indicators[indicator]
        const actualYear = ind? ind.years[year] : ''
        let displayNum
        if(indicator){
            displayNum = county && race? ind.counties[county][race][year]
                : county && !race? ind.counties[county].totals[year]
                : !county && race? ind.counties.california[race][year]
                : !county && !race? ind.counties.california.totals[year]
                : 'wat'
        }

        const computedString = `${raceString} ${who} live in ${countyString}`

        const readout = `of ${descriptor||''} ${raceString} ${who} ${what} in ${countyString} in ${actualYear}.`

        return(
            <ReadoutBlock
                compact = {this.props.store.activeWorkflow}
            >
                {!indicator && (county || race) && 
                    <React.Fragment>
                    <b>{commaNumber(popCount)} </b> 
                    {computedString}.
                    </React.Fragment>
                }
                {indicator && 
                    <div style = {{position: 'relative'}}>
                        <h1 ref = {(h1)=>{this.bigNumber = h1}}>
                            <ShadowNum>{displayNum}%</ShadowNum>
                            <CountingNumber
                                number = {displayNum}
                                suffix = '%'
                                absolute
                            />
                            
                        </h1>
                        <IndentedTitle
                            style = {{
                                textIndent: this.bigNumberWidth+10 + 'px'
                            }}
                        > 
                            {this.firstLine}
                        </IndentedTitle>
                        <SubsequentLines>
                            {this.subsequentLines}
                        </SubsequentLines>

                    </div >
                }
            </ReadoutBlock>
        )
    }
}

const SubsequentLines = styled.div`
    border: 1px solid red;
    line-height: 170%;
    @media ${media.optimal}{
        
    }
    @media ${media.compact}{
        width: 480px;
    }
    @media ${media.device}{

    }
`

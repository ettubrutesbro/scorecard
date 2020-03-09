import React from 'react'
import styled from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import {find} from 'lodash'
import {findDOMNode} from 'react-dom'
import commaNumber from '../utilities/commaNumber'

import CountingNumber from './CountingNumber'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
// import semanticTitles from '../assets/semanticTitles'
import demopop from '../data/demographicsAndPopulation.json'

import media, {getMedia} from '../utilities/media'

const ReadoutBlock = styled.div`
    display: flex;
    align-items: center;
    padding-right: 30px;
    @media ${media.optimal}{
        width: 950px;   
    }
    @media ${media.compact}{
        width: 850px;   
    }
    @media ${media.mobile}{
        width: 100%;
        padding: 15px;
    }
    left: 0;
    top: 0;
    transform-origin: 50% 0%;
    /*position: absolute;*/
    /*flex-grow: ${props=> props.compact? 0: 1};*/
    b{
        font-weight: 600;
    }
    h1{
        position: absolute;
        top: -6px;
        left: 0;
        margin: 0;
        font-size: 48px;
        @media ${media.compact}{
            font-size: 42px;
        }
        @media ${media.mobile}{
            font-size: 32px;
        }
        font-weight: 600;
    }
    ${props => props.tiny? `
        h1{
            font-size: 18px;
        }
    `: ''}

`
const IndentedTitle = styled.div`
    
    @media ${media.optimal}{
        padding-top: 18px;
        line-height: 40px;
    }
    @media ${media.compact}{
        padding-top: 12px;
        line-height: 34px;
    }
    @media ${media.mobile}{
        padding-top: 9px;
        line-height: 25px;
        ${props => props.tiny? `
            font-size: 14px;
            line-height: 21px;
            margin-top: -2px;
            padding-top: 0;
        `: ''}
    }
`
const Crumb = styled.span`
    // display: inline-flex;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 5px;
    border-bottom: ${props => props.active? '1px solid black' : '1px solid transparent'};
    margin: ${props => props.active? '0 .5rem' : '0 0 0 0.4rem'};   
`

const ShadowNum = styled.h1`
    opacity: 0;
`
@observer
export default class Readout extends React.Component{
    constructor(props){
        super(props)
        this.bigNumber = React.createRef()
    }
    @observable bigNumberWidth = 0
    @action setBigNumberWidth = () => {
        const width = findDOMNode(this.bigNumber.current).offsetWidth
        this.bigNumberWidth = width
        console.log('set big number widcth: ', width)
        console.log(this.bigNumber.current.offsetWidth)
    }
    @observable firstLine = ''
    @observable subsequentLines = ``


    @action computeLineBreaks = (str) => {
        const {county, indicator, race, year, screen} = this.props.store

        const raceString = race === 'other'? 'of other races' : race? race.charAt(0).toUpperCase() + race.substr(1): ''
        const countyString = county && !this.props.forceCA? `${find(counties,{id:county}).label} county` : 'California'
        const semanticTitle = indicator? indicators[indicator].semantics : ''
        const who = indicator? semanticTitle.who : 'children'
        const what = indicator? semanticTitle.what : ''
        const descriptor = indicator? semanticTitle.descriptor : ''
        const ind = indicators[indicator]
        const actualYear = ind? ind.years[year] : ''

        const readout = `of ${descriptor||''} ${race!=='other'? raceString : ''} ${who}${race==='other'?raceString:''}${what[0]===','?'':' '}${what} in ${countyString} in ${actualYear}.`

        const firstLineBreakPoint = screen==='optimal'? 85  : screen==='compact'? 60 : 40
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
            // this.firstLine = readout.slice(0,actualBreakIndex)
            // this.subsequentLines = this.nbspString(readout.slice(actualBreakIndex))
            this.firstLine = readout
        }
        else{
         this.firstLine = readout
         // this.subsequentLines = ''
     }
    }

    nbspString = (str) => {

        //what if theres less than 3 words?

        const words = str.split(' ')
        if(words.length >= 2){

            return words.slice(0,words.length-2).join(' ') + ' ' + words.slice(words.length-2).join('\xa0')

        }
        else return str
    }

    componentDidMount = () => {
        if(this.props.store.indicator) this.setBigNumberWidth() 
        this.computeLineBreaks()
        // document.fonts.ready.then(()=>this.setBigNumberWidth())
    }
    componentDidUpdate = (newProps) => {
        if(this.props.store.indicator) this.setBigNumberWidth()
        this.computeLineBreaks()
    }

    offsetBreakdown = (v) => {
        console.log('readout offset breakdown', v)
        // this.props.offsetBreakdown(v)
    }
    render(){
        const {tiny} = this.props
        const {county, indicator, race, year} = this.props.store


        const raceString = race? `${race!=='white'? race.charAt(0).toUpperCase() + race.substr(1):race}` : ''
        const countyString = county? `${find(counties,{id:county}).label} county` : 'California'
        const semanticTitle = indicator? indicators[indicator].semantics : ''
        const who = indicator? semanticTitle.who : 'children'
        const what = indicator? semanticTitle.what : ''
        const descriptor = indicator? semanticTitle.descriptor : ''

        const popCount = county&&race? ((demopop[county][race] / 100) * demopop[county].population).toFixed(0)
        : county? demopop[county].population 
        : race? ((demopop.california[race]/100) * demopop.california.population).toFixed(0) : ''

        const ind = indicators[indicator]
        const actualYear = ind? ind.years[year] : ''
        let displayNum
        const cty = !this.props.forceCA? county : 'california'
        if(indicator){
            displayNum = county && race? ind.counties[cty][race][year]
                : county && !race? ind.counties[cty].totals[year]
                : !county && race? ind.counties.california[race][year]
                : !county && !race? ind.counties.california.totals[year]
                : 'wat'
        }

        const computedString = `${raceString} ${who} live in ${countyString}`

        const readout = `of ${descriptor||''} ${raceString} ${who} ${what} in ${countyString} in ${actualYear}.`

        return(
            <ReadoutBlock
                className = {['title', this.props.className].join(' ')}
                compact = {this.props.store.activeWorkflow}
                tiny = {tiny}
            >

                {indicator && 
                    <div style = {{position: 'relative', display: 'inline-flex'}}>
                        
                            <ShadowNum ref = {this.bigNumber} >{displayNum}%</ShadowNum>
                            <h1 >
                            <CountingNumber
                                number = {displayNum}
                                suffix = '%'
                                absolute
                            />

                            
                        </h1>
                        <IndentedTitle
                            tiny = {tiny}
                            style = {{
                                textIndent: this.bigNumberWidth+(tiny? 5: 8)+ 'px'
                            }}
                        > 
                            {this.firstLine}
                            {indicators[indicator].categories.includes('unstable') && 
                                <UnstableAddendum>
                                    Indicator data is unstable; exceptions listed in notes and sources.
                                </UnstableAddendum>
                            }
                        </IndentedTitle>



                    </div >
                }
            </ReadoutBlock>
        )
    }
}
const UnstableAddendum = styled.span`
    font-size: 13px;
    margin-left: 10px;
    color: var(--fainttext);
`
const Sublines = styled.div`
    // border: 1px solid red;
    padding-top: 3px;
    line-height: 170%;
    @media ${media.optimal}{
        
    }
    @media ${media.compact}{
        width: 480px;
    }
    @media ${media.device}{

    }
`



class SubsequentLines extends React.Component{
    constructor(props){
        super(props)
        this.wrapper = React.createRef()
    }
    getHeight = () => {
        this.props.offsetBreakdown(this.wrapper.current.offsetHeight)
    }
    // componentDidMount(){
    //     // this.getHeight()
    // }
    componentDidUpdate(oldProps){
        this.getHeight()
    }
    render(){
        return(
            <Sublines ref = {this.wrapper}>
                {this.props.children}
            </Sublines>
        )
    }
}
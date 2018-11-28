import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'
import media from '../utilities/media'
import {capitalize} from '../utilities/toLowerCase'
import demopop from '../data/demographicsAndPopulation'

const clt = 9 //compressed label threshold (% below which label becomes compressed)
const races = ['asian','black','latinx','white','other']

const RaceBreakdownBar = (props) =>{

    const {height, store} = props
    const {county} = store

    let numOfCompressedLabels = 0

    const racePercentages = races.map((race)=>{
        console.log(race, demopop, county)
        const pct = demopop[county||'california'][race]
        if(pct <= clt && pct > 0) numOfCompressedLabels++
        return {label:race, percentage: pct}
    }).sort((a,b)=>{
        return b.label === 'other'? -2 : a.percentage > b.percentage? -1 : a.percentage < b.percentage? 1 : 0
    })

    const totalOfPcts = racePercentages.map((o)=>{return o.percentage}).reduce((a,b)=>{return a+b})
    
    const compressedLabels = racePercentages.filter((r)=>{return r.percentage <= clt && r.percentage > 0})

    return(
        <RaceBreakdown height = {height}>
        <RaceBar>
        {racePercentages.map((race,i,arr)=>{
            const previousSegs = arr.slice(0,i)
            const offset = previousSegs.map((seg)=>{
                return (seg.percentage * 100) / totalOfPcts
            }).reduce((a,b)=>a+b,0)

            const pct = totalOfPcts!==100? race.percentage * 100 / totalOfPcts : race.percentage

            return (
                <React.Fragment>
                <Backing 
                    key = {'backing'+i}
                    offset = {(offset/100) * height}
                />
                <RaceSegment
                    key = {i}
                    offset = {(offset/100) * height}
                    // className = {race.label}
                    style = {{
                        position: 'absolute',
                        height: '500px',
                        width: '100%'
                    }}
                    infinitesimal = {pct < 3}
                    zero = {pct == 0}
                    race = {race.label}
                />
                <EndNotch 
                    key = {'hatch'+i} 
                    offset = {(offset/100) * height} 
                    infinitesimal = {pct < 3}
                />
                </React.Fragment>
            )
        })
        }
        </RaceBar>
        <LabelBar>
            {racePercentages.map((race,i,arr)=>{
                const previousSegs = arr.slice(0,i)
                const offset = previousSegs.map((seg)=>{
                    return (seg.percentage * 100) / totalOfPcts
                }).reduce((a,b)=>a+b,0)
                const pct = totalOfPcts!==100? race.percentage * 100 / totalOfPcts : race.percentage


                return race.percentage > clt ? (
                    <LabelSection
                        key = {'label'+i} 
                        offset = {((offset+(race.percentage/2))/100) * height}
                        specialOffset = {
                            i===1 && race.percentage < 22 && 
                            numOfCompressedLabels === 3} 
                    >
                        <LabelNotch />
                        <Label> {capitalize(race.label)} </Label>
                        <Percentage> {race.percentage}%</Percentage>
                    </LabelSection>
                ): (<React.Fragment />)
            })}
            {racePercentages[racePercentages.length-1].percentage < clt && 
                <LabelSection offset = {height-1} >
                <LabelNotch />
                </LabelSection>
            }
            <CompressedLabels>
                {compressedLabels.map((r,i)=>{
                    return (
                        <Compressed 
                            num = {numOfCompressedLabels}
                            key = {'compressedlabel'+i}
                            specialOffset = {
                                numOfCompressedLabels===3 && 
                                racePercentages[1].percentage < 22
                            }
                        >
                            <Label> {capitalize(r.label)} </Label>
                            <Percentage> {r.percentage}%</Percentage>
                        </Compressed>
                    )
                })}
            </CompressedLabels>
        </LabelBar>
        </RaceBreakdown>
    )
}

const RaceBreakdown = styled.div`
    height: ${props=>props.height}px;
    position: relative;
    display: flex;
    width: 175px;
    flex-shrink: 0;
`
const Bar = styled.div`
    position: relative;
    height: 100%;

`
const RaceBar = styled(Bar)`
    width: 50px;
    border-left: 2px solid var(--bordergrey); 
    border-right: 2px solid var(--bordergrey); 
    border-bottom: 2px solid var(--bordergrey); 
    overflow: hidden;
`
const LabelBar = styled(Bar)`
    width: 100px;

`



const Positioned = styled.div`
    position: absolute;
    top: 0; left: 0;
    transition: transform .35s;
    transform: translateY(${props=>props.offset}px);    
`
const Backing = styled(Positioned)`
    background: white;
    width: 100%;
    height: 500px;
`
const EndNotch = styled(Positioned)`
    height: 0;
    width: 100%;
    border-top: 1px solid var(${props => props.infinitesimal? '--offwhitefg' : '--bordergrey'});
    border-bottom: 1px solid var(${props => props.infinitesimal? '--offwhitefg' : '--bordergrey'});
`
const Segment = styled(Positioned)`
    /*outline: 2px solid var(--bordergrey);*/

`

const LabelSection = styled(Positioned)`
    @media ${media.optimal}{ font-size: 16px; }
    @media ${media.compact}{ font-size: 13px; }
    display: flex;
    align-items: center;
    white-space: nowrap;
    height: 0;
    margin-top: ${props=>props.specialOffset? -.5 : 0}rem;
`
const LabelNotch = styled.div`
    width: 12px; 
    border-top: .5px solid var(--bordergrey);
    border-bottom: .5px solid var(--bordergrey);
    margin-right: 10px;
`
const Compressed = styled.div`
    @media ${media.optimal}{ 
        font-size: 16px; 
        height: ${props=> props.specialOffset? 1 : 1.25}rem;
    }
    @media ${media.compact}{ 
        font-size: 13px; 
        height: ${props=> props.specialOffset? .825 : 1}rem;
    }
    display: flex;
    align-items: center;
    white-space: nowrap;
    
`
const CompressedLabels = styled.div`
    position: absolute;
    bottom: -.625rem;
    display: flex; flex-direction: column;
    padding-left: 22px;
`

const Label = styled.div`
    ${props => props.selected? 'color: var(--strokepeach);' : ''}

`
const Percentage = styled.div`
    margin-left: 7px;
    font-weight: bold;
     ${props => props.selected? 'color: var(--strokepeach);' : ''}
`

@observer class RaceSegment extends React.Component{
    @observable oldHatches = this.props.race
    @observable newHatches = this.props.race //same at outset
    @action setHatches = (which, val) => {this[which+'Hatches'] = val}
    /*
        segments are keyed by index, not race, so that they animate
        organically; so they need to keep track via lifecycle methods
        of when the assigned race changes, and play an animation
        showing the pattern changing
    */
    componentDidUpdate(oldProps){
        if(oldProps.race !== this.props.race){
            this.setHatches('new',this.props.race)
        }
    }
    render(){
        const {race, infinitesimal, zero, ...restOfProps} = this.props
        return(
            <Segment
                {...restOfProps}
            >
                <Hatches 
                    className = {[
                        this.oldHatches,
                        this.oldHatches!==this.newHatches?'animating' : ''
                    ].join(' ')} 
                    infinitesimal = {infinitesimal}
                    zero = {zero}
                    // onAnimationEnd = {()=}

                />
                <NewHatches 
                    className = {[
                        this.newHatches,
                        this.oldHatches!==this.newHatches?'animating' : ''
                    ].join(' ')} 
                    onAnimationEnd = {()=>{ this.setHatches('old',this.props.race) }}
                    infinitesimal = {infinitesimal}
                    zero = {zero}
                />
            </Segment>
        )
    }
}

const hatch1 = require('../assets/hatch1-2.svg')
const hatch2 = require('../assets/hatch2-4.svg')
const hatch3 = require('../assets/hatch3-2.svg')
const hatch4 = require('../assets/hatch4-2.svg')
const hatch5 = require('../assets/hatch5-2.svg')
const animateIn = keyframes`
    from{ transform: translateX(100%);}
    to{ transform: translateX(0%);}
`
const animateOut = keyframes`
    from{ transform: translateX(0%);}
    to{ transform: translateX(-100%);}
`
const Hatches = styled.div`
    position: absolute;
    width: 100%; height: 100%;
    mask-repeat: repeat;
    background-color: ${props => props.infinitesimal? 'var(--bordergrey)' : props.selected? 'var(--peach)' :  'var(--bordergrey)'};
    mask-size: 30px;
    ${props => props.zero? 'display: none;' : ''}
    &.asian{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch3})` : 'none'};
        mask-position-y: -7px;
    }
    &.black{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch4})` : 'none'};
    }
    &.latinx{ 
        mask-image: ${props=>!props.infinitesimal? `url(${hatch1})` : 'none'};
    }
    &.white{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch2})` : 'none'};
    }
    &.other{
        mask-size: 25px;
        mask-image: ${props=>!props.infinitesimal? `url(${hatch5})` : 'none'};
    }
    animation-duration: .25s;
    animation-fill-mode: forwards;
    &.animating{
        animation-name: ${animateOut}
    }
`

const NewHatches = styled(Hatches)`
    transform: translateX(50px);
    &.animating{
        animation-name: ${animateIn}
    }
`




export default RaceBreakdownBar
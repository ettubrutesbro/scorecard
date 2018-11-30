import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'
import media from '../utilities/media'
import {capitalize} from '../utilities/toLowerCase'
import demopop from '../data/demographicsAndPopulation'


const races = ['asian','black','latinx','white','other']

@observer class RaceBreakdownBar extends React.Component{
    render(){
    const {props} = this
    const {height, store} = props
    const {county, screen, hoveredRace} = store

    const clt = screen === 'compact'? 9 : 8//compressed label threshold (% below which label becomes compressed)
    const est = screen === 'compact'? 22: 24//exception segment threshold (% below which the last non-compressed seg has its label offset)

    let numOfCompressedLabels = 0

    const racePercentages = races.map((race)=>{
        const pct = demopop[county||'california'][race]
        if(pct <= clt && pct > 0) numOfCompressedLabels++
        return {label:race, percentage: pct}
    }).sort((a,b)=>{
        return b.label === 'other'? -2 : a.percentage > b.percentage? -1 : a.percentage < b.percentage? 1 : 0
    })

    const totalOfPcts = racePercentages.map((o)=>{return o.percentage}).reduce((a,b)=>{return a+b})
    
    const compressedLabels = racePercentages.filter((r)=>{return r.percentage <= clt && r.percentage > 0})

    return(
        <RaceBreakdown height = {height} >
        <RaceBar
            lastSegSelected = {racePercentages[racePercentages.length-1].label === store.race}
        >
        {racePercentages.map((race,i,arr)=>{
            const previousSegs = arr.slice(0,i)
            const offset = previousSegs.map((seg)=>{
                return (seg.percentage * 100) / totalOfPcts
            }).reduce((a,b)=>a+b,0)

            const pct = totalOfPcts!==100? race.percentage * 100 / totalOfPcts : race.percentage
            console.log(race.label, race.label===hoveredRace)
            return (
                <React.Fragment>
                <Backing 
                    key = {'backing'+i}
                    offset = {(offset/100) * height}
                    selected = {race.label === store.race}
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
                    selected = {race.label === store.race}
                    hovered = {race.label === hoveredRace}

                    onMouseEnter = {()=>store.setHover('race',race.label)}
                    onMouseLeave = {()=>store.setHover('race',null)} 
                    hoverable = {store.indicator? store.setHover('race',race.label,true) : ()=>{}}
                />
                <EndNotch 
                    key = {'hatch'+i} 
                    offset = {(offset/100) * height} 
                    infinitesimal = {pct < 3}
                    hide = {i===0}
                    selected = {race.label === store.race || (i>0 && arr[i-1].label === store.race) }

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
                            (numOfCompressedLabels===3 && racePercentages[1].percentage < est)
                            || (numOfCompressedLabels ===2 && racePercentages[2].percentage < est)
                        }

                        onMouseEnter = {()=>store.setHover('race',race.label)} 
                        onMouseLeave = {()=>store.setHover('race',null)} 
                        hoverable = {store.indicator? store.setHover('race',race.label,true) : ()=>{}}
                
                    >
                        <LabelNotch  selected = {race.label === store.race}/>
                        <Label selected = {race.label === store.race}> {capitalize(race.label)} </Label>
                        <Percentage selected = {race.label === store.race}> {race.percentage}%</Percentage>
                    </LabelSection>
                ): (<React.Fragment />)
            })}
            {racePercentages[racePercentages.length-1].percentage < clt && racePercentages[racePercentages.length-1].percentage > 0 &&
                <LabelSection offset = {height+1} >
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
                                (numOfCompressedLabels===3 && racePercentages[1].percentage < est)
                                || (numOfCompressedLabels ===2 && racePercentages[2].percentage < est)
                            }
                            onMouseEnter = {()=>store.setHover('race',r.label)} 
                            onMouseLeave = {()=>store.setHover('race',null)} 
                            hoverable = {store.indicator? store.setHover('race',r.label,true) : ()=>{}}
                
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
}

const RaceBreakdown = styled.div`
    height: ${props=>props.height}px;
    position: relative;
    display: flex;
    @media ${media.optimal}{
        width: 175px;
    }
    @media ${media.screen}{
        width: 175px;
    }
    flex-shrink: 0;
`
const Bar = styled.div`
    position: relative;
    height: 100%;

`
const RaceBar = styled(Bar)`
    width: 50px;
    /*outline: 2px solid var(--bordergrey);*/
    /*border-left: 2px solid var(--bordergrey); */
    /*border-right: 2px solid var(--bordergrey); */
    /*border-bottom: 2px solid var(--bordergrey); */
    box-shadow: 0 2px 0 var(${props=>props.lastSegSelected?'--peach':'--bordergrey'});
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
    border: 1.5px solid var(${props=>props.selected?'--peach': '--bordergrey'});

`
const EndNotch = styled(Positioned)`
    height: 0;
    left: 2px;
    width: calc(100% - 4px);
    border-top: .5px solid var(${props => props.selected? '--peach': props.infinitesimal? '--offwhitefg' : '--bordergrey'});
    border-bottom: .5px solid var(${props => props.selected? '--peach': props.infinitesimal? '--offwhitefg' : '--bordergrey'});
    display: ${props=>props.hide?'none':'block'};
`
const Segment = styled(Positioned)`
    /*outline: 2px solid var(--bordergrey);*/
`

const LabelSection = styled(Positioned)`
    @media ${media.optimal}{ 
        font-size: 16px; 
        margin-top: ${props=>props.specialOffset? -.6 : 0}rem;
    }
    @media ${media.compact}{ 
        font-size: 13px; 
        margin-top: ${props=>props.specialOffset? -.5 : 0}rem;
    }
    display: flex;
    align-items: center;
    white-space: nowrap;
    height: 0;

    cursor: ${props=> props.hoverable?'pointer':'auto'};

`
const LabelNotch = styled.div`
    width: 12px; 
    border-top: .75px solid var(${props=>props.selected?'--peach' : '--bordergrey'});
    border-bottom: .75px solid var(${props=>props.selected?'--peach' : '--bordergrey'});
    margin-right: 10px;
`
const Compressed = styled.div`
    @media ${media.optimal}{ 
        font-size: 16px; 
        height: ${props=> props.specialOffset? 1.15 : 1.25}rem;
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
    @media ${media.optimal}{
        bottom: -1rem;
    }
    @media ${media.compact}{
        bottom: -.25rem;
    }
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
        const {race, infinitesimal, zero, selected, hovered, hoverable, ...restOfProps} = this.props
        return(
            <Segment
                selected = {selected}
                {...restOfProps}
            >
                <Hatches 
                    className = {[
                        this.oldHatches,
                        this.oldHatches!==this.newHatches?'animating' : ''
                    ].join(' ')} 
                    infinitesimal = {infinitesimal}
                    zero = {zero}
                    selected = {selected}
                    hovered = {hovered}
                    hoverable = {hoverable}
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
                    selected = {selected}
                    hovered = {hovered}
                    hoverable = {hoverable}
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
    /*mask-repeat: repeat;*/
    background-color: ${props => props.hovered||props.selected? 'var(--peach)' :  'var(--bordergrey)'};
    mask-size: 32px;
    
    ${props => props.zero? 'display: none;' : ''}
    &.asian{
        mask-image: ${props=>!props.infinitesimal? `url(${hatch3})` : 'none'};
        mask-position: 2px -7px;
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
        mask-position-x: -1px;
        mask-image: ${props=>!props.infinitesimal? `url(${hatch5})` : 'none'};
    }
    animation-duration: .25s;
    animation-fill-mode: forwards;
    &.animating{
        animation-name: ${animateOut}
    }
    cursor: ${props => props.hoverable? 'pointer' : 'auto'};
`

const NewHatches = styled(Hatches)`
    transform: translateX(100%);
    &.animating{
        animation-name: ${animateIn}
    }
`




export default RaceBreakdownBar
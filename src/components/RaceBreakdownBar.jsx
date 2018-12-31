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
    const {height, store, width} = props
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
        <React.Fragment>
        <RaceBreakdown width = {width} height = {height} horizontal = {screen==='mobile'} >
        <RaceBar
            width = {width}
            horizontal = {screen==='mobile'}
            lastSegSelected = {racePercentages[racePercentages.length-1].label === store.race}
        >
        {racePercentages.map((race,i,arr)=>{
            const previousSegs = arr.slice(0,i)
            const offset = previousSegs.map((seg)=>{
                return (seg.percentage * 100) / totalOfPcts
            }).reduce((a,b)=>a+b,0)

            const pct = totalOfPcts!==100? race.percentage * 100 / totalOfPcts : race.percentage
            console.log(race.label, race.label===hoveredRace)

            const hoverProps = store.screen !== 'mobile'? {
                onMouseEnter: ()=>{store.setHover('race',race.label)},
                onMouseLeave: ()=>{store.setHover('race',null)},
                hoverable: store.indicator? ()=>{store.setHover('race',race.label,true)} : () => {}
            } : {}

            return (
                <React.Fragment
                    key = {'racefrag'+i}
                >
                <Backing 
                    horizontal = {screen==='mobile'}
                    key = {'backing'+i}
                    offset = {(offset/100) * (screen==='mobile'? width : height)}
                    selected = {race.label === store.race}
                />
                <RaceSegment
                    horizontal = {screen==='mobile'}
                    key = {i}
                    offset = {(offset/100) * (screen==='mobile'? width : height)}
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


                    onClick = {()=>store.completeWorkflow('race',race.label)}

                    {...hoverProps}
                    // onMouseEnter = {()=>store.setHover('race',race.label)}
                    // onMouseLeave = {()=>store.setHover('race',null)} 
                    // hoverable = {store.indicator? store.setHover('race',race.label,true) : ()=>{}}
                />



                {screen!=='mobile' && 
                <EndNotch 
                    key = {'hatch'+i} 
                    offset = {(offset/100) * height} 
                    infinitesimal = {pct < 3}
                    hide = {i===0}
                    selected = {race.label === store.race || (i>0 && arr[i-1].label === store.race) }

                />
                }
                </React.Fragment>
            )
        })
        }

        </RaceBar>
        {screen !== 'mobile' &&
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
                        onClick = {()=>store.completeWorkflow('race',race.label)}
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
                            onClick = {()=>store.completeWorkflow('race',r.label)}
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
        }
        </RaceBreakdown>
        {screen === 'mobile' && 
            <PercentageTable percentages = {racePercentages} store = {store} />
        }
        </React.Fragment>
    )
}
}

const RaceBreakdown = styled.div`
    height: ${props=>props.height}px;
    width: ${props => props.horizontal? props.width+'px' : '175px'};
    position: relative;
    display: flex;

    flex-shrink: 0;
`
const Bar = styled.div`
    position: relative;
    height: 100%;

`
const RaceBar = styled(Bar)`
    width: ${props=>props.horizontal? props.width+'px' : '50px'};
    box-shadow: ${props=>props.horizontal? '2px 0 0 0' : '0 2px 0 0'} var(${props=>props.lastSegSelected?'--peach':'--bordergrey'});
    overflow: hidden;
`
const LabelBar = styled(Bar)`
    width: 100px;
`
const Positioned = styled.div`
    position: absolute;
    top: 0; left: 0;
    transition: transform .35s;
    transform: translate${props=>props.horizontal? 'X' : 'Y'}(${props=>props.offset}px);    
`
const Backing = styled(Positioned)`
    background: white;
    width: 100%;
    height: ${props => props.horizontal? '100%' : '500px'};
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
    
    cursor: ${props=> props.hoverable?'pointer':'auto'};
    
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
        const {race, infinitesimal, zero, selected, hovered, hoverable, horizontal, ...restOfProps} = this.props
        return(
            <Segment
                selected = {selected}
                horizontal = {horizontal}
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

                    horizontal = {horizontal}
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

                    horizontal = {horizontal}
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

const vertanimateIn = keyframes`
    from{ transform: translateY(100%);}
    to{ transform: translateY(0%);}
`
const vertanimateOut = keyframes`
    from{ transform: translateY(0%);}
    to{ transform: translateY(-100%);}
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
        animation-name: ${props => props.horizontal? vertanimateOut : animateOut}
    }
    cursor: ${props => props.hoverable? 'pointer' : 'auto'};
`

const NewHatches = styled(Hatches)`
    transform: translate${props=>props.horizontal?'Y':'X'}(100%);
    &.animating{
        animation-name: ${props => props.horizontal? vertanimateIn : animateIn}
    }
`


const PercentageTable = (props) => {
    const store = props.store
    const pcts = props.percentages
    return(
        <PctTable>
            <HorizontalEndNotch />
            <PctBlock selected = {store.race === pcts[0].label}>
            <b>{pcts[0].percentage}%</b>&nbsp;of&nbsp;them&nbsp;are&nbsp;{capitalize(pcts[0].label)}, 
            </PctBlock>
            {pcts.slice(1).map((pct,i)=>{
                return i+1<pcts.length-1?(
                    <PctBlock selected = {pct.label === store.race}>
                        <b>{pct.percentage}%</b>&nbsp;{capitalize(pct.label)},
                    </PctBlock>
                ) : (
                    <PctBlock selected = {pct.label === store.race}>
                        and <b>{pct.percentage}%</b>&nbsp;are&nbsp;{capitalize(pct.label)}.
                    </PctBlock>
                )
            })}
        </PctTable>
    )
}

const PctTable = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;
    line-height: 22px;
    letter-spacing: 0.5px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--bordergrey);
`
const PctBlock = styled.span`
    margin-right: 6px;
    b {
        font-weight: 600;
    }
    color: ${props => props.selected? 'var(--strokepeach)' : 'var(--normtext)'};
`
const HorizontalEndNotch = styled.div`
    position: absolute;
    left: 0;
    top: -20px;
    width: 0px; height: 12px;
    border-left: 2px solid ${props => props.selected? 'var(--strokepeach)':' var(--bordergrey)'};
`

export default RaceBreakdownBar
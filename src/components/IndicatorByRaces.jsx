
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

import HorizontalBarGraph from './HorizontalBarGraph'

import {capitalize} from '../utilities/toLowerCase'
import media from '../utilities/media'

const width = window.innerWidth - 50

const races = [
    'asian', 'black', 'latinx', 'white', 'other'
]


const Label = styled.span`
    color: ${props => props.invalid? 'var(--fainttext)' : props.hovered || props.selected?  'var(--strokepeach)' : 'var(--normtext)'};
    span{
        color: ${props => props.hovered || props.selected? 'var(--peach)' : 'var(--fainttext)'};
    }
`
const Wrapper = styled.div`
    // margin-top: 45px;
    position: absolute;
    
    width: 100%;
    bottom: 0;
    z-index: 1;
    transform: translate(${props => props.offset});
    transition: transform ${props=>props.hide? .5 : .35}s  cubic-bezier(0.215, 0.61, 0.355, 1), opacity ${props=>props.hide? '.2s .15s' : '.1s'};
    opacity: ${props => props.hide? 0 : 1};
    cursor: ${props=>props.clickable?'pointer':'auto'};

    @media ${media.mobile}{
        top: 490px;
    }
`
@observer
export default class IndicatorByRaces extends React.Component{
    @observable hovered = false
    @action hover = (tf) => this.hovered = tf
    componentDidUpdate(){
        if(this.props.expand) this.hover(false)
    }
    render(){
        const {indicator, year, county, colorScale, screen, setHover, hoveredRace} = this.props.store
        const selectedRace = this.props.store.race
        const ind =  county? indicators[indicator].counties[county] : indicators[indicator].counties.california


        const indicatorPerformanceByRace = races.map((race)=>{
            let isSomeBullshit = false
            let val
            if(ind[race][year]===0 || (ind[race][year] && ind[race][year]!=='*')){
                //use value as is
                val = ind[race][year]
            }
            else{
                //trueValue is N/A
                val = 0
                isSomeBullshit = ind[race][year]==='*'? 'Data too small or unstable' : 'No data'
                isSomeBullshit = (<Label invalid>{isSomeBullshit}</Label>)
            }
            const who = semanticTitles[indicator].shortWho || semanticTitles[indicator].who
            const selected = race===selectedRace
            return {
                id: race,
                label: <Label selected = {selected}>{capitalize(race)}<span> {who}</span></Label>,
                value: val,
                hoverable: isSomeBullshit? false : true,
                trueValue: isSomeBullshit || false,
                fill: race===selectedRace? 'var(--peach)' : colorScale? colorScale(ind[race][year]) : ''
            }
        })

        const vertOffsets = [-150, -50]

        return(
            <Wrapper
                offset = {
                    this.props.hideForSources? `0, ${vertOffsets[0]}px` 
                    : !this.props.expand? `0, ${vertOffsets[1]}px` 
                    : `0, ${vertOffsets[0]}px`
                }
                clickable = {!this.props.expand}
                onClick = {!this.props.expand? this.props.onClick: ()=>{}}
                onMouseEnter = {this.props.expand? ()=>{}: ()=>this.hover(true)}
                onMouseLeave = {this.props.expand? ()=>{}: ()=>this.hover(false)}
                hide = {this.props.hideForSources}
            >
                <HorizontalBarGraph
                    expandable
                    modes = {{
                        expanded: {width: screen==='mobile'?width : screen==='optimal'?610:480, height: screen==='mobile'? 160: 150},
                        collapsed: {width: screen==='mobile'?width : screen==='optimal'?610:480, height: 50},
                        sources: {width: 100, height: 150}
                    }}
                    currentMode = {this.props.hideForSources? 'sources' : !this.props.expand? 'collapsed' : 'expanded'}
                    fullHeight = {this.props.expand} //kinda redundant for the above but in place for vestige styledcomponents changes

                    hideGraph = {!this.props.expand || this.props.hideForSources}

                    onHoverRow = {(val)=>{
                        setHover('race',val)}
                    }
                    hovered = {hoveredRace}

                    selectable
                    header = {
                        <Header 
                            hovered = {!this.props.expand? this.hovered : false} 
                            offset = {!this.props.expand}
                            buttonMode = {!this.props.expand}
                        >
                            <span>Indicator breakdown</span> by race
                        </Header>
                    }
                    bars = {this.props.expand? indicatorPerformanceByRace : []}
                    labelWidth = {screen === 'mobile'? 125 : 150}
                    selectBar = {(val)=>this.props.store.completeWorkflow('race', val)}
                />
            </Wrapper>
        )
    }
} 

const Header = styled.div`
    margin: 0 20px;
    padding: 0 15px;
    @media ${media.mobile}{
        margin: 0 15px;
    }
    background: var(--offwhitefg);
    transform: translate(${props=>props.offset?'0, 25px':'0,0'});
    transition: transform ${props=>props.hide? .2 : .35}s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .2s;
    color: ${props => props.hovered? 'var(--strokepeach)' : 'var(--normtext)'};

`
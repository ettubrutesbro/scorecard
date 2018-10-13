import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import chroma from 'chroma-js'

import indicators from '../data/indicators'

import media from '../utilities/media'

@observer
export default class Legend extends React.Component{

    @observable hovered = false
    @observable pcts = [0,0,0,0]
    @action handleHover = (tf) => this.hovered = tf

    render(){
        const {store} = this.props
        const {indicator, race, colorScale, colorOptions,year} = store

        if(indicator){
        const ind = indicators[indicator]

        const allNums = Object.keys(ind.counties).map((cty)=>{
                return cty==='california'? '*' : ind.counties[cty][race||'totals'][year]
            }).filter((o)=>{
                const inv = o==='' || o==='*'
                // if(inv) invalids++
                return inv?false : true
            })
        const breaks = chroma.limits(allNums, colorOptions.breakAlgorithm, colorOptions.classes)
        
        const mode = this.hovered? 'true' : ''

        const nums = breaks.map((e,i,a)=>{
            const count = allNums.filter((num)=>{ 
                if(i < a.length-2) return num >=breaks[i] && num < breaks[i+1]
                else if(i < a.length-1) return num >=breaks[i] && num <= breaks[i+1]
            }).length 
            return count
        })
        const pcts = breaks.map((e,i,a)=>{
            return (nums[i] / allNums.length)
        })


        return(
            <Lgd
                onMouseEnter = {()=>this.handleHover(true)}
                onMouseLeave = {()=>this.handleHover(false)}
            >
                <NumCountiesLabel show = {this.hovered}> 
                    Number of counties in each range 
                </NumCountiesLabel>
                <ColorGuideLabel hide = {this.hovered}>
                    Color guide
                </ColorGuideLabel>
                {
                    breaks.map((ele,i,arr)=>{
                    
                        // let lo = los[i].toFixed(1)
                        // let hi = his[i].toFixed(1)
                        // if(lo[lo.length-1]==='0') lo = Number(lo).toFixed(0)
                        // if(hi[hi.length-1]==='0') hi = Number(hi).toFixed(0)

                        const numCountiesInClass = nums[i]
                        const pctCountiesInClass = pcts[i]
                        const prevPctsOffset = i>0? pcts.slice(0,i).reduce((a,b)=>{return Number(a)+Number(b)}) : 0

                        const fill = colorScale((breaks[i] + breaks[i+1]) / 2)
                        return i<arr.length-1?(
                            <Section classes = {arr.length-1} key = {'legendsection'+i}>
                                <Swatch 
                                    fill = {fill}
                                    index = {i}
                                    classes = {arr.length-1}
                                    scale = {pctCountiesInClass}
                                    offset = {prevPctsOffset}
                                    mode = {this.hovered? 'truescale' : ''}
                                />
                                <Label 
                                    firstLast = {i===0?'first':i===arr.length-2?'last':''}
                                    offset = {prevPctsOffset}
                                    index = {i}
                                    classes = {arr.length-1}
                                    scale = {pctCountiesInClass}
                                    mode = {this.hovered? 'truescale' : ''}
                                >
                                    <LabelRange hide = {this.hovered}
                                        last = {i===arr.length-2}
                                    >
                                        {Math.ceil(breaks[i])} <Dash /> {Math.floor(breaks[i+1])}
                                        <Pct>%</Pct>
                                    </LabelRange>
                                    <LabelNum show = {this.hovered}>
                                        {nums[i]!==0 && nums[i]}
                                    </LabelNum>
                                </Label>
                            </Section>
                        ): ''
                    })
                }
            </Lgd>
        )
        }
        else {
            return(
                <div />                
            )
        }
    }
}

const Lgd = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    overflow: hidden;
    cursor: pointer;
`

const Dash = styled.div`
    height: 0;
    border-top: 1px solid var(--bordergrey);
    width: 5px;
    margin: 0 3px;
`
const Pct = styled.span`
    margin-left: 2px;
`


const Section = styled.div`
    @media ${media.optimal}{
        padding-top: 35px;
    }
    @media ${media.compact}{

        padding-top: 30px;   
    }
    width: ${props=>100/props.classes}%;
`

const Swatch = styled.div`
    @media ${media.optimal}{
        height: 15px;
    }
    @media ${media.compact}{
        height: 12px;
    }
    background: ${props => props.fill};
    position: absolute;
    top: 32px;
    left: -100%;
    width: 100%;
    z-index: ${props => props.classes - props.index};
    transition: all ${props=> .25 + (props.index*.05)}s;
    transform: translateX(${props=>props.mode==='truescale'?((props.scale+ props.offset)*100): (100/props.classes)*(props.index+1)}%);
`
const Label = styled.div`
    color: var(--fainttext);
    letter-spacing: 0.05px;
    margin-top: 30px;
    font-size: 13px;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    width: 25%;
    justify-content: center;

        transform: translateX(${p=> p.mode==='truescale'&&p.firstLast==='first'?0
            :p.mode==='truescale'?  481*((p.offset+(p.scale/2)))+'px' 
            : (481/p.classes)*(p.index) + 'px'}) ${p=>p.mode!=='truescale' && !p.firstLast? 'translateX(40%)' 
            : 'translateX(0)'
        };        
    


    ${props=>props.firstLast==='last'? `
        right: 0; left: auto;
        transform: translateX(0);
        text-align: right;
    ` : ''}

    transition: transform ${props=>.25 + (props.index*.05)}s;
`
    const LabelRange = styled.div`
        left: ${props=>props.last? 'auto' : 0};
        right: ${props=>props.last? 0 : 'auto'};
        display: flex;
        align-items: center;
        position: absolute;
        transition: all .25s;
        opacity: ${props=>props.hide?0:1};
        // transform: translateY(${props=>props.hide?-10:0}px);

    `
    const LabelNum = styled.div`
        left: 0;
        position: absolute;
        width: 100%;
        transition: all .25s;
        opacity: ${props=>props.show?1:0};
        // transform: translateY(${props=>props.show?0:10}px);
    `

const Titles = styled.div`
    position: absolute;
    top: 5px; font-size: 13px;
    right: 0;
    color: var(--fainttext);
`
const ColorGuideLabel = styled(Titles)`
    opacity: ${props => props.hide?
        0: 1
    };
    transition: opacity .35s;
`
const NumCountiesLabel = styled(Titles)`
    opacity: 0;
    transition: opacity .25s;
    ${props => props.show? `
        opacity: 1;
    `: ''}

`

const NumCounties = styled(Label)`

    
`
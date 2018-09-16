import React from 'react'
import styled from 'styled-components'

import chroma from 'chroma-js'

import indicators from '../data/indicators'

export default class Legend extends React.Component{
    render(){
        const {store} = this.props
        const {indicator, race, colorScale, colorOptions,year} = store

        if(indicator){
        const ind = indicators[indicator]

        const allNums = Object.keys(ind.counties).map((cty)=>{
                return ind.counties[cty][race||'totals'][year]
            }).filter((o)=>{
                const inv = o==='' || o==='*'
                // if(inv) invalids++
                return inv?false : true
            })
        console.log(allNums)
        const breaks = chroma.limits(allNums, colorOptions.breakAlgorithm, colorOptions.classes)

        return(
            <Lgd>
                {
                    breaks.map((ele,i,arr)=>{
                        console.log(ele)
                        
                        let lo = i===0? ele.toFixed(1) : (ele+0.1).toFixed(1)
                        let hi = i<arr.length-1? arr[i+1].toFixed(1): 100
                        if(lo[lo.length-1]==='0') lo = Number(lo).toFixed(0)
                        if(hi[hi.length-1]==='0') hi = Number(hi).toFixed(0)

                        const fill = colorScale((ele + (i<arr.length-1?arr[i+1]:100)) / 2)
                        return i<arr.length-1?(
                            <Section classes = {arr.length-1}>
                                <Swatch fill = {fill} />
                                <Label firstLast = {i===0?'first':i===arr.length-2?'last':''}> 
                                    {lo} <Dash /> {hi} 
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
                <div> No data yet </div>
            )
        }
    }
}

const Lgd = styled.div`
    display: flex;
    width: 100%;
    max-width: 640px;
`

const Dash = styled.div`
    height: 0;
    border-top: 1px solid var(--bordergrey);
    width: 8px;
    margin: 0 5px;
`

const Section = styled.div`
    width: ${props=>100/props.classes}%;
`

const Swatch = styled.div`
    height: 15px;
    background: ${props => props.fill};

`
const Label = styled.div`
    color: var(--fainttext);
    letter-spacing: 0.05px;
    margin-top: 5px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: ${props=>props.firstLast==='first'? 'flex-start' : props.firstLast==='last'? 'flex-end' : 'center'};

`
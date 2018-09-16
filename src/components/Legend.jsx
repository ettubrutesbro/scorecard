import React from 'react'
import styled from 'styled-components'

import chroma from 'chroma-js'

import indicators from '../data/indicators'

export default class Legend extends React.Component{
    render(){
        const {store} = this.props
        const {indicator, race, colorScale, colorOptions,year} = store
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
                {breaks.join(', ')}
                {
                    breaks.map((ele,i)=>{
                        console.log(ele)
                        const fill = colorScale(ele)
                        return i!==0? <Swatch fill = {fill} /> : ''
                    })
                }
            </Lgd>
        )
    }
}

const Lgd = styled.div`
    display: flex;
`

const Swatch = styled.div`
    width: 100px;
    height: 10px;
    border: 1px black solid;
    background: ${props => props.fill};

`
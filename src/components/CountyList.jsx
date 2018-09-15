import React from 'react'
import styled, {keyframes} from 'styled-components'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import ReactTooltip from 'react-tooltip'

const GridList = styled.ul`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    // grid-template-columns: repeat(auto-fill, 1fr);
    // grid-template-columns: minmax(100px, 1fr);
    grid-gap: 10px;
    flex-wrap: wrap;
    // height: 100%;
    justify-content: space-between;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    padding: 0;
`
const GridItem = styled.li`
    // margin: 1%;
    color: ${props => props.disabled? '#d7d7d7' : 'black'};
    padding: 6px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    // justify-content: center;
    white-space: nowrap;
    &:hover{
        background: #f3f3f5;
    }
`


const CountyList = (props) => {
    const {indicator, county, race, year} = props.store
    return(
        <GridList>
            <ReactTooltip effect = "solid" />
            {counties.sort((a,b)=>{
                if(a.id < b.id) return -1
                else if (a.id > b.id) return 1
                else return 0
            }).map((cty)=>{
                let disabled = false 
                if(indicator){
                    // console.log(indicators[indicator].counties[cty])
                    const value = indicators[indicator].counties[cty.id][race||'totals'][year]   
                    
                    if(!value || value === '*') disabled = true
                }
                return <GridItem
                    disabled = {disabled}
                    key = {"countylist"+cty.id}
                    onClick = {()=>{props.store.completeWorkflow('county',cty.id)}}
                    data-tip = {disabled? `${indicator} data is not available for ${cty.label}.` : null}
                > 
                    {cty.label}
                </GridItem>
            })
            }
        </GridList>
    )
}

export default CountyList
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {counties} from '../assets/counties'

const GridList = styled.ul`
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    flex-wrap: wrap;
    height: 100%;
    justify-content: space-between;
    flex-direction: column;
    list-style-type: none;
    margin: 0;
    padding: 0;
`
const GridItem = styled.li`
    // margin: 1%;
    padding: 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    // justify-content: center;
    &:hover{
        background: #f3f3f5;
    }
`


const CountyList = (props) => {
    return(
        <GridList>
            {counties.sort((a,b)=>{
                if(a.id < b.id) return -1
                else if (a.id > b.id) return 1
                else return 0
            }).map((county)=>{
                return <GridItem
                    key = {"countylist"+county.id}
                    onClick = {()=>{props.store.completeWorkflow('county',county.id)}}
                > 
                    {county.label}
                </GridItem>
            })
            }
        </GridList>
    )
}

export default CountyList
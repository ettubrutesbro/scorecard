import React from 'react'
import styled, {keyframes} from 'styled-components'

import {counties} from '../assets/counties'

import {Tooltip} from 'react-tippy'

const GridList = styled.ul`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
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
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    // justify-content: center;
    white-space: nowrap;
    &:hover{
        background: #f3f3f5;
    }
`
const TestTooltip = styled.div`
    position: absolute;
    background: black;
    color: white;
    padding: 10px;
    margin-top: 5px;    
`

const CountyList = (props) => {
    return(
        <GridList>
            {counties.sort((a,b)=>{
                if(a.id < b.id) return -1
                else if (a.id > b.id) return 1
                else return 0
            }).map((county)=>{
                return 
                    (
                    <Tooltip title = "hello world" followCursor
                        html = {(<TestTooltip> Hello </TestTooltip>)}
                    >
                        <GridItem
                            key = {"countylist"+county.id}
                            onClick = {()=>{props.store.completeWorkflow('county',county.id)}}
                        > 
                            {county.label}
                        </GridItem>
                    </Tooltip>
                    )

            })
            }
        </GridList>
    )
}

export default CountyList
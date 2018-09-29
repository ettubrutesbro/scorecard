import React from 'react'
import styled, {keyframes} from 'styled-components'

import {find} from 'lodash'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import ReactTooltip from 'react-tooltip'

const GridList = styled.ul`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    // grid-template-columns: repeat(auto-fill, 1fr);
    // grid-template-columns: minmax(100px, 1fr);
    grid-gap: 8px;
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
    color: ${props => props.selected? 'var(--strokepeach)' : props.disabled? '#d7d7d7' : 'black'};
    padding: 6px 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    // justify-content: center;
    white-space: nowrap;
    font-size: 13px;
    background: ${props => props.selected? 'var(--faintpeach)' : 'transparent'};
    border: 1px solid ${props => props.selected? 'var(--strokepeach)' : 'transparent'};
    &:hover{
        background: #f3f3f5;
    }
`

const Titleblock = styled.div`
    h1{
        margin: 0;
        margin-left: 12px;
        font-weight: 400;
        font-size: 24px;
        margin-right: 10px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
`
const Search = styled.div`
    // transform: translateY(3px);
    width: 200px;
    position: relative;
    padding-left: 25px;
    // padding-bottom: 3px;
    // border: 1px solid red;
    border-bottom: 1px solid var(--bordergrey);
    display: flex;
    align-items: center;
`
const SearchIcon = styled.div`
    // position: absolute;
    // top: 6px;
    // left: 15px;
    width: 15px; height: 15px;
    border: 1px solid black;
`
const SearchInput = styled.input`
    appearance: none;
    border: none;
    outline: none;
    padding: 6px 15px;
`

const AllCountiesBtn = styled.div`
    margin-right: 15px;
    border: ${props => props.btnMode? '1px solid var(--bordergrey)' : ''};
    cursor: ${props => props.btnMode? 'pointer' : ''};
    padding: 6px 15px;
    display: inline-flex;
    align-items: center;
    font-size: 13px;
`
const Faint = styled.span`
    margin-left: 5px;
    color: var(--fainttext);
`
const TitleSide = styled.div`
    display: flex;
    align-items: center;
`

class CountyList extends React.Component{
    
    handleSelection = (cty) => {
        this.props.store.completeWorkflow('county', cty)
        this.props.closeNav()
    }
    render(){
        const {indicator, county, race, year} = this.props.store
        const ctyLabel = county? find(counties, (c)=>{return c.id === county}).label : ''

        return(
            <div>
                <Titleblock>
                    <TitleSide>
                    <h1>Pick a county.</h1>
                    {!county && <Faint> Viewing all counties </Faint>}
                    </TitleSide>
                    <TitleSide>
                    {county && 
                    <AllCountiesBtn
                        onClick= {()=>this.handleSelection(null)}
                        btnMode = {county}
                    >
                    All counties
                        <Faint>
                            (Deselect {ctyLabel} county)
                        </Faint>
                    </AllCountiesBtn>
                    }
                    <Search> 
                        <SearchIcon />
                        <SearchInput placeholder = "Search counties..."/>
                    </Search>
                    </TitleSide>
                </Titleblock>

                <GridList>
                    <ReactTooltip effect = "solid" />
                    {counties.sort((a,b)=>{
                        if(a.id < b.id) return -1
                        else if (a.id > b.id) return 1
                        else return 0
                    }).map((cty)=>{
                        let disabled = false 
                        const selected = cty.id === county
                        if(indicator){
                            // console.log(indicators[indicator].counties[cty])
                            const value = indicators[indicator].counties[cty.id][race||'totals'][year]   
                            
                            if(!value || value === '*') disabled = true
                        }
                        return <GridItem
                            selected = {selected}
                            disabled = {disabled}
                            key = {"countylist"+cty.id}
                            onClick = {()=>{this.handleSelection(cty.id)}}
                            data-tip = {disabled? `${indicator} data is not available for ${cty.label}.` : null}
                        > 
                            {cty.label}
                        </GridItem>
                    })
                    }
                </GridList>
            </div>
        )
    }
}

export default CountyList
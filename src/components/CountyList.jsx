import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import {findDOMNode} from 'react-dom'
import {find} from 'lodash'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'
import ReactTooltip from 'react-tooltip'

import {Search, Tooltip, Button} from './generic'
import SanityCheckTooltip from './generic/SanityCheckTip'


import media, {getMedia} from '../utilities/media'

const GridList = styled.ul`

    display: grid;
    @media ${media.optimal}{
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
        font-size: 16px;
    }
    @media ${media.compact}{
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
        font-size: 13px;
    }
    list-style-type: none;
    margin: 0;
    padding: 0;

`
const GridItem = styled.li`
    position: relative;
    color: ${props => props.sanityHighlight? 'var(--normtext)' : props.selected? 'var(--strokepeach)' : props.disabled? 'var(--fainttext)' : 'black'};
    @media ${media.optimal}{
        padding: 8px 13px;
    }
    @media ${media.compact}{
        padding: 6px 13px;    
    }

    cursor: pointer;
    display: flex;
    align-items: center;
    white-space: nowrap;
    opacity: ${props => props.muted? 0.2 : 1};
    background: ${props => props.selected? 'var(--faintpeach)' : 'transparent'};
    border: 1px solid ${props => props.sanityHighlight? 'var(--bordergrey)' : props.selected? 'var(--strokepeach)' : 'transparent'};
    &:hover{
        background: #f3f3f5;
    }
    &.allctys{
        color: var(--strokepeach);
    }
`

const Titleblock = styled.div`
    h1{
        margin: 0;
        font-weight: 400;
        font-size: 24px;
        margin-right: 10px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media ${media.optimal}{
        margin-bottom: 25px;   
    }
    @media ${media.compact}{
        margin-bottom: 18px;
    }
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
    font-size: 13px;
    color: var(--fainttext);
`
const TitleSide = styled.div`
    display: flex;
    align-items: center;
`
@observer
class CountyList extends React.Component{

    @observable searchString = ''
    @action search = (e) => this.searchString = e.target.value
    

    @action handleSelection = (cty, column, row) => {
        const sel = this.props.store.completeWorkflow('county', cty)
        if(sel) this.props.closeNav()
        else{
            // console.log('sanity check on county!')
            // console.log(this.props.store.sanityCheck)

        }
    }
    render(){
        const {indicator, county, race, year, sanityCheck} = this.props.store
        const ctyLabel = county? find(counties, (c)=>{return c.id === county}).label : ''
        const screen = getMedia()
        const sideChangeThreshold = screen === 'optimal'? 20 : 10

        return(
            <div>
                <Titleblock>
                    <TitleSide>
                    <h1>Pick a county.</h1>
                   
                    </TitleSide>
                    <TitleSide>
                        {/*
                        <Search 
                            placeholder = "Search counties..." 
                            value = {this.searchString}
                            onChange = {this.search} 
                        /> 
                        */}
                    </TitleSide>
                </Titleblock>

                <GridList>
                    {/*
                    <ReactTooltip effect = "solid" 
                        className = 'reactTooltipOverride'
                    />
                    */}
                    <GridItem 
                        className = 'allctys'
                        selected = {!county}
                        onClick = {()=>{this.handleSelection()}}
                        muted = {sanityCheck.county}
                    >
                        California
                    </GridItem>
                    {counties.sort((a,b)=>{
                        if(a.id < b.id) return -1
                        else if (a.id > b.id) return 1
                        else return 0
                    }).filter((cty)=>{
                        return !this.searchString? true : cty.id.includes(this.searchString.toLowerCase())
                    }).map((cty, i)=>{
                        let disabled = false 
                        const selected = cty.id === county
                        if(indicator){
                            const value = indicators[indicator].counties[cty.id][race||'totals'][year]   
                            
                            if((value!==0) && (!value || value === '*')) disabled = true
                        }

                    //finding column and row numbers in order to position sanity check
                    let colNum, rowNum
                    if(i+2 < 6){ //row 0
                        colNum = i+2
                        rowNum = 0
                    }
                    else if((i+2)-5 <= 5){ //row 1
                        colNum = (i+2) -5
                        rowNum = 1
                    }
                    else{ //row 2+
                        for(let it = 0; it*5 < (i+2); it++){
                            rowNum = it
                        }
                        colNum = (i+2) - (5*rowNum)

                    }

                    const sanityChecking = sanityCheck.county && sanityCheck.county===cty.id

                        return <GridItem
                                selected = {selected}
                                sanityHighlight = {sanityChecking}
                                disabled = {disabled}
                                muted = {sanityCheck.county && sanityCheck.county!==cty.id}
                                key = {"countylist"+cty.id}
                                onClick = {!sanityChecking?()=>{this.handleSelection(cty.id, colNum, rowNum)}: ()=>{}}
                                // data-tip = {disabled? `There's no data on ${cty.label} county for this indicator.` : null}
                            > 
                                {sanityChecking && 
                                    <SanityCheckTooltip 
                                        checkType = 'county'
                                        direction = {i > sideChangeThreshold? 'above' : 'below'}
                                        pos = {{x: colNum === 3? 50 : 0, y: 40}}
                                        data = {sanityCheck}
                                        index = {i}
                                        store = {this.props.store}
                                        needsCentering = {colNum===3}
                                        horizontalAnchor = {colNum < 4? 'left' : 'right'}
                                        caretOffset = {colNum === 1? -100 : colNum === 2? -150 : colNum === 4? 100: colNum === 5? 150 : 0}

                                    />
                                }
                                {cty.label}

                            </GridItem>

                    })
                    }
                </GridList>
            </div>
        )
    }
}


// class SanityCheckTooltip extends React.Component{
//     render(){
//         const {index, data, store} = this.props
//         const screen = getMedia()
//         const sideChangeThreshold = screen === 'optimal'? 20 : 10
//         return(
//             <Tooltip
//                 direction = {index > sideChangeThreshold? 'above' : 'below'}
//                 theme = 'actionable'
//                 pos = {{x: screen==='optimal'?87:50, y: 0}}
//             >
//                 <Check>
//                 {data.message}
//                 <SanityControls>
//                     <Button 
//                         className = {screen==='compact'?'compact':''}
//                         label = 'Nevermind, back to list' 
//                         style = {{marginRight: '15px'}}
//                         onClick = {(e)=>{
//                             store.clearSanityCheck('indicator')
//                             e.nativeEvent.stopImmediatePropagation()
//                         }}
//                     />
//                     <Button 
//                         label = 'Yes, continue' 
//                         className = {`dark ${screen}`} 
//                         onClick = {()=>{
//                             data.action()
//                             store.clearSanityCheck('indicator')
//                         }}
// 
//                     />
// 
//                 </SanityControls>
//                 </Check>
//             </Tooltip>    
//         )
//     }
// }
// const Check = styled.div`
//     width: 400px;
//     line-height: 180%;
//     white-space: normal;
//     @media ${media.optimal}{
//         font-size: 16px;
//         padding: 30px;
//     }
//     @media ${media.compact}{
//         font-size: 13px;
//         padding: 20px;
//     }
// 
// `
// const SanityControls = styled.div`
//     margin-top: 20px;
//     display: flex;
//     justify-content: flex-end;
// 
// `

export default CountyList


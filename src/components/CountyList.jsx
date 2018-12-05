import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import {findDOMNode} from 'react-dom'
import {find} from 'lodash'

import indicators from '../data/indicators'
import {counties} from '../assets/counties'

import {Tooltip, Button} from './generic'
import SanityCheckTooltip from './generic/SanityCheckTip'
import Icon from './generic/Icon'

import media, {getMedia} from '../utilities/media'
import {isValid} from '../utilities/isValid'



const GridList = styled.ul`
    transition: opacity .5s;
    opacity: ${p => p.muted? 0.4 : 1};
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
    opacity: ${props => props.raceDropdown? 0.5: 1};

`
const GridItem = styled.li`
    position: relative;
    color: ${props => props.sanityHighlight? 'var(--normtext)' : props.selected? 'var(--strokepeach)' : props.dataHasIssue? 'var(--fainttext)' : 'black'};
    @media ${media.optimal}{
        padding: 8px 13px;
    }
    @media ${media.compact}{
        padding: 6px 13px;    
    }
    ${props => props.invalid? `
        &::after{
            position: absolute;
            content: '${props.text}';
            // width: ${(props.length*12)+8}px;
            color: rgba(0,0,0,0);
            white-space: nowrap;
            top: 0; bottom: 0; margin: auto;
            left: 0;
            padding: 0 16px;
            height: 0px;
            border-top: 1px solid var(--fainttext);
        }
    ` : ''}
    cursor: ${props => props.invalid? 'auto' : 'pointer'};
    display: flex;
    align-items: center;
    white-space: nowrap;
    opacity: ${props => props.muted? 0.2 : 1};
    transition: opacity .5s, color .25s;
    background: ${props => props.hovered&&!props.invalid&&!props.sanityHighlight? '#f3f3f5' : props.selected? 'var(--faintpeach)' : 'transparent'};
    border: 1px solid ${props => props.sanityHighlight? 'var(--bordergrey)' : props.selected? 'var(--strokepeach)' : 'transparent'};
    &.allctys{
        color: var(--strokepeach);
    }
`

const Titleblock = styled.div`
    opacity: ${props => props.raceDropdown? 0.4 : props.muted? 0.2 : 1};
    transition: opacity .5s;
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
    position: relative;
`
@observer
class CountyList extends React.Component{

    @action handleSelection = (cty, column, row) => {
        if(this.props.store.sanityCheck.county) return
        const sel = this.props.store.completeWorkflow('county', cty)
        if(sel) this.props.closeNav()
        else{
            // console.log('sanity check on county!')
            // console.log(this.props.store.sanityCheck)

        }
    }

    constructor(){
        super()
        this.searchInput = React.createRef()
    }

    componentDidMount(){
        if(this.props.store.sanityCheck.county){
            this.props.store.clearSanityCheck('county')
        }
    }
    componentDidUpdate(){
        if(this.props.focusInput){
            this.searchInput.current.focus()
            window.onkeyup = (e) => {
                if(e.key==='Escape'||e.key==='Esc'){
                    this.props.onSearch('') //clears string
                    this.searchInput.current.blur()
                }
            }
        }
        else{
            this.searchInput.current.blur()
        }
    }
    render(){
        const store = this.props.store
        const {indicator, county, race, year, sanityCheck} = store
        const ctyLabel = county? find(counties, (c)=>{return c.id === county}).label : ''
        const screen = getMedia()
        const sideChangeThreshold = screen === 'optimal'? 20 : 10
        const searchActive = this.props.focusInput || this.props.searchString
        return(
            <Workflow>
                <Titleblock raceDropdown = {this.props.muted} muted = {sanityCheck.county}>
                    <TitleSide>
                    <PickPrompt hide = {searchActive}>Pick a county.</PickPrompt>
                    <Search
                        active = {searchActive} 
                        inputFocused = {this.props.focusInput}
                        onClick = {()=> this.props.setSearchFocus(true)}
                    >
                        <SearchIcon img = "searchzoom" />
                        {!this.props.searchString && 
                            <SearchPrompt>Type to search...</SearchPrompt>
                        }
                        <SearchInput 
                            ref = {this.searchInput}
                            onFocus = {()=> this.props.setSearchFocus(true)}
                            onBlur = {()=> this.props.setSearchFocus(false)}
                            value = {this.props.searchString}
                            onChange = {(e)=> this.props.onSearch(e.target.value)}
                        />
                        <CancelSearch 
                            hide = {!this.props.searchString}
                            onClick = {()=>this.props.onSearch('')}
                        >
                            Cancel
                        </CancelSearch>

                    </Search>
                    </TitleSide>

                </Titleblock>

                <GridList
                    raceDropdown = {this.props.muted}
                >
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
                        return !store.countySearchString? true 
                        : store.countySearchResults.includes(cty.id)
                    }).map((cty, i)=>{
                        let dataHasIssue = false 
                        let straightUpNoData = false
                        const selected = cty.id === county
                        if(indicator){
                            const arr = indicators[indicator].counties[cty.id]
                            const allValues = Object.values(arr).flat()
                            const value = indicators[indicator].counties[cty.id][race||'totals'][year]   
                            if(allValues.filter((v)=>{return isValid(v)}).length === 0){
                                 straightUpNoData = true
                                 dataHasIssue = true
                             }
                            else if(!isValid(value)) dataHasIssue = true
                        }

                    //brute force/static finding column and row numbers in order to position sanity check
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
                                text = {cty.label}
                                selected = {selected}
                                sanityHighlight = {sanityChecking}
                                dataHasIssue = {dataHasIssue}
                                invalid = {straightUpNoData}
                                muted = {sanityCheck.county && sanityCheck.county!==cty.id}
                                key = {"countylist"+cty.id}
                                onClick = {!sanityChecking?()=>{this.handleSelection(cty.id, colNum, rowNum)}
                                : ()=>{}}

                                onMouseEnter = {()=>this.props.store.setHover('county',cty.id)}
                                onMouseLeave = {()=>this.props.store.setHover('county',null)}
                                hovered = {this.props.store.hoveredCounty === cty.id}
                            > 
                                {sanityChecking && 
                                    <SanityCheckTooltip 
                                        checkType = 'county'
                                        direction = {rowNum < 7? 'below' : 'above'}
                                        pos = {{x: colNum === 3? 50 : 0, y: rowNum < 7? 40 : 0}}
                                        data = {sanityCheck}
                                        index = {i}
                                        store = {this.props.store}
                                        needsCentering = {colNum===3}
                                        horizontalAnchor = {colNum < 4? 'left' : 'right'}
                                        caretOffset = {colNum < 3? -180 : colNum > 3? 125:  0}

                                    />
                                }

                                {cty.label}
                            </GridItem>

                    })
                    }
                </GridList>
                {store.countySearchResults.length===0 && store.countySearchString && 
                    <EmptyPage>
                        <h1>Your search for &ldquo;{store.countySearchString}&rdquo; doesn't match any counties.</h1>
                    </EmptyPage>
                }
            </Workflow>
        )
    }
}

const Workflow = styled.div`
    
`
const PickPrompt = styled.h1`
    opacity: ${props => props.hide? 0: 1};
    transform: translateX(${props => props.hide?-20:0}px);
    transition: opacity .35s, transform .35s;
    transition-delay: ${props=>props.hide?0:.125}s;
`
const Search = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    font-size: 13px;
    color: var(--fainttext);
    fill: var(--bordergrey);
    cursor: text;
    position: absolute;
    transition: transform .4s, fill .2s;
    height: 36px;
    &::after{
        position: absolute;
        bottom: 0;
        border-bottom: 1px solid var(--bordergrey);
        content: '';
        transform-origin: 0% 50%;
        transform: scaleX(${props=>props.active?1:0});
        transition: transform .4s, border-color .2s;
    }
    ${props => props.inputFocused? `
        fill: var(--fainttext);
        &::after{
            border-bottom-color: var(--fainttext);
        }
    ` : !props.active? `
        &:hover{
            color: var(--strokepeach);
            fill: var(--peach);
        }
    `: ''}
    @media ${media.optimal}{
        left: 175px;
        width: 175px;
        transform: translateX(${props=>props.active?-175:0}px);
        &::after{ width: 175px; }
    }
    @media ${media.compact}{
        left: 175px;
        width: 175px;
        transform: translateX(${props=>props.active?-175:0}px);
        &::after{ width: 175px; }
    }

`
const SearchIcon = styled(Icon)`
    width: 18px; 
    height: 18px;
    /*margin-right: 6px;*/
`
const SearchPrompt = styled.span`
    margin-left: 6px;
`
const SearchInput = styled.input`
    position: absolute;
    border: none;
    left: 20px;
    appearance: none;
    outline: none;
    font-size: 16px;
    background: none;
    margin-left: 5px;
    padding-left: 0px;
    letter-spacing: 0.7px;
    width: calc(100% - 20px);
    /*padding: 10px;*/
    /*border: 1px solid var(--fainttext);*/
    /*opacity: 0;*/
    /*pointer-events: none;*/
`
const CancelSearch = styled.div`
    position: absolute;
    right: -10px;
    color: var(--strokepeach);
    font-size: 13px;
    letter-spacing: .5px;
    margin-left: 20px;
    transition: opacity .25s, transform .25s;
    transform: ${props => props.hide? 'translateX(0)' : 'translateX(100%)'};
    transition-delay: ${props => props.hide? 0 : 0.25}s;
    opacity: ${props => props.hide? 0 : 1};
    pointer-events: ${props => props.hide? 'none' : 'auto'};
    cursor: pointer;
    z-index: 4;
`


const EmptyPage = styled.div`
    position: absolute;
    left: 0; top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1{
        font-weight: 500;
        font-size: 24px;
        letter-spacing: .92px;
        margin: 0;
        text-align: center;
    }

`

export default CountyList


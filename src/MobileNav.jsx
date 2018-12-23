import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import IntersectionObserver from '@researchgate/react-intersection-observer'
import FlipMove from 'react-flip-move'

import indicators from './data/indicators'
import demopop from './data/demographicsAndPopulation'
import semanticTitles from './assets/semanticTitles'
import countyLabels from './assets/countyLabels'
import {counties} from './assets/counties'

import {capitalize} from './utilities/toLowerCase'
import sigFig, {truncateNum} from './utilities/sigFig'

import Icon from './components/generic/Icon'
import {Toggle} from './components/generic'
import ExpandBox from './components/ExpandBox'



@observer
export default class MobileNav extends React.Component{

    @observable mode = false // compact, county, race, indicator
    @action setMode = (val) =>{
        if(val==='compact') this.props.setNavStatus(true)
        else if(!val) this.props.setNavStatus(false)
        this.mode = val
    }
    @observable justComplete = null
    @action justCompleted = (what) => {
        this.workflowScrollPos = 0
        this.userScrolledDownInWorkflow = false
        this.justComplete = what
    }

    @observable workflowScrollPos = 0
    @observable userScrolledDownInWorkflow = false
    @action setWorkflowScrollPos = (val) => {
        if(val > this.workflowScrollPos) this.userScrolledDownInWorkflow = true
        else this.userScrolledDownInWorkflow = false
        this.workflowScrollPos = val
    }

    render(){ 
        const props = this.props
        const {open, store} = props
        const {indicator, county, race, year} = store

        const ind = indicators[indicator]

        const yearOptions = indicator? ind.years.map((yr,i)=>{
            const val = ind.counties[county||'california'][race||'totals'][i]
            const disabled = val!==0 && (!val || val==='*')
            return {label: yr, value: i, disabled: disabled}
        }): false

        const NavItems = [
            <div key = 'county' style = {{height: '50px', marginLeft: '-1px',zIndex: this.mode==='county'?0:1}}>
                <ExpandBox
                    duration = {this.mode === 'county'? .5 : 0 }
                    currentMode = {this.mode==='county'? 'fullscreen' : 'compact'}
                    modes = {{
                        compact: {width: window.innerWidth+1, height: 50},
                        fullscreen: {width: window.innerWidth+1, height: window.innerHeight}
                    }}
                    backgroundColor = {this.mode==='county'? 'var(--offwhitefg)' : 'white'}
                    delay = {this.mode==='county'? '.175s' : 0}
                    noBorderTop = {this.mode==='compact' || !this.mode}

                    withScroll
                    hideScroll = {this.mode==='indicator' || this.mode==='race'}
                    noFade
                    onScroll = {this.mode === 'county'? (e)=> {
                        this.setWorkflowScrollPos(e.top)
                    } : ()=>{} }
                >
                    <div>
                    <MenuSelectBlock left = 'County' right = {county? countyLabels[county] : 'California (all)'} 
                        onClick = {()=> this.setMode('county') }
                        open = {this.mode === 'county'}
                        prompt = 'Pick a county.'
                        return = {()=>this.setMode('compact')}
                        justComplete = {this.justComplete === 'county'}
                    />
                    {this.mode === 'county' &&
                        <CountyList store = {store} onComplete = {(which)=>{
                            this.setMode('compact')
                            this.justCompleted(which)
                        }}/>
                    }
                    </div>
                </ExpandBox>
            </div>,

            <div key = 'race' style = {{height: '50px', marginLeft: '-1px', zIndex: this.mode==='race'?0:1}}>
                        <ExpandBox
                            duration = {this.mode === 'race'? .5 : 0 }
                            currentMode = {this.mode==='race'? 'fullscreen' : 'compact'}
                            modes = {{
                                compact: {width: window.innerWidth+1, height: 50},
                                fullscreen: {width: window.innerWidth+1, height: window.innerHeight}
                            }}
                            backgroundColor = {this.mode==='race'? 'var(--offwhitefg)' : 'white'}
                            delay = {this.mode==='race'? '.175s' : 0}
                        >
                            <div>
                            <MenuSelectBlock left = 'Race' right = {race? capitalize(race) : 'All races'} 
                                disabled = {ind && !ind.categories.includes('hasRace')}
                                onClick = {(ind && ind.categories.includes('hasRace')) || !ind?()=> this.setMode('race'):()=>{alert('The indicator you picked doesn\'t have any race-specific data.')} }
                                open = {this.mode === 'race'}
                                prompt = 'Select a race.'
                                return = {()=>this.setMode('compact')}
                                noSearch
                                justComplete = {this.justComplete === 'race'}
                            />
                            {this.mode === 'race' &&
                                <RaceList store = {store} onComplete = {(which)=>{
                                    this.setMode('compact')
                                    this.justCompleted(which)
                                }}/>
                            }
                            </div>
                        </ExpandBox>
            </div>,

            <div key = 'indicator' style = {{height: this.mode==='compact'?'70px':'50px', marginLeft: '-1px',zIndex: this.mode==='indicator'?0:1}}>
                <ExpandBox
                    withScroll
                    hideScroll = {this.mode==='county' || this.mode==='race'}
                    noFade
                    duration = {this.mode === 'indicator'? .5 : 0 }
                    currentMode = {this.mode==='indicator'? 'fullscreen' 
                        : this.mode === 'compact' && indicator && ind.years.length > 1? 'compactWithYear' 
                        // : this.mode === 'county' || this.mode==='race'? 'compactTruncated'
                        : 'compact'
                    }
                    modes = {{
                        compact: {width: window.innerWidth+1, height: 50},
                        compactWithYear: {width: window.innerWidth+1, height: 117},
                        fullscreen: {width: window.innerWidth+1, height: window.innerHeight}
                    }}
                    backgroundColor = {this.mode==='indicator'? 'var(--offwhitefg)' : 'white'}
                
                    onScroll = {this.mode === 'indicator'? (e)=> {
                        this.setWorkflowScrollPos(e.top)
                    } : ()=>{} }
                >
                    <div>
                    <MenuSelectBlock left = 'Indicator' 
                        right = {indicator? semanticTitles[indicator].shorthand : 'Browse / search...'} 
                        multiline 
                        onClick = {()=> this.setMode('indicator') }
                        open = {this.mode === 'indicator'}
                        prompt = 'Choose an indicator.'
                        return = {()=>this.setMode('compact')}
                        truncateValue = {this.mode==='county' || this.mode==='race'}
                        justComplete = {this.justComplete==='indicator'}

                        yearToggle = {this.mode!=='race' && this.mode !== 'county' && indicator? (
                            <YearToggle
                                visible = {this.mode==='compact'}
                                options = {yearOptions}
                                onClick = {(yr)=>store.completeWorkflow('year',yr)}
                                selected = {year}
                                stopPropagation
                                muted
                                theme = 'muted'
                            />
                            ): null
                        }
                    />

                    {this.mode==='indicator' &&
                        <IndicatorList store = {store} onComplete = {(which)=>{
                            this.setMode('compact')
                            this.justCompleted(which)
                        } }/>
                    }
                    </div>
                </ExpandBox>
            </div>,
            
        ].sort((a,b)=>{
            if(a.key===this.mode) return 1
            if(b.key===this.mode) return -1
        })

        return(
            <FixWrap>
                <PickMenu
                    currentMode = {!this.mode? 'closed' : this.mode==='compact' && !indicator? 'openNoInd' : this.mode === 'compact'? 'open' : 'fullsize'}
                    modes = {{
                        closed: {width: window.innerWidth+1, height: 1},
                        fullsize: {width: window.innerWidth+1, height: window.innerHeight+100},
                        openNoInd: {width: window.innerWidth+1, height: 200},
                        open: {width: window.innerWidth+1, height: 267}    
                    }}
                    backgroundColor = 'white'
                    borderColor = 'var(--fainttext)'
                    workflowScrollOffset = {this.userScrolledDownInWorkflow}
                >
                    <FlipMove
                        style = {{width: '100%'}}
                        easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)'
                        duration = {350}
                        enterAnimation = {{
                            from: {transform: 'translateY(-100%)'},
                            to: {transform: 'translateY(0%)'}
                        }}
                        leaveAnimation = {{
                            from: {transform: 'translateY(0)'},
                            to: {transform: 'translateY(-100%)'}
                        }}
                    >
                        {(!this.mode || this.mode==='compact') &&
                            <div style = {{
                                position: 'relative', zIndex: 5,
                                display: 'flex', alignItems: 'center',
                                padding: '12px 25px 0px 25px', height: '50px'
                            }}>
                                What data do you want to see?
                            </div>
                        }
                        {NavItems.map((item)=>{
                            return item
                        })}
                    </FlipMove>
                </PickMenu>
             <Header 
                offset = {!this.mode? '0,0' 
                    : this.mode==='compact' && !indicator? `${window.innerWidth - 165}px,215px`
                    : this.mode==='compact' && indicator? `${window.innerWidth - 165}px,282px`
                    : `${window.innerWidth - 175}px,${window.innerHeight+25}px`
                }
                currentMode = {!this.mode? 'bar' : this.mode === 'compact'? 'button' : 'offscreen'}
                modes = {{
                    bar: {width: window.innerWidth, height: 55},
                    button: {width: 150, height: 55},
                    offscreen: {width: 150, height: 55} 
                }}
                backgroundColor = 'var(--offwhitebg)'
                borderColor = 'var(--offwhitebg)'
                duration = {.4}
            >
                <HeaderContent
                    onClick = {()=>{
                        this.setMode(this.mode==='compact'? false : 'compact')
                    }}
                >
                    <BarContent active = {!this.mode}>
                        <SearchIcon img = "searchzoom" color = 'white'/>
                        <Prompt visible = {!this.props.showShorthand}>
                            Refine or restart your search...
                        </Prompt>
                        <Shorthand visible = {this.props.showShorthand}>
                            {indicator && semanticTitles[indicator].shorthand}
                        </Shorthand>
                    </BarContent>

                    <Btn active = {this.mode==='compact'}>
                        Back to view
                    </Btn>
                </HeaderContent>
            </Header>

            <ResetButton
                offset = {!this.mode? '0,0' 
                    : this.mode==='compact' && !indicator && (county || race)? `${window.innerWidth - 280}px,215px`
                    // : this.mode==='compact' && indicator? `${window.innerWidth - 180}px,215px`
                    : this.mode==='compact' && (indicator || county || race)? `${window.innerWidth - 280}px,282px`
                    : this.mode === 'compact'? `${window.innerWidth - 180}px,215px`
                    : `${window.innerWidth - 175}px,${window.innerHeight+25}px`
                }
                currentMode = {this.mode==='compact' && (indicator || county || race) ? 'visible' : 'hidden'}
                modes = {{
                    hidden: {width: 15, height: 55},
                    visible: {width: 100, height: 55}
                }}
                backgroundColor = 'white'
            >
                    <div style = {{
                        display: 'flex', 
                        alignItems: 'center',
                        height: '55px', width: '100px',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                        onClick = {()=>{
                           store.completeWorkflow('race',null)
                           store.completeWorkflow('county',null)
                           store.completeWorkflow('indicator',null)
                        }}
                    >
                    Reset <ResetIcon img = "x" color = "normtext" />
                    </div>
                </ResetButton>



            <Mask visible = {this.mode}/>

            </FixWrap>
        )
    }
}

const ResetButton = styled(ExpandBox)`
    position: absolute;
    z-index: 1;
    margin-right: 200px;
    transform: translate(${props=>props.offset});
    transition: transform .4s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .15s;
    /*transition-delay: ${props => props.currentMode==='visible'? '.65s' : '0s'};*/
    opacity: ${props => props.currentMode==='visible'? 1 : 0};
`
const ResetIcon = styled(Icon)`
    width: 15px; height: 15px;
`

const Mask = styled.div`
    width: 100vw;
    height: ${props => props.visible? '100vh' : '0px'};
    background: linear-gradient(180deg, var(--offwhitefg) 53%, rgba(252, 253, 255, 0.75) 100%);
    opacity: ${props => props.visible? 1 : 0};
    transition: opacity .475s;
    position: absolute;
    z-index: 0;
`

const YearToggle = styled(Toggle)`
    position: absolute;
    bottom: -45px;
    right: -32px;
`

const MenuSelectBlock = (props) => {
    return(
    <MSB 
        height = {props.height} 
        disabled = {props.disabled} 
        multiline = {props.multiline && !props.truncateValue} 
        onClick = {!props.open? props.onClick : ()=>{}}
    >
        <MSBPrompt visible = {props.open}>{props.prompt}</MSBPrompt>
        <MSBLabel 
            visible = {!props.open} 
            multiline = {props.multiline && !props.truncateValue}
        >
            {props.left}
        </MSBLabel>
        <MSBValue noCaret = {props.noCaret}>
            <Val truncate = {props.truncateValue} multiline = {props.multiline && !props.truncateValue} visible = {!props.open} justComplete = {props.justComplete}>
                {props.right}
                {props.yearToggle}
            </Val>
            {!props.noSearch && 
                <NavSearch img = "searchzoom" color = "normtext" visible = {props.open} />
            }
            {!props.noCaret && 
            <XCaret mode = {'caret'}
                disabled = {props.disabled}
                onClick = {props.open? props.return : ()=>{} }
            />
            }
        </MSBValue>
    </MSB>
    )
}
const MSB = styled.div`
    padding: 0 25px;
    display: flex;
    width: ${window.innerWidth}px;
    height: ${props => props.height? props.height : '50px'};
    ${props => props.multiline? `
        padding-top: 14px;
        `
        : `align-items: center;`}
    justify-content: space-between;
    background: ${props => props.disabled? 'var(--disabledgrey)' : 'transparent'};

`
const MSBLabel = styled.div`
    font-size: 12px;
    flex-shrink: 0;
    position: relative;
    opacity: ${props=>props.visible? 1 : 0};
    ${props => props.multiline? `margin-top: 2px;` : ``}
`
const MSBPrompt = styled.span`
    position: absolute;
    margin-top: 2px;
    opacity: ${props => props.visible? 1: 0};
`
const MSBValue = styled.div`
    position: relative;
    font-size: 16px;
    color: var(--fainttext);
    margin-left: 20px; 
    max-width: calc(88% - 80px);
    margin-right: ${props=>props.noCaret? '0':'30px'};
`
const NavSearch = styled(Icon)`
    position: absolute;
    right: 12px; top: 4px;
    width: 18px; height: 18px;
    transition: opacity .35s;
    opacity: ${props => props.visible? 1 : 0};
    pointer-events: ${props => props.visible? 'auto' : 'none'};
`
const Val = styled.div`
    font-size: 14px;
    flex-shrink: 1;
    white-space: ${props => props.truncate? 'nowrap' : 'normal'};
    overflow: ${props => props.truncate? 'hidden' : 'visible'};
    text-overflow: ellipsis;
    text-align: right;
    opacity: ${props=>props.visible? 1 : 0};
    transition: opacity .35s;
    transition-delay: ${props => props.visible && props.justComplete? '.4s' : '0s'};
    ${props => props.multiline? `
        // height: 21px;
    ` : ''}
    position: relative;
`
const XCaret = styled.div`
    position: absolute;
    top: 2px; right: -30px;
    width: 18px; height: 18px;
    border: 1px solid black;
    flex-shrink: 0;
`
const FixWrap = styled.div`
    position: fixed;
    top: -1px; left: -1px;
    z-index: 10;
`
const WorkflowWrap = styled.div`
    border: 1px solid red;
    height: 83px;

` 
const PickMenu = styled(ExpandBox)`
    position: absolute;
    top: -1px; left: -1px;
    height: 83px;
    z-index: 1;
    transform: translateY(${props => props.workflowScrollOffset? -100 : 0}px);
    transition: transform .35s;
`
const Header = styled(ExpandBox)`
    z-index: 3;
    top: 0; left: 0;
    transform: translate(${props=>props.offset});
    transition: transform .4s cubic-bezier(0.215, 0.61, 0.355, 1);
`
const HeaderContent = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    color: white;
    width: 100%;
    height: 55px;
    cursor: pointer;
`
const HeaderSection = styled.div`
    position: absolute; top: 0; left: 0;
    display: flex; align-items: center;
    padding-left: 25px;
    // white-space: nowrap;
    height: 55px;
    opacity: ${props => props.active? 1: 0};
    transition: transform .4s, opacity .4s;
    width: 100%;
`
const BarContent = styled(HeaderSection)`
    transform: translateX(${props => props.active? 0 : -25}px);
`
const Btn = styled(HeaderSection)`
    transform: translateX(${props => props.active? 0 : 25}px);
`
const BarInfo = styled.div`
    position: absolute;
    left: 50px;
    transition: transform .35s, opacity .35s;
    opacity: ${props => props.visible? 1: 0};
`
const Prompt = styled(BarInfo)`
    transform: translateY(${props => props.visible? 0 : -100}%);
`
const Shorthand = styled(BarInfo)`
    transform: translateY(${props => props.visible? 0 : 100}%);
    max-width: calc(100% - 75px);
    overflow: hidden;
    text-overflow: ellipsis;
`

const SearchIcon = styled(Icon)`
    width: 15px; height: 15px;
    margin-right: 10px;
    flex-shrink: 0;
`


const Fixer = styled.div`
    position: fixed;
    top: 0;
    left: 0; 
`
const HeaderBar = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 55px;
    background: var(--offwhitebg);
    padding: 0 20px;
    color: white;
    display: flex; align-items: center;
    z-index: 2;
    font-size: 14px;
    transform: translateY(${props => props.mode === 'offscreen'? window.innerHeight : props.mode === 'button'? 250 : 0}px);
    transition: transform .35s;
`
const DataPicker = (props) => {
    return(
        <Nav>
            <ExpandBox
                currentMode = {'collapsed'}
                modes = {{
                    collapsed: {width: window.innerWidth, height: 0},
                    expanded: {width: window.innerWidth, height: 250},  
                }}
            />
        </Nav> 
    )   
}
const Nav = styled.div`
    position: fixed;
    top: 0;
    // height: 250px;
    background: white;
`

@observer
class IndicatorList extends React.Component{
    @observable filter = 'all'
    @action setFilter = (v) => {
        console.log('filter set to ', this.filter)
        this.filter = v
    }

    render(){
        const store = this.props.store
        const inds = Object.keys(indicators)
        return(
            <React.Fragment>
            <SelectWrapper>
            <IndCats
                onChange = {(e)=>this.setFilter(e.target.value)}
            >
                <option value = "all"> All topics ({inds.length})</option>
                <option value = "health"> Health (12)</option>
                <option value = "education"> Education (15)</option>
                <option value = "welfare"> Child Welfare (6)</option>
                <option value = "earlyChildhood"> Early Childhood (8)</option>
            </IndCats>
            </SelectWrapper>
            <WorkflowList>
                {Object.keys(indicators).filter((ind)=>{
                    if(this.filter === 'all') return true 
                    else return indicators[ind].categories.includes(this.filter)
                }).map((ind)=>{
                    return (
                        <ListRow
                            key = {ind}
                            onClick = {()=>{ 
                                store.completeWorkflow('indicator', ind)
                                this.props.onComplete('indicator')
                            }}
                        >
                            {semanticTitles[ind].label}
                        </ListRow>
                        )
                    })}
            </WorkflowList>
            </React.Fragment>
        )
    }
}

const WorkflowList = styled.ul`
    width: 100%;
    white-space: normal;
    margin: 15px 0 0 0;
    padding: 0 25px;

`
const ListRow = styled.li`
    list-style-type: none;    
    font-size: 14px;
    line-height: 21px;
    padding: 15px 15px;
    background: white;
    border: 1px solid var(--bordergrey);
    &:not(:first-of-type){
        margin-top: -1px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const IndCats = styled.select`
    font-family: 'Heebo', sans-serif;
    font-size: 14px;
    height: 44px;
    padding: 10px 15px;
    margin-left: 25px;
    margin-top: 2px;
    width: 190px;
    letter-spacing: 0.7px;
    appearance: none;
    color: var(--normtext);
    background: white;

`
const SelectWrapper = styled.div`
    display: inline-flex;
    position: relative;
    &::after{
        position: absolute;
        top: 21px; right: 15px;
        content: '';
        border: 6px solid transparent;
        border-top-color: var(--fainttext);
    }
`

const RaceList = (props) => {
    const races = ['asian','black','latinx','white','other']
    const {store} = props
    return (
        <WorkflowList>
            <SpecialRow onClick = {()=>{ store.completeWorkflow('race',''); props.onComplete('race') }}> 
                <div>All races</div> 
                <ItemInfo>{truncateNum(demopop[store.county || 'california'].population)} children in {store.county? 'county' : 'CA'}</ItemInfo>
            </SpecialRow>
            {races.map((r)=>{
                const popPct = demopop[store.county || 'california'][r]
                return <ListRow key = {r} onClick = {()=>{ 
                    store.completeWorkflow('race', r)
                    props.onComplete('race')
                }}>
                    <div>{r!=='other' && capitalize(r)}{r==='other' && 'Other races'}</div>
                    <ItemInfo>
                        {popPct}% of 
                        {!store.county && ' CA\'s children'}
                        {store.county && ' county\'s kids'}
                    </ItemInfo>
                </ListRow>
            })}
        </WorkflowList>
    )
}
const CountyList = (props) => {
    const {store} = props
    return (
        <WorkflowList>
            <SpecialRow onClick = {()=>{
                store.completeWorkflow('county', '')
                props.onComplete('county')
            }} >
                <div>California </div>
                <ItemInfo>{sigFig(demopop.california.population)} children</ItemInfo>
            </SpecialRow>
            {counties.sort((a,b)=>{
                if(a.id < b.id) return -1
                else if (a.id > b.id) return 1
                else return 0
            }).map((cty)=>{
                console.log(cty)
                return <ListRow key = {cty.id}
                    onClick = {()=>{ 
                        store.completeWorkflow('county', cty.id)
                        props.onComplete('county')
                    }}
                >
                    <div>{countyLabels[cty.id]}</div>
                    <ItemInfo>
                        {sigFig(demopop[cty.id].population)} children
                    </ItemInfo>
                </ListRow>
            })}
        </WorkflowList>
    )
}

const SpecialRow = styled(ListRow)`
    margin-bottom: 15px;
`
const ItemInfo = styled.div`
    font-size: 12px;
    color: var(--fainttext);
`
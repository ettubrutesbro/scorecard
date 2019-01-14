import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import IntersectionObserver from '@researchgate/react-intersection-observer'
import 'intersection-observer'
import FlipMove from 'react-flip-move'

import indicators from './data/indicators'
import demopop from './data/demographicsAndPopulation'
import semanticTitles from './assets/semanticTitles'
import countyLabels from './assets/countyLabels'
import {counties} from './assets/counties'

import {capitalize} from './utilities/toLowerCase'
import sigFig, {truncateNum} from './utilities/sigFig'

import Icon, {Sprite} from './components/generic/Icon'
import {Toggle} from './components/generic'
import ExpandBox from './components/ExpandBox'
import FixedActionsHelper from './components/FixedActionsHelper'


const peachBGAnim = keyframes`
    from{
        background-color: var(--faintestpeach);
    }
    to{ background-color: white; }
`

@observer
export default class MobileNav extends React.Component{

    @observable mode = false // compact, county, race, indicator
    @action setMode = (val) =>{
        if(val==='compact'){
            this.props.setNavStatus(true)
            this.props.allowBodyOverflow(false)
            this.setWorkflowScrollPos(0)
            // this.userScrolledDownInWorkflow = false
        }
        else if(!val){
            this.props.setNavStatus(false)
            this.justComplete.county = this.justComplete.race = this.justComplete.indicator = false
        }
        else if(val === 'race') this.props.allowBodyOverflow(false) //racelist doesnt need scroll
        else{
            //indicator and county actually do need smooth scroll
            this.props.allowBodyOverflow(true)
        }
        this.mode = val
    }
    @observable justComplete = { county: false, race: false, indicator: false }
    @action justCompleted = (what) => {
        this.workflowScrollPos = 0
        this.userScrolledDownInWorkflow = false
        Object.keys(this.justComplete).map((wat)=>{
            if(wat!==what) this.justComplete[wat] = false
        })
        this.justComplete[what] = true
    }

    @observable workflowScrollPos = 0
    @observable userScrolledDownInWorkflow = false
    @action setWorkflowScrollPos = (val) => {
        if(val > this.workflowScrollPos) this.userScrolledDownInWorkflow = true
        else this.userScrolledDownInWorkflow = false
        this.workflowScrollPos = val
    }

    @observable openWorkflowHeaderVisible = true
    @action setWorkflowHeaderVisibility = (tf) => {this.openWorkflowHeaderVisible = tf}

    constructor(){
        super()
        this.countyList = React.createRef()
        this.indList = React.createRef()
        this.ctyListHeaderBlock = React.createRef()
        this.indListHeaderBlock = React.createRef()
    }

    componentWillUpdate(newProps){
        if(this.props.hide && !newProps.hide){
            this.setMode('compact')
        }
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
                    ref = {this.countyList}
                    duration = {this.mode === 'county'? .5 : 0 }
                    currentMode = {this.mode==='county'? 'fullscreen' : 'compact'}
                    modes = {{
                        compact: {width: window.innerWidth+1, height: 50},
                        fullscreen: {width: window.innerWidth+1, height: store.mobileDeviceHeight}
                    }}
                    backgroundColor = {this.mode==='county'? 'var(--offwhitefg)' : 'white'}
                    noBorderTop = {this.mode==='compact' || !this.mode}

                    withScroll
                    hideScroll = {this.mode!=='county'}
                    noFade
                    onScroll = {this.mode === 'county'? (e)=> {
                        this.setWorkflowScrollPos(e.top)
                    } : ()=>{} }
                >
                    <div>
                    <IntersectionObserver
                        onChange = {
                            this.mode === 'county'? (wat)=>{
                                this.setWorkflowHeaderVisibility(wat.isIntersecting)
                            }
                            : () => {}
                        }
                    >
                        <MenuSelectBlock left = 'County' right = {county? countyLabels[county] : 'California (all)'} 
                            onClick = {()=> this.setMode('county') }
                            open = {this.mode === 'county'}
                            prompt = 'Pick a county.'
                            return = {()=>this.setMode('compact')}
                            justComplete = {this.justComplete.county}
                            ref = {this.ctyListHeaderBlock}
                            placeholder = 'Type county name...'
                            searchString = {store.countySearchString}
                            onSearch = {(val)=>store.modifySearchString('county',val)}
                        />
                    </IntersectionObserver>
                    {this.mode === 'county' &&
                        <CountyList store = {store} 
                            onComplete = {(which, hasNewVal)=>{
                                this.setMode('compact')
                                if(hasNewVal){
                                    this.justCompleted(which)
                                    this.props.setForceCA(false) //unforce CA zoom when picking new county
                                }
                            }}
                            // onHeaderScrollChange = {this.setWorkflowHeaderVisibility}
                        />
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
                                fullscreen: {width: window.innerWidth+1, height: store.mobileDeviceHeight}
                            }}
                            backgroundColor = {this.mode==='race'? 'var(--offwhitefg)' : 'white'}
                            // hideScroll = {this.mode!=='race'}
                        >
                            <div>
                            <MenuSelectBlock left = 'Race' right = {race? capitalize(race) : 'All races'} 
                                disabled = {ind && !ind.categories.includes('hasRace')}
                                onClick = {(ind && ind.categories.includes('hasRace')) || !ind?()=> this.setMode('race'):()=>{alert('The indicator you picked doesn\'t have any race-specific data.')} }
                                open = {this.mode === 'race'}
                                prompt = 'Select a race.'
                                return = {()=>this.setMode('compact')}
                                noSearch
                                justComplete = {this.justComplete.race}
                            />
                            {this.mode === 'race' &&
                                <RaceList store = {store} onComplete = {(which, hasNewVal)=>{
                                    this.setMode('compact')
                                    if(hasNewVal) this.justCompleted(which)
                                }}/>
                            }
                            </div>
                        </ExpandBox>
            </div>,

            <div key = 'indicator' style = {{
                height: this.mode==='compact'?'117px':'50px', 
                marginLeft: '-1px',
                zIndex: this.mode==='indicator'?0:1,
            }}>
                <IndExpandBox
                    ref = {this.indList}
                    withScroll
                    hideScroll = {this.mode!=='indicator'}
                    noFade
                    duration = {this.mode === 'indicator'? .5 : 0 }
                    currentMode = {this.mode==='indicator'? 'fullscreen' : this.mode === 'county' || this.mode==='race'? 'compactTruncated': 'compact'}
                    modes = {{
                        compact: {width: window.innerWidth+1, height: 117},
                        compactTruncated: {width: window.innerWidth+1, height: 50},
                        fullscreen: {width: window.innerWidth+1, height: store.mobileDeviceHeight}
                    }}
                    backgroundColor = {
                        this.mode==='indicator'? 'var(--offwhitefg)' 
                        : 'transparent'
                    }
                    // boxAnimation = {this.justComplete.indicator? peachBGAnim + ' 1.25s forwards 1.5s' : ''}
                    // boxAnimation = {`${this.justComplete.indicator? peachBGAnim : ''} 1.25s formards 1.5s`}
                
                    onScroll = {this.mode === 'indicator'? (e)=> {
                        this.setWorkflowScrollPos(e.top)
                    } : ()=>{} }

                    justComplete = {this.justComplete.indicator}
                >
                    <div>
                    <IntersectionObserver
                        onChange = {
                            this.mode === 'indicator'? (wat)=>this.setWorkflowHeaderVisibility(wat.isIntersecting)
                            : ()=>{}
                        }
                    >
                    <MenuSelectBlock left = 'Indicator' 
                        right = {indicator? semanticTitles[indicator].shorthand : 'Browse / search...'} 
                        multiline 
                        onClick = {()=> this.setMode('indicator') }
                        open = {this.mode === 'indicator'}
                        prompt = 'Choose an indicator.'
                        return = {()=>this.setMode('compact')}
                        truncateValue = {this.mode==='county' || this.mode==='race'}
                        justComplete = {this.mode === 'compact' && this.justComplete.indicator}

                        yearToggle = {this.mode!=='race' && this.mode !== 'county' && indicator? (
                            <YearToggle
                                visible = {this.mode==='compact'}
                                options = {yearOptions}
                                onClick = {(yr)=>store.completeWorkflow('year',yr)}
                                selected = {Number(year)}
                                stopPropagation
                                muted
                                theme = 'muted'
                            />
                            ): null
                        }
                        ref = {this.indListHeaderBlock}
                        placeholder = 'Find indicators...'
                        searchString = {store.indicatorSearchString}
                        onSearch = {(val)=>store.modifySearchString('indicator',val)}
                    />
                    </IntersectionObserver>

                    {this.mode==='indicator' &&
                        <IndicatorList store = {store} 
                            onComplete = {(which, hasNewVal)=>{
                                this.setMode('compact')
                                if(hasNewVal) this.justCompleted(which)
                            }}
                            // onHeaderScrollChange = {this.setWorkflowHeaderVisibility}
                        />
                    }
                    </div>
                </IndExpandBox>
            </div>,
            
        ].sort((a,b)=>{
            if(a.key===this.mode) return 1
            if(b.key===this.mode) return -1
        })

        const indListRef = this.indList
        const ctyListRef = this.countyList
        const indListHeaderBlockRef = this.indListHeaderBlock
        const ctyListHeaderBlockRef = this.ctyListHeaderBlock

        return(
            <FixWrap  hide = {this.props.hide}>
                <PickMenu
                    currentMode = {!this.mode? 'closed' : this.mode==='compact' && !indicator? 'openNoInd' : this.mode === 'compact'? 'open' : 'fullsize'}
                    modes = {{
                        closed: {width: window.innerWidth+1, height: 25},
                        fullsize: {width: window.innerWidth+1, height: store.mobileDeviceHeight+100},
                        openNoInd: {width: window.innerWidth+1, height: 200},
                        open: {width: window.innerWidth+1, height: 267}    
                    }}
                    workflowScrollOffset = {this.userScrolledDownInWorkflow}
                >
                    <FlipMove
                        // style = {{width: '100%'}}
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
                                padding: '12px 25px 0px 25px', height: '50px',
                                background: 'white'
                            }}>
                                What data do you want to see?
                            </div>
                        }
                        {NavItems.map((item)=>{
                            return item
                        })}
                    </FlipMove>
                </PickMenu>
            
            <HeaderGroup
                offset = {this.mode==='compact' && !indicator? `${window.innerWidth-230}px,215px` 
                    : this.mode && this.mode!=='compact' && !indicator? `${window.innerWidth-230}px,${store.mobileDeviceHeight+25}px`
                    : !this.mode? '0,0' 
                    : this.mode==='compact' && !indicator? `${window.innerWidth - 175}px,215px`
                    : this.mode==='compact' && indicator? `${window.innerWidth - 175}px,282px`
                    : `${window.innerWidth - 175}px,${store.mobileDeviceHeight+25}px`
                }
                duration = {.425}
            > 
             <Header 
                currentMode = {this.mode && !indicator? 'noIndicator' : !this.mode? 'bar' : this.mode === 'compact' || this.props.hide? 'button' : 'offscreen'}
                modes = {{
                    bar: {width: window.innerWidth, height: 55},
                    button: {width: 160, height: 55},
                    offscreen: {width: 160, height: 55},
                    noIndicator: {width: 215, height: 55}
                }}
                backgroundColor = {this.props.hide || (this.mode && !indicator)? 'var(--offwhitefg)' : 'var(--offwhitebg)'}
                borderColor = {this.mode && !indicator? 'var(--bordergrey)' : 'var(--offwhitebg)'}
                duration = {.425}
            >
                <HeaderContent
                    whitetext = {!(this.mode && !indicator)}
                    onClick = {()=>{
                        this.setMode(this.mode === 'compact' && !indicator? 'indicator' : this.mode==='compact'? false : 'compact')
                    }}
                >
                    <BarContent active = {!this.mode}>
                        <SearchIcon img = "searchzoom" color = 'white'/>
                        <Prompt visible = {!this.props.showShorthand}>
                            Search data...
                        </Prompt>
                        <Shorthand visible = {this.props.showShorthand}>
                            {indicator && semanticTitles[indicator].shorthand}
                        </Shorthand>
                    </BarContent>

                    <Btn active = {this.mode} superwide = {this.mode && !indicator}>
                        {!indicator && 'Choose an indicator.'}
                        {!this.justComplete.county && !this.justComplete.race && !this.justComplete.indicator && indicator && 
                            <React.Fragment>
                                Cancel
                                <CollapseHeaderIcon img = "chevup" color = 'white' />
                            </React.Fragment>
                        }
                        {(this.justComplete.county || this.justComplete.race || this.justComplete.indicator) && indicator && 
                            <React.Fragment>
                                See results
                                <SaveHeaderIcon img = "check" color = 'peach' />
                            </React.Fragment>
                        }
                        
                    </Btn>
                </HeaderContent>
            </Header>

            <ResetButton
                show = {this.mode==='compact' && indicator}
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
                    Reset <ResetIcon img = "reset" color = "normtext" />
                    </div>
            </ResetButton>
        </HeaderGroup>

            <MaskGapBlocker />
            <Mask visible = {this.mode}
                onClick = {()=>this.setMode(false)}
            />
            {(this.mode === 'county' || this.mode === 'indicator' || !this.mode) && //eventually, indbycty table expanded...
                <FixedActionsHelper 
                    id = "fixedactions" 
                    mode = {this.props.showFAH? 'xOnly' : (this.openWorkflowHeaderVisible || !this.mode)? 'collapsed' : 'expanded'}
                    offsetFromTop = {(!this.mode || this.props.showFAH)? 50 : this.userScrolledDownInWorkflow? 0 : 100}

                    onSearch = {()=>{
                        if(this.mode === 'county'){
                            ctyListRef.current.forceScrollToTop()
                            ctyListHeaderBlockRef.current.setSearching(true)
                        }
                        else if(this.mode === 'indicator'){
                            indListRef.current.forceScrollToTop()
                            indListHeaderBlockRef.current.setSearching(true)
                        }
                    }}
                    onX = {!this.props.fixedXAction? ()=>{
                        this.setWorkflowScrollPos(0)
                        this.setWorkflowHeaderVisibility(true)
                        this.setMode('compact')
                    } : this.props.fixedXAction}
                />
            }            
            </FixWrap>
        )
    }
}

const MaskGapBlocker = styled.div`
    position: absolute;
    top: 0; left: 0;
    z-index: 0;
    background: var(--offwhitefg);
    width: 100vw;
    height: 55px; 
`

const HeaderGroup = styled.div`
    position: absolute; top: 0; left: 0;
    height: 55px; width: 100%;
    z-index: 13;

    transform: translate(${props=>props.offset});
    transition: transform .425s cubic-bezier(0.215, 0.61, 0.355, 1);
`


const ResetButton = styled.div`
    position: absolute;
    z-index: 1;
    top: 1px;
    left: -128px;
    background: white;
    border: 1px solid var(--fainttext);
    width: 115px; height: 55px;
    transform: translateX(${props=>props.show? 0 : 129}px);
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-delay: ${props=>props.show? .425 : 0}s;
    opacity: ${props => props.show? 1 : 0};
    display: flex; align-items: center;
    justify-content: center;
`
const ResetIcon = styled(Icon)`
    width: 18px; height: 18px;
    margin-left: 8px;
`

const Mask = styled.div`
    width: 100vw;
    height: calc(100vh + 2px);
    background: linear-gradient(180deg, var(--offwhitefg) 300px, rgba(252, 253, 255, 0.725) 100%);
    pointer-events: ${props => props.visible? 'auto' : 'none'};
    /*background: var(--offwhitefg);*/
    /*background: linear-gradient(180deg, var(--offwhitebg) 53%, rgba(0, 0, 0, 0.5) 100%);*/
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

@observer class MenuSelectBlock extends React.Component{
    @observable searching = false
    @action setSearching = (tf) =>{
        if(tf) this.searchInput.current.focus()
        else{
            this.searchInput.current.blur()
            // this.searchstring = ''
            this.setSearchString('')
        }
        this.searching = tf
    }
    // @observable searchstring = ''
    @action setSearchString = (val) => {
        console.log(val)
        // this.searchstring = val
        this.props.onSearch(val)
    }
    constructor(){
        super()
        this.searchInput = React.createRef()
    }
    componentWillUpdate(newProps){
        if(!newProps.open && this.props.open && !this.props.noSearch){
            this.setSearching(false)
        }
    }
    render(){
        const props = this.props
        const searchstring = this.props.searchString
        return(
            <MSB 
                height = {props.height} 
                disabled = {props.disabled} 
                multiline = {props.multiline && !props.truncateValue} 
                onClick = {!props.open? props.onClick : ()=>{}}
                justComplete = {props.justComplete}
            >
                {!props.noSearch && props.open && 
                    <NavSearchBlock
                        active = {this.searching}
                    >
                        <NavSearchInput
                            ref = {this.searchInput} 
                            placeholder = {props.placeholder}
                            onChange = {(e)=>this.setSearchString(e.target.value)}
                            onBlur = {(e)=>{
                                e.stopPropagation()
                                if(!searchstring) this.setSearching(false)
                            }}
                            value = {searchstring}
                            onKeyUp = {(e)=>{
                                if(e.key === 'Enter'){
                                    if(searchstring) this.searchInput.current.blur()
                                    else this.setSearching(false)
                                }  
                            }}
                        />
                        <ClearCancelSearch 
                            onClick = {()=>{ this.setSearching(false)}}
                        >
                            {searchstring && 'Clear'}
                            {!searchstring && 'Cancel'}
                        </ClearCancelSearch>
                    </NavSearchBlock>
                }
                <MSBPrompt visible = {props.open && !this.searching}>{props.prompt}</MSBPrompt>
                <MSBLabel 
                    visible = {!props.open} 
                    multiline = {props.multiline && !props.truncateValue}
                >
                    {props.left}
                </MSBLabel>
                <MSBValue noCaret = {props.noCaret}>
                    <Val 
                        truncate = {props.truncateValue} 
                        // multiline = {props.multiline && !props.truncateValue} 
                        visible = {!props.open} 
                        justComplete = {props.justComplete}
                    >
                        {props.right}
                        {props.yearToggle}
                    </Val>
                    {!props.noSearch && 
                        <NavSearch 
                            img = "searchzoom" 
                            color = "normtext" 
                            visible = {props.open} 
                            active = {this.searching}
                            onClick = {()=>this.setSearching(true)}
                        />
                    }
                    {!props.noCaret && 
                    <XCaret 
                        duration = {.2}
                        img = 'caretx'
                        state = {props.open? 'up' : 'down'}
                        color = {props.justComplete? 'fainttext' : 'normtext'}
                        disabled = {props.disabled}
                        onClick = {props.open? props.return : ()=>{} }
                    />
                    }
                </MSBValue>
            </MSB>
        )
    }
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
    background: ${props => props.justComplete? 'var(--faintestpeach)' :  props.disabled? 'var(--disabledgrey)' : 'transparent'};
    // animation: ${props => props.justComplete? peachBGAnim : ''} 1.25s forwards 1.5s;    

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
    transition: opacity .35s;
    pointer-events: none;
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
    right: 12px; top: 2px;
    position: absolute;
    transform: translateX(${props => props.active? -(window.innerWidth - 110) : 0}px);
    width: 18px; height: 18px;
    transition: opacity .35s, transform .35s;
    opacity: ${props => props.visible? 1 : 0};
    pointer-events: ${props => props.visible? 'auto' : 'none'};
`
const NavSearchBlock = styled.div`
    position: absolute;
    top: 9.5px; left: 53px; 
    display: flex; align-items: center;
    z-index: 20;
    opacity: ${props => props.active? 1 : 0};
    transition: opacity .35s ${props => props.active? '.35s' : ''};
    pointer-events: ${props => props.active? 'auto' : 'none'};
`
const NavSearchInput = styled.input`
    /*position: absolute; top: 9px;*/animat
    border: none;
    appearance: none; outline: none; background: transparent;
    width: calc(100vw - 160px);
    height: 32px;
    font-size: 14px; letter-spacing: 0.5px;

`
const ClearCancelSearch = styled.div`
    /*position: absolute;*/
    /*left: 210px;*/
    color: var(--strokepeach);
    font-size: 14px; letter-spacing: 0.5px;
`
const textPeachToBlack = keyframes`
    0% { color: var(--strokepeach);}
    100% { color: var(--normtext);}
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
    transition-delay: ${props => props.visible && props.justComplete? '.425s' : '0s'};
    color: ${props => props.justComplete? 'var(--strokepeach)': 'var(--fainttext)'};
    // animation: ${props => props.justComplete? textPeachToBlack: ''} 1.25s forwards 1.5s;
    ${props => props.multiline? `
        // height: 21px;
    ` : ''}
    position: relative;
`
const XCaret = styled(Sprite)`
    position: absolute;
    top: 2px; right: -30px;
    width: 18px; height: 18px;
    /*border: 1px solid black;*/
    flex-shrink: 0;
`
const FixWrap = styled.div`
    position: fixed;
    top: -1px; left: -1px;
    z-index: 10;
    width: calc(100% + 1px);

    transform: translateY(${props=>props.hide? -75: 0}px);
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);   
`
const WorkflowWrap = styled.div`
    border: 1px solid red;
    height: 83px;

` 
const PickMenu = styled(ExpandBox)`
    position: absolute;
    top: -1px; left: -1px;
    // height: 83px;
    z-index: 1;
    transform: translateY(${props => props.workflowScrollOffset? -100 : 0}px);
    transition: transform .35s;
`
const Header = styled(ExpandBox)`
    z-index: 3;
    top: 0; left: 0;
`
const HeaderContent = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    color: ${props => props.whitetext? 'white' : 'var(--fainttext)'};
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
    transition: transform .425s, opacity .275s ${props=>props.active? '.3s' : ''};
    width: 100%;
`
const BarContent = styled(HeaderSection)`
    transform: translateX(${props => props.active? 0 : -25}px);
`
const Btn = styled(HeaderSection)`
    padding: 0 25px;
    justify-content: center;
    width: ${props => props.superwide? 215 : 160}px;
    transform: translateX(${props => props.active? 0 : 25}px);
`
const BarInfo = styled.div`
    position: absolute;
    left: 55px;
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
    width: 18px; height: 18px;
    margin-right: 15px;
    flex-shrink: 0;
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
        const {race, year, county} = store
        const inds = store.indicatorSearchString? store.indicatorSearchResults : Object.keys(indicators)
        let numHealth = 0
        let numEd = 0
        let numWelf = 0
        let numEC = 0
        inds.forEach(function(ind,i,arr){
            if(indicators[ind].categories.includes('health')) numHealth++
            if(indicators[ind].categories.includes('education')) numEd++
            if(indicators[ind].categories.includes('welfare')) numWelf++
            if(indicators[ind].categories.includes('earlyChildhood')) numEC++
        })
        return(
            <React.Fragment>
            <SelectWrapper>
            <IndCats
                onChange = {(e)=>this.setFilter(e.target.value)}
            >
                <option value = "all"> All topics ({inds.length})</option>
                <option value = "health"> Health ({numHealth})</option>
                <option value = "education"> Education ({numEd})</option>
                <option value = "welfare"> Child Welfare ({numWelf})</option>
                <option value = "earlyChildhood"> Early Childhood ({numEC})</option>
            </IndCats>
            </SelectWrapper>
            <WorkflowList>
                {inds.filter((ind)=>{
                    if(this.filter === 'all') return true 
                    else return indicators[ind].categories.includes(this.filter)
                }).map((ind)=>{
                    const v = indicators[ind].counties[county||'california']
                    const needsRaceHasRace = ((race && indicators[ind].categories.includes('hasRace')) || !race)
                    const invalid = !needsRaceHasRace? true : (v[race||'totals'][year] === '*' || v[race||'totals'][year] === '')
                    return (
                        <ListRow
                            className = {store.indicator===ind? 'selected' : invalid? 'invalid' : ''}
                            key = {ind}
                            onClick = {()=>{ 
                                const isNewVal = ind!==store.indicator
                                const completion = store.completeWorkflow('indicator', ind)
                                if(!completion){
                                    if(window.confirm(store.sanityCheck.message)){
                                        store.sanityCheck.action()
                                        this.props.onComplete('indicator', true)
                                    }
                                }
                                else this.props.onComplete('indicator', isNewVal)
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

const FadeInWorkflow = keyframes`
    from {opacity: 0;} to {opacity: 1;}
`

const WorkflowList = styled.ul`
    width: 100%;
    white-space: normal;
    margin: 15px 0 0 0;
    padding: 0 25px 50px 25px;
    overscroll-behavior: contain;
`
const ListRow = styled.li`
    position: relative;
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
    &.selected{
        background: var(--faintestpeach);
        border-color: var(--peach);
        z-index: 3;
    }
    &.invalid{
        background: var(--offwhitefg);
        color: var(--fainttext);
        border-bottom-color: var(--inactivegrey);
        border-left-color: transparent;
        border-top-color: transparent;
        border-right-color: transparent;
        margin-top: 0;
    }
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
    const {indicator, county, year} = store
    return (
        <WorkflowList className = 'notIndicator'>
            <SpecialRow 
                className = {!store.race? 'selected' : ''}
                onClick = {()=>{ store.completeWorkflow('race',''); props.onComplete('race') }}
            > 
                <div>All races</div> 
                <ItemInfo>{truncateNum(demopop[store.county || 'california'].population)} children in {store.county? 'county' : 'CA'}</ItemInfo>
            </SpecialRow>
            {races.map((r)=>{
                const popPct = demopop[store.county || 'california'][r]
                const ind = !indicator? '' : indicators[indicator]
                const invalid = !indicator? false : !ind.categories.includes('hasRace') || (ind.counties[county||'california'][r][year] === '*' || ind.counties[county||'california'][r][year] === '')
                return <ListRow 
                    key = {r} 
                    className = {store.race===r? 'selected' : invalid? 'invalid' : ''}
                    onClick = {()=>{ 
                        const isNewVal = r!==store.race
                        const completion = store.completeWorkflow('race',r)
                        if(completion)  props.onComplete('race', isNewVal)
                        else if(window.confirm(store.sanityCheck.message)){
                            store.sanityCheck.action()
                            props.onComplete('race',true)
                        }
                    }}
                >
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
@observer class CountyList extends React.Component {
    render(){
    const props = this.props
    const {store} = props
    const {indicator, race, year} = store
    const cties = store.countySearchString? store.countySearchResults : Object.keys(countyLabels)
    return (
        <WorkflowList className = 'notIndicator'>
            <SpecialRow
                className = {!store.county? 'selected' : ''} 
                onClick = {()=>{
                    store.completeWorkflow('county', '')
                    props.onComplete('county')
                }} 
            >
                <div>California </div>
                <ItemInfo>{sigFig(demopop.california.population)} children</ItemInfo>
            </SpecialRow>
            {cties.sort((a,b)=>{
                if(a < b) return -1
                else if (a > b) return 1
                else return 0
            }).map((cty)=>{
                const v = !indicator? '' : indicators[indicator].counties[cty][race||'totals'][year]
                const invalid = !indicator? false : (v === '*' || v === '')
                return <ListRow 
                    key = {cty}
                    className = {store.county===cty? 'selected' : invalid? 'invalid' : ''}
                    onClick = {()=>{ 
                        const isNewVal = cty !== store.county
                        const completion = store.completeWorkflow('county', cty)
                        if(completion) props.onComplete('county', isNewVal)
                        else if(window.confirm(store.sanityCheck.message)){
                            if(store.sanityCheck.action){
                                store.sanityCheck.action()
                                props.onComplete('county',true)
                            }
                        }                        
                    }}
                >
                    <div>{countyLabels[cty]}</div>
                    <ItemInfo>
                        {sigFig(demopop[cty].population)} children
                    </ItemInfo>
                </ListRow>
            })}
        </WorkflowList>
    )
    }
}

const SpecialRow = styled(ListRow)`
    margin-bottom: 15px;
`
const ItemInfo = styled.div`
    font-size: 12px;
    color: var(--fainttext);
`

const HeaderBtnIcon = styled(Icon)`
    width: 18px; height: 18px;
    margin-left: 8px;
    flex-shrink: 0;
`
const CollapseHeaderIcon = styled(HeaderBtnIcon)`
    // width: 25px; height: 25px;
`
const SaveHeaderIcon = styled(HeaderBtnIcon)``

const IndExpandBox = styled(ExpandBox)`
    background-color: ${props => props.justComplete? 'var(--faintestpeach)' : 'transparent'};
    // animation: ${props => props.justComplete? peachBGAnim : ''} 1.25s forwards 1.5s;
`
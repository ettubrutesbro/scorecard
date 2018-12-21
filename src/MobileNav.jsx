import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import IntersectionObserver from '@researchgate/react-intersection-observer'
import FlipMove from 'react-flip-move'

import indicators from './data/indicators'
import semanticTitles from './assets/semanticTitles'

import Icon from './components/generic/Icon'
import {Toggle} from './components/generic'
import ExpandBox from './components/ExpandBox'



@observer
export default class MobileNav extends React.Component{

    @observable mode = false // compact, county, race, indicator
    @action setMode = (val) => this.mode = val
    @observable justComplete = null
    @action justCompleted = (what) => this.justComplete = what

    render(){ 
        const props = this.props
        const {open, store} = props

        const NavItems = [
            <div key = 'county' style = {{height: '50px', marginLeft: '-1px',zIndex: this.mode==='county'?0:1}}>
                <ExpandBox
                    duration = {this.mode === 'county'? .5 : 0 }
                    currentMode = {this.mode==='county'? 'fullscreen' : 'compact'}
                    modes = {{
                        compact: {width: window.innerWidth+1, height: 50},
                        fullscreen: {width: window.innerWidth+1, height: window.innerHeight - 100}
                    }}
                    backgroundColor = {this.mode==='county'? 'var(--offwhitefg)' : 'white'}
                    delay = {this.mode==='county'? '.35s' : 0}
                    noBorderTop = {this.mode==='compact'}
                >
                    <MenuSelectBlock left = 'County' right = 'California (all)' 
                        onClick = {()=> this.setMode('county') }
                        open = {this.mode === 'county'}
                        prompt = 'Pick a county.'
                        return = {()=>this.setMode('compact')}
                    />
                </ExpandBox>
            </div>,

            <div key = 'race' style = {{height: '50px', marginLeft: '-1px', zIndex: this.mode==='race'?0:1}}>
                        <ExpandBox
                            duration = {this.mode === 'race'? .5 : 0 }
                            currentMode = {this.mode==='race'? 'fullscreen' : 'compact'}
                            modes = {{
                                compact: {width: window.innerWidth+1, height: 50},
                                fullscreen: {width: window.innerWidth+1, height: window.innerHeight - 100}
                            }}
                            backgroundColor = {this.mode==='race'? 'var(--offwhitefg)' : 'white'}
                            delay = {this.mode==='race'? '.35s' : 0}
                        >
                            <MenuSelectBlock left = 'Race' right = 'All races' 
                                onClick = {()=> this.setMode('race') }
                                open = {this.mode === 'race'}
                                prompt = 'Select a race.'
                                return = {()=>this.setMode('compact')}
                                noSearch
                            />
                        </ExpandBox>
            </div>,

            <div key = 'indicator' style = {{height: '50px', marginLeft: '-1px',zIndex: this.mode==='indicator'?0:1}}>
                <ExpandBox
                    withScroll
                    hideScroll = {this.mode==='county' || this.mode==='race'}
                    noFade
                    duration = {this.mode === 'indicator'? .5 : 0 }
                    currentMode = {this.mode==='indicator'? 'fullscreen' : this.mode === 'county' || this.mode==='race'? 'compactTruncated': 'compact'}
                    modes = {{
                        compact: {width: window.innerWidth+1, height: 115},
                        compactTruncated: {width: window.innerWidth+1, height: 50},
                        fullscreen: {width: window.innerWidth+1, height: window.innerHeight-100}
                    }}
                    backgroundColor = {this.mode==='indicator'? 'var(--offwhitefg)' : 'white'}
                >
                    <div>
                    <MenuSelectBlock left = 'Indicator' right = 'Early prenatal care and other asst. shit' multiline 
                        onClick = {()=> this.setMode('indicator') }
                        open = {this.mode === 'indicator'}
                        prompt = 'Choose an indicator.'
                        return = {()=>this.setMode('compact')}
                        truncateValue = {this.mode==='county' || this.mode==='race'}
                        justComplete = {this.justComplete==='indicator'}
                    />
                    {this.mode !=='race' && this.mode !== 'county' &&
                    <YearToggle
                        visible = {this.mode==='compact'}
                        options = {[
                            {label: 2016, value: 0},    
                            {label: 2017, value: 1},    
                        ]}
                        selected = {1}
                    />
                    }
                    {this.mode==='indicator' &&
                        <IndicatorList store = {store} onComplete = {(which)=>{
                            this.setMode('compact')
                            this.justCompleted(which)
                        } }/>
                    }
                    </div>
                </ExpandBox>
            </div>
        ].sort((a,b)=>{
            if(a.key===this.mode) return 1
            if(b.key===this.mode) return -1
        })

        return(
            <FixWrap>
                <PickMenu
                    currentMode = {!this.mode? 'closed' : this.mode === 'compact'? 'open' : 'fullsize'}
                    modes = {{
                        closed: {width: window.innerWidth+1, height: 1},
                        fullsize: {width: window.innerWidth+1, height: window.innerHeight},
                        open: {width: window.innerWidth+1, height: 265}    
                    }}
                    backgroundColor = 'white'
                    borderColor = 'var(--fainttext)'
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
                currentMode = {!this.mode? 'bar' : this.mode === 'compact'? 'button' : 'offscreen'}
                modes = {{
                    bar: {width: window.innerWidth, height: 55},
                    button: {width: 150, height: 55},
                    offscreen: {width: 150, height: 55} 
                }}
                backgroundColor = 'var(--offwhitebg)'
                borderColor = 'var(--offwhitebg)'
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
                            Shorthand bla bla
                        </Shorthand>
                    </BarContent>

                    <Btn active = {this.mode==='compact'}>
                        Back to view
                    </Btn>
                </HeaderContent>
            </Header>
            <Mask visible = {this.mode}/>

            </FixWrap>
        )
    }
}

const Mask = styled.div`
    width: 100vw;
    height: ${props => props.visible? '100vh' : '0px'};
    background: linear-gradient(180deg, #FCFDFF 45%, rgba(252, 253, 255, 0.4) 100%);
    opacity: ${props => props.visible? 1 : 0};
    transition: opacity .35s;
    transition-delay: ${props => props.visible? '.15s' : '0s'};
`

const YearToggle = styled(Toggle)`
    position: absolute;
    left: 25px;
    bottom: -45px;
    transition: opacity .35s;
    opacity: ${props => props.visible? 1 : 0};
    pointer-events: ${props => props.visible? 'auto' : 'none'};
`

const MenuSelectBlock = (props) => {
    return(
    <MSB multiline = {props.multiline} onClick = {!props.open? props.onClick : ()=>{}}>
        <MSBPrompt visible = {props.open}>{props.prompt}</MSBPrompt>
        <MSBLabel 
            multiline = {props.multiline}
            visible = {!props.open}
        >
            {props.left}
        </MSBLabel>
        <MSBValue multiline = {props.multiline}>
            <Val multiline = {props.multiline} visible = {!props.open} justComplete = {props.justComplete}>
                {props.truncateValue && props.right.length > 27 && props.right.slice(0,25)+'...'}
                {!(props.truncateValue && props.right.length > 27) && props.right}
                
            </Val>
            {!props.noSearch && 
                <NavSearch img = "searchzoom" color = "normtext" visible = {props.open} />
            }
            <XCaret mode = {'caret'}
                onClick = {props.open? props.return : ()=>{} }
            />
        </MSBValue>
    </MSB>
    )
}
const MSB = styled.div`
    padding: 0 25px;
    display: flex;
    width: ${window.innerWidth}px;
    height: 50px;
    align-items: center; justify-content: space-between;
    ${props => props.multiline? `
        // align-items: flex-start;
        // padding-top: 16px;
    ` : ''}
`
const MSBLabel = styled.div`
    font-size: 12px;
    flex-shrink: 0;
    position: relative;
    opacity: ${props=>props.visible? 1 : 0};
`
const MSBPrompt = styled.span`
    position: absolute;
    margin-top: 2px;
    opacity: ${props => props.visible? 1: 0};
`
const MSBValue = styled.div`
    display: flex; align-items: center;
    font-size: 16px;
    color: var(--fainttext);
    margin-left: 25px; 
`
const NavSearch = styled(Icon)`
    position: absolute;
    right: 60px;
    width: 18px; height: 18px;
    transition: opacity .35s;
    opacity: ${props => props.visible? 1 : 0};
    pointer-events: ${props => props.visible? 'auto' : 'none'};
`
const Val = styled.div`
    flex-shrink: 1;
    white-space: normal;
    text-align: right;
    opacity: ${props=>props.visible? 1 : 0};
    transition: opacity .35s;
    transition-delay: ${props => props.visible && props.justComplete? '.4s' : '0s'};
    ${props => props.multiline? `
        // margin-top: -4px;
        // line-height: 23px;
        height: 16px;
    ` : ''}
`
const XCaret = styled.div`
    margin-left: 13px; 
    width: 15px; height: 15px;
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
    top: -1px; left: -1px;
    height: 83px;

`
const Header = styled(ExpandBox)`
    z-index: 2;
    top: 0; left: 0;
    transform: translate(${props=>props.currentMode==='offscreen'?  window.innerWidth - 150+'px,'+window.innerHeight+'px' : props.currentMode==='button'? window.innerWidth - 150 + 'px,235px' : '0px,0px'});
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    &::before{
        content: '';
        position: absolute;
        left: -20px;
        height: 1px;
        top: 13px;
        width: 20px;
        background: var(--offwhitefg);
    }
`
const HeaderContent = styled.div`
    position: relative;
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
    transition: transform .4s;
    width: 100%;
`
const BarContent = styled(HeaderSection)`
    transform: translateY(${props => props.active? 0 : 100}%);
`
const Btn = styled(HeaderSection)`
    transform: translateY(${props => props.active? 0 : -100}%);
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
`

const IndCats = styled.select`
    font-family: 'Heebo', sans-serif;
    font-size: 14px;
    height: 44px;
    padding: 10px 15px;
    margin-left: 25px;
    margin-top: 2px;
    width: 190px;
    letter-spacing: 0.5px;
    appearance: none;
    color: var(--normtext);

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
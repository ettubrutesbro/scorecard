
import React from 'react'
import styled, {keyframes} from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import makeHash from '../../utilities/makeHash'
import {findDOMNode} from 'react-dom'
import {find} from 'lodash'

import media from '../../utilities/media'

import FlipMove from 'react-flip-move'
import {capitalize} from '../../utilities/toLowerCase'

const ToggleBody = styled.div`
    position: relative;
    display: inline-flex;
`
const Option = styled.div`
    cursor: pointer;
    box-sizing: border-box;
    height: 100%;
    border: 1px solid ${props => props.selected? 'var(--strokepeach)':'var(--bordergrey)'};
    
    z-index: ${props => props.selected? 1 : 0}
    &.negativeNoStroke{
        @media ${media.optimal}{
            height: 48px;
        }
        @media ${media.compact}{
            height: 44px;
        }
        display: flex; align-items: center;
        border: 1px solid transparent;
        &:not(:first-of-type){
            border-left: 1px solid var(--offwhitebg);
        }
        z-index: 1;
    }
    font-size: ${props=> props.size === 'big'? '16px' : '13px'};
    letter-spacing: 0.5px;
    @media ${media.optimal}{
        padding: ${props => props.size==='big'? '12px 20px' : '6px 15px'};    
    }
    @media ${media.compact}{
        padding: ${props => props.size==='big'? '10px 20px' : '6px 15px'};    
    }

    color: ${props => props.selected? 'var(--strokepeach)' : props.disabled? 'var(--fainttext)' : 'var(--normtext)'};
    background-color: ${props => props.selected? 'var(--faintpeach)' : props.disabled? 'var(--disabledgrey)' : 'white'};
    @media ${media.mobile}{
        font-size: 12px;
        padding: 8.5px 15px;
        border: 1px solid ${props => props.selected? 'var(--normtext)':'var(--bordergrey)'};
        color: ${props => props.disabled? 'var(--fainttext)' : 'var(--normtext)'};
        background-color: white;
 
    }
    white-space: nowrap;
    &:hover{
        color: var(--strokepeach);
        outline-color: var(--strokepeach);
        /*z-index: 1;*/
    }
    &:not(:first-of-type){
        transform: translateX(-${props => props.index}px);
    }

` 

const Accent = styled.div`
    position: absolute;
    display: none;
    width: 100px;
    bottom: 0;
    box-sizing: border-box;
    height: 100%;
    background: var(--faintpeach);
    // border: 1px solid var(--strokepeach);
    transform-origin: 0% 100%;
    transition: transform .2s;
    z-index: 0;
    &::after{
        // content: '';
        position: absolute;
        height: 3px;
        border-right: 1px solid var(--strokepeach);
        right: -3px;
        top: -2px;
    }
`
@observer
export class Toggle extends React.Component {
    hash = makeHash()
    @observable accentWidth = 50
    @observable accentPosition = 0
    @observable lastSelected = 0
    @action setLastSelected = () => this.lastSelected = this.props.selected
    // @action updateAccent = () => {
    //     const node = findDOMNode(this['option'+this.props.selected])
    //     this.accentPosition =  node.offsetLeft
    //     this.accentWidth = node.offsetWidth
    // }
    // componentWillUpdate(){
    //     this.setLastSelected()
    // }
    // componentDidMount(){
    //     this.updateAccent()
    // }
    // componentDidUpdate(){
    //     this.updateAccent()
    // }


     render(){
    return(
        <ToggleBody style = {this.props.style} size = {this.props.size} className = {this.props.className}>
            {this.props.options.map((option, i,arr)=>{
                
                return <Option 
                    className = {this.props.theme}
                    firstLast = {i===0?'first':i===arr.length-1?'last':''}
                    index = {i}
                    size = {this.props.size}
                    key = {this.hash+'option'+i}
                    ref = {(option)=> this['option'+i] = option}
                    onClick = {!option.disabled? ()=>this.props.onClick(option.value) : ()=>console.log('this option is disabled.')}
                    selected = {i===this.props.selected}
                    disabled = {option.disabled}
                > 
                    {option.label}
                </Option>
            })}
            <Accent 
                style = {{
                    transform: `translateX(${this.accentPosition}px) scaleX(${this.accentWidth/100})`,
                    // transition: `transform ${.25*Math.abs(this.lastSelected - this.props.selected)}s`
                }}
            />
        </ToggleBody>
    )
    }


}

Toggle.defaultProps = {
    selected: 0,
}



export class Tooltip extends React.Component {
    render(){
        const {theme, direction, children, ...restOfProps} = this.props
        return(
                <Tip 
                    {...restOfProps}
                    className = {[
                        theme || 'default',
                        direction || 'above'
                    ].join(' ')}
                >
                    {children}
                </Tip>  
                
        )
    }
}
const fadeInBelow = keyframes`
    from {
        opacity: 0; 
        transform: translate(-50%, calc(50%));
    }
    to {
        opacity: 1;
        transform: translate(-50%, calc(50% + 20px));
    }
`
const fadeInAbove = keyframes`
    from {
        opacity: 0; 
        transform: translate(-50%, calc(-50% - 20px));
    }
    to {
        opacity: 1;
        transform: translate(-50%, calc(-50% - 35px));
    }
`
export const Tip = styled.div`
    //display: ${props => props.show? 'block' : 'none'};
    position: absolute;
    ${props=>props.verticalAnchor || 'top'}: ${props => props.pos.y}px;
    ${props=>props.horizontalAnchor || 'left'}: ${props => props.pos.x}px;
    opacity: 0;
    animation-fill-mode: forwards;
    &.above{
        &::before{ bottom: -21.5px;}
        &::after{ bottom: -19px;}
        //transform: translate(-50%, calc(-50% - 35px));
        transform-origin: 50% 100%;
        animation: ${p => p.customAnimation || fadeInAbove} ${p=>p.duration || '.35s'} forwards;

    }
    &.below{
        &::before{ top: -21.5px; }
        &::after{ top: -19px; }
        //transform: translate(-50%, calc(50% + 20px));   
        
        animation: ${p => p.customAnimation || fadeInBelow} ${p=>p.duration||'.75s'} forwards;
    }
    z-index: 99;
    padding: 15px 25px;
    &::after{
        left: calc(50% - 9.5px);
        transform: translateX(${props => props.caretOffset || 0}px);
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 9.5px solid transparent;
    }
    &::before{
        left: calc(50% - 10.5px);
        transform: translateX(${props => props.caretOffset || 0}px);
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 10.5px solid transparent;
    }
    &.default{
        background: var(--normtext);
        color: white;
        outline: 1px solid var(--offwhitefg);
        &.above{
            &::after{ border-top: 9.5px var(--normtext) solid;  }
            &::before{ border-top: 10.5px var(--offwhitefg) solid; margin-top: 1px;}
        }
        &.below{
            &::after{ border-bottom: 9.5px var(--normtext) solid;  }
            &::before{ border-bottom: 10.5px var(--offwhitefg) solid;  margin-top: -1px;}
        }
    }
    &.actionable{
        background: var(--offwhitefg);
        border: 1px solid var(--bordergrey);
        padding: 0;
        &.above{
            &::before { border-top: 10.5px var(--bordergrey) solid; }
            &::after{ border-top: 9.5px var(--offwhitefg) solid; }
        }
        &.below{
            &::before { border-bottom: 10.5px var(--bordergrey) solid; }
            &::after{ border-bottom: 9.5px var(--offwhitefg) solid;  }
        }
    }
    h1{ margin: 0; font-size: 24px;  font-weight: normal;}
    h2{ margin: 0; font-size: 16px;   font-weight: normal;}
    h3{ margin: 0; font-size: 13px; color: var(--fainttext); font-weight: normal;}

`

const SearchWrap = styled.div`
    
    position: relative;
    padding-left: 15px;
    display: flex;
    align-items: center;
`
const mag = require('../../assets/search.svg')
const SearchIcon = styled.div`
    position: absolute;
    left: 5px;
    width: 15px; height: 15px;
    mask-image: url(${mag});
    background-color: var(--strokepeach);
    // background-image: url(${mag});

`
const SearchInput = styled.input`
    appearance: none;
    background: transparent;
    border: none;
    outline: none;
    padding: 6px 15px;
    &::placeholder{
        color: var(--strokepeach);
    }
`

export const Search = (props) => {
        return(
            <SearchWrap> 
                <SearchIcon />
                <SearchInput 
                    placeholder = {props.placeholder}
                    value = {props.value}
                    onChange = {props.onChange}
                />
            </SearchWrap>
        )
    
}

const Btn = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    @media ${media.optimal}{
        padding: 12px 25px;    
    }
    @media ${media.compact}{
        padding: 10px 21px;
    }
    @media ${media.mobile}{
        padding: 10px 21px;
    }
    cursor: pointer;
    &.default, &.compact{
        background: white;
        color: var(--normtext);
        border: 1px solid var(--fainttext);
        &:hover{
            color: var(--strokepeach);
        }
    }

    &.compact{
        font-size: 13px;
        padding: 10px 15px;
        height: 33px;
    }
    &.dark{
        background: var(--normtext);
        color: white;
        border: 1px solid var(--normtext);
    }
    &.negative{
        background: black;
        background: var(--offwhitebg);
        border: 1px solid var(--offwhitebg);
        color: white;
        &:hover{
            color: var(--peach);
        }
    }
    &.negativeOnDark{
        background: var(--offwhitebg);
        color: white;
        border: 1px solid var(--offwhitefg);
        &:hover{
            color: var(--peach);
            border-color: var(--peach);

        }
    }
    &.borderless{
        border-color: transparent;
    }
`

export const Button = (props) => {
    return(
        <Btn
            style = {props.style}
            className = {props.disabled? 'disabled' : props.className || 'default'}
            onClick = {!props.disabled? props.onClick : ()=>{}}
        >
            {props.label}
        </Btn>
    )
}

export const Triangle = (props) => {
    return(
        <Shpitz />
    )
}

const Shpitz = styled.div`

    &::after, &::before{
        position: absolute;
        content: '';
        width: 0; height: 0;
    }
    &::after{
        left: calc(50% - 9.5px);
        top: -19px;
        border: 9.5px solid transparent;
        border-bottom: 9.5px white solid;
    }
    &::before{
        left: calc(50% - 10.5px);
        top: -21.5px;
        border: 10.5px solid transparent;
        border-bottom: 10.5px var(--bordergrey) solid;
    }

`

@observer
export class DropdownToggle extends React.Component {
    @observable dropdownOpen = false
    @action setDropdown = (tf) => {
        if(tf) document.addEventListener('click', this.handleOutside)
        else document.removeEventListener('click', this.handleOutside)
        this.dropdownOpen = tf
        if(this.props.setDropdownState) this.props.setDropdownState(tf)
    }
    @observable hovered = false
    @action hover = (tf) => {this.hovered = tf}

    @observable strikethrough = false
    @action setStrikethrough = (tf) => {this.strikethrough = tf}

    constructor(){
        super()
        this.dropdown = React.createRef()
    }

    handleOutside = (e) => {
        if(!this.dropdown.current.contains(e.target)){
            // console.log('clicked outnside')
            this.setDropdown(false)
        }
    }

    handleSelectionFromDropdown = (val) => {
        const validSelect = this.props.select(val)
        if(validSelect) this.setDropdown(false)
        else{ //sanity check tings?
            console.log('sanity check race?')
        }
    }

    render(){
        // const {race} = this.props.store
        const {selected, toggleMode, disabled, options, defaultWidth} = this.props
        return(
            <DropdownToggleWrapper
                className = {this.props.className}
                width = {defaultWidth}
                disabled = {disabled}
                onMouseEnter = {()=>{this.hover(true)}}
                onMouseLeave = {()=>{this.hover(false)}}
            >
            <Caret 
                visible = {!toggleMode}
                length = {options.length}
                disabled = {disabled}
                hovered = {this.hovered && !this.dropdownOpen && !this.strikethrough}
                hasValue = {selected}
                isOpen = {this.dropdownOpen}
                onClick = {this.props.openOther? this.props.openOther : !disabled? ()=>{
                    this.setDropdown(!this.dropdownOpen)
                } : ()=>{}}
            />

                <FirstOptBorder
                    length = {options.length} 
                    defaultWidth = {defaultWidth}
                    toggleMode = {toggleMode}
                    selected = {toggleMode && !selected}
                    hasValue = {selected && !toggleMode && !this.dropdownOpen}
                    disabled = {disabled}
                    dropdownOpen = {this.dropdownOpen}
                />
                {options.slice(0,1).map((o)=>{
                    return(
                        <TogOption 
                            strikethrough = {this.strikethrough && selected}
                            defaultWidth = {defaultWidth} 
                            className = 'first'
                            label = {!toggleMode && selected? find(options, (opt)=>{return opt.value===selected}).label
                                : toggleMode || !selected? o.label
                                : 'wat'}
                            toggleMode = {toggleMode}
                            onClick = {this.props.openOther? this.props.openOther : toggleMode? ()=>{
                                this.props.select(o.value)
                            }:!disabled? ()=>{
                                this.setDropdown(!this.dropdownOpen)
                            } : ()=>{}}
                            hasValue = {selected && !toggleMode && !this.dropdownOpen}
                            selected = {toggleMode && !selected}
                            disabled = {o.disabled || disabled}
                            muted = {disabled}
                            hovered = {this.hovered && !toggleMode}
                            dropdownOpen = {this.dropdownOpen}
                        >
                            {!toggleMode && selected? find(options, (opt)=>{return opt.value===selected}).label
                                : toggleMode || !selected? o.label
                                : 'wat'
                            }
                            {selected && !this.dropdownOpen && !toggleMode &&
                                <QuickClear 
                                    onMouseEnter = {()=>{this.setStrikethrough(true)}}
                                    onMouseLeave = {()=>{this.setStrikethrough(false)}}
                                    onClick = {selected? (e)=>{
                                        this.props.select(null)
                                        this.hover(false)
                                        this.setStrikethrough(false)
                                        e.stopPropagation()
                                        // e.nativeEvent.stopImmediatePropagation()
                                    }: ()=>{}}
                                />
                            }
                        </TogOption>
                    )
                })}


                    {this.props.options.slice(1).map((o,i,arr)=>{
                        return(
                            <TogOption
                                length = {arr.length}
                                offset = {i===0? true : false}
                                reveal = {toggleMode}
                                index = {i}
                                onClick = {()=>{this.props.select(o.value)}}
                                selected = {!o.value? !selected : o.value===selected}
                                disabled = {o.disabled || disabled}
                            >
                                {o.label}
                            </TogOption>
                        )
                    })}


                <DropdownList
                    ref = {this.dropdown}
                    open = {this.dropdownOpen && !this.props.toggleMode}
                    close = {()=>this.setDropdown(false)}
                >
                    {this.props.options.map((o,i)=>{
                        return(
                        <DropdownOption
                            index = {i}
                            // onClick = {()=>{this.props.select(o.value)}}
                            onClick = {()=>{this.handleSelectionFromDropdown(o.value)}}
                            disabled = {o.disabled}
                            selected = {!o.value? !selected : o.value===selected}
                        >
                            {o.label}
                        </DropdownOption>
                        )
                    })}
                </DropdownList>
                
            </DropdownToggleWrapper>
        )
    }
}   

const DropdownToggleWrapper = styled.div`
    position: relative;
    width: ${props => props.width}px;
    @media ${media.optimal}{
        height: 48px;
    }
    @media ${media.compact}{
        height: 44px;
    }
`

const DropdownList = styled.ul`
    position: absolute;
    width: 100%;
    left: -1px;
    @media ${media.optimal}{
        top: 48px;
    }
    @media ${media.compact}{
        top: 44px;
    }
    padding: 0; margin: 0;
    opacity: 0;     
    transform: translateY(-25px);
    clip-path: polygon(0 -10px, 100% -10px, 100% 0, 0 0);
    transition: opacity .25s, transform .25s, clip-path .25s;
    pointer-events: none;
    ${props => props.open? `
        opacity: 1;
        transform: translateY(0);
        clip-path: polygon(0 -10px, 100% -10px, 100% 100%, 0 100%);
        pointer-events: auto;
    `: ''}
`
const DropdownOption = styled.li`
    &:not(:first-of-type){
        border-top: 1px solid var(--bordergrey);
        // border-bottom: 1px solid ${p=>p.selected? 'var(--strokepeach)' :'transparent'};
    }
    border: 1px solid var(--bordergrey);
    ${props => props.selected? `
        outline: 1px solid var(--strokepeach);
        outline-offset: -1px;    
    ` : ''}
    background: ${p => p.disabled? 'var(--disabledgrey)' : p.selected? 'var(--faintpeach)' : 'white'};
    color: ${p => p.disabled? 'var(--fainttext)' : p.selected? 'var(--strokepeach)' : 'var(--normtext)'};
    cursor: ${p => p.disabled? 'auto' : 'pointer'}; 
    @media ${media.optimal}{
        padding: 12px 25px;
    }
    @media ${media.compact}{
        padding: 10px 21px;
    }
    list-style-type: none;
    margin-top: -1px;
    &:hover{
        color: ${p => !p.disabled? 'var(--strokepeach)' : 'var(--fainttext)'};
    }
`
const TogOption = styled.div`
    display: inline-flex; 
    align-items: center;
    height: 100%;
    position: absolute;
    left: 0;
    @media ${media.optimal}{
        padding: 12px 25px;
    }
    @media ${media.compact}{
        padding: 10px 21px;
    }
    // border: 1px solid ${p => p.selected? 'var(--strokepeach)' : 'var(--offwhitebg)'};
    background: ${p => p.disabled? 'var(--disabledgrey)' : p.selected? 'var(--faintpeach)' : 'white'};
    cursor: ${p => p.disabled? 'auto' : 'pointer'}; 
    color: ${p => p.dropdownOpen || p.muted || p.disabled? 'var(--fainttext)' : (p.hovered&&!p.dropdownOpen) || p.selected? 'var(--strokepeach)' : 'var(--normtext)'};
    white-space: nowrap;

    transform: translateX(${props => props.reveal? (props.index+1)*100 : 0}% );
    transition: transform ${props=> .15 * (props.index+1)}s;
    &.first{
        width: ${props => props.defaultWidth}px;
        margin-right: -20px;
        z-index: 3;
        background-color: transparent;
        border-color: transparent;
        color: ${p => p.hovered && p.muted? 'var(--fainttext)' : p.hasValue || p.hovered? 'var(--strokepeach)' : ''};
        font-weight: ${p => p.hasValue? 500 : 400};
        &::after{
            content: 'Arace';
            color: rgba(0,0,0,0);
            position: absolute;
            top: calc(50% - 1px);
            left: 20px;
            padding: 0 5px;
            z-index: 4;
            bottom: 0;
            margin: auto;
            border-top: 2px solid var(--strokepeach);
            transform: scaleX(${props => props.strikethrough? 1 : 0});
            transition: transform .2s;
            pointer-events: none;
            transform-origin: ${p=>p.hasValue? '100% 50%' : '0% 50%'};

        }
    }
    &:not(.first){
        justify-content: center;

        outline: 1px solid var(--offwhitebg);
        margin-left: ${props => 25 - props.index}px;
        width: 93px;
        z-index: ${props => 2 - props.index};
        // z-index: ${props => (props.length - props.index) + 2};
        ${props => props.selected? `
        // box-shadow: inset 0px 0px 0px 1px var(--strokepeach);
        `: ''}
    }
    &:hover{
        color: ${p => !p.disabled? 'var(--strokepeach)' : 'var(--fainttext)'};
    }
`
const FirstOptBorder = styled.div`
    position: absolute;

    ${props => props.dropdownOpen? `
        box-shadow: inset 0px 0px 0px 1.5px var(--peach);
    `: ''}
    outline: 1px solid var(--offwhitebg);
    // border: ${p => p.selected || p.hasValue? '1px solid var(--strokepeach)' : '1px solid transparent'};
    width: ${props => props.defaultWidth}px;
    height: 100%;
    z-index: 3;
    background: ${p => p.hasValue? 'var(--faintpeach)' : p.disabled? 'var(--disabledgrey)' : p.selected? 'var(--faintpeach)' : 'white'};
    
    left: -1px;
    transform-origin: 0% 50%;
    // transition: transform .2s, outline-color ${p=>p.hasValue?'.':''}2s;
    transition: transform .2s, box-shadow .25s, background-color .25s;
    // transition-delay: ${p => p.toggleMode? 0 : (p.length * .15) + .15}s;
    transform: ${p => !p.toggleMode? 'scaleX(1)' : `scaleX(${(p.defaultWidth-20)/p.defaultWidth})`};
        

`



DropdownToggle.defaultProps = {
    selected: 0,
    select: (id)=>{console.log('selected', id)}
}


export const Caret = styled.div`
    cursor: pointer;
    position: absolute;
    opacity: ${props => props.visible? 1 : 0};
    transition: opacity .15s;
    // transition-delay: ${props => props.visible? (props.length*.15)+.15 : 0}s;
    right: 0;
    z-index: 5;
    top: 3px; 
    bottom: 0; margin: auto;
    height: 13px;
    &::before{
        margin-top: 2px;
        content: '';
        right: 18px;
        width: 0px;
        border: 7px solid transparent;
        border-top-color: ${props => props.disabled? 'var(--bordergrey)' : props.hovered && props.hasValue && !props.disabled? 'var(--strokepeach)' : props.hasValue&&!props.isOpen? 'var(--peach)' : props.hovered || props.isOpen? 'var(--strokepeach)' :  'var(--normtext)'};
        height: 0px;
        position: absolute;
    }
    &::after{
        margin-top: 2px;
        content: '';
        right: 18px;
        width: 0px;
        border: 7px solid transparent;
        transform: scale(0.75);
        transform-origin: 50% 20%;
        border-top-color: white;
        opacity: ${props => props.disabled? 0 : 1};
        height: 0px;
        position: absolute;

        transition: opacity .25s, transform .25s;
        ${props => props.hovered || props.isOpen? `
            transform: scale(0.65);    
        ` : ''}
        ${props => props.hasValue && !props.isOpen? `
            transform: scale(0);    
        ` : ''}
    }
`


const peachX = require('../../assets/peach-x.svg')
const QuickClear = styled.div`
    // position: absolute;
    z-index: 4; 
    right: 15px;
    width: 15px; height: 15px;
    margin-bottom: 0px;
    margin-right: -5px;
    margin-left: 8px;
    flex-shrink: 0;
    background: url(${peachX}) no-repeat;
    &:hover{
        opacity: 1;
    }
    opacity: 0.5;
    transition: opacity .2s;
`
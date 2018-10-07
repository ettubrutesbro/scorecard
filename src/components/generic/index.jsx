
import React from 'react'
import styled, {keyframes} from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import makeHash from '../../utilities/makeHash'
import {findDOMNode} from 'react-dom'

import FlipMove from 'react-flip-move'

const ToggleBody = styled.div`
    position: relative;
    display: inline-flex;
    // border: 1px solid var(--fainttext);
    // padding: 10px;
`
const Option = styled.div`
    cursor: pointer;
    box-sizing: border-box;
    height: 100%;
    // margin: 0 -1px;
    border: 1px solid ${props => props.selected? 'var(--strokepeach)':'var(--fainttext)'};
    z-index: ${props => props.selected? 1 : 0}
    font-size: ${props=> props.size === 'big'? '16px' : '13px'};
    letter-spacing: 0.5px;
    padding: ${props => props.size==='big'? '10px 20px' : '6px 15px'};
    // border-radius: ${props => props.firstLast==='first'? '4px 0 0 4px' : props.firstLast === 'last'? '0 4px 4px 0' : ''};
    color: ${props => props.selected? 'var(--strokepeach)' : props.disabled? 'var(--inactivegrey)' : 'var(--fainttext)'};
    background-color: ${props => props.selected? 'var(--faintpeach)' : props.disabled? 'var(--inactivegrey)' : 'white'};
    // background: ${props => props.disabled? '#f3f3f5' : 'white'};
    &:hover{
        // background: white;
        color: ${props => props.selected?'var(--strokepeach)':'var(--strokepeach)'};
        outline-color: var(--strokepeach);
        z-index: 1;
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
    @action updateAccent = () => {
        const node = findDOMNode(this['option'+this.props.selected])
        this.accentPosition =  node.offsetLeft
        this.accentWidth = node.offsetWidth
    }
    componentWillUpdate(){
        this.setLastSelected()
    }
    componentDidMount(){
        this.updateAccent()
    }
    componentDidUpdate(){
        this.updateAccent()
    }


    render(){
    return(
        <ToggleBody size = {this.props.size}>
            {this.props.options.map((option, i,arr)=>{
                
                return <Option 
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
                    transition: `transform ${.25*Math.abs(this.lastSelected - this.props.selected)}s`
                }}
            />
        </ToggleBody>
    )
    }

}

Toggle.defaultProps = {
    selected: 0,
}



export const Tooltip = (props) => {
    const {theme, direction, children, ...restOfProps} = props
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
const Tip = styled.div`
    //display: ${props => props.show? 'block' : 'none'};
    position: absolute;
    ${props=>props.verticalAnchor || 'top'}: ${props => props.pos.y}px;
    ${props=>props.horizontalAnchor || 'left'}: ${props => props.pos.x}px;
    opacity: 0;
    animation-fill-mode: forwards;
    &.above{
        &::before{ bottom: -21px;}
        &::after{ bottom: -19px;}
        //transform: translate(-50%, calc(-50% - 35px));
        transform-origin: 50% 100%;
        animation: ${p => p.customAnimation || fadeInAbove} ${p=>p.duration || '.35s'} forwards;

    }
    &.below{
        &::before{ top: -21px; }
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
        left: calc(50% - 11px);
        transform: translateX(${props => props.caretOffset || 0}px);
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 10.5px solid transparent;
    }
    &.default{
        background: var(--normtext);
        color: white;
        &.above{
            &::after{ border-top: 9.5px var(--normtext) solid;  }
        }
        &.below{
            &::after{ border-bottom: 9.5px var(--normtext) solid;  }
        }
    }
    &.actionable{
        background: var(--offwhitefg);
        padding: 30px;
        border: 1px solid var(--bordergrey);

        &.above{
            &::after{ border-top: 9.5px var(--normtext) solid;  }
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
    padding: 15px 20px;
    &.default{
        background: white;
        color: var(--normtext);
        border: 1px solid var(--fainttext);
    }
    &.dark{
        background: var(--normtext);
        color: white;
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
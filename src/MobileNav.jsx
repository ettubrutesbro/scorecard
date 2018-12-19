import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import IntersectionObserver from '@researchgate/react-intersection-observer'
import FlipMove from 'react-flip-move'

import indicators from './data/indicators'

import Icon from './components/generic/Icon'
import ExpandBox from './components/ExpandBox'

export default class MobileNav extends React.Component{
    render(){ 
        const props = this.props
        const {open, store} = props
        return(
            <FixWrap>
                <PickMenu
                    currentMode = {props.mode === 'bar'? 'closed' : props.mode === 'button'? 'open' : ''}
                    modes = {{
                        closed: {width: window.innerWidth+1, height: 1},
                        open: {width: window.innerWidth+1, height: 250}    
                    }}
                >
                    <FlipMove>
                        <div style = {{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '25px',
                            height: '50px'
                        }}>
                            What data do you want to see?
                        </div>
                        <div style = {{height: '50px', marginLeft: '-1px'}}>
                        <ExpandBox
                            currentMode = 'compact'
                            modes = {{compact: {width: window.innerWidth+1, height: 50}}}
                        >
                            <MenuSelectBlock left = 'County' right = 'California (all)' />
                        </ExpandBox>
                        </div>
                        <div style = {{height: '50px', marginLeft: '-1px'}}>
                        <ExpandBox
                            currentMode = 'compact'
                            modes = {{compact: {width: window.innerWidth+1, height: 50}}}
                        >
                            <MenuSelectBlock left = 'Race' right = 'All races' />
                        </ExpandBox>
                        </div>
                        <div style = {{height: '100px', marginLeft: '-1px'}}>
                        <ExpandBox
                            currentMode = 'compact'
                            modes = {{compact: {width: window.innerWidth+1, height: 100}}}
                        >
                            <MenuSelectBlock left = 'Indicator' right = 'Early prenatal care' multiline />
                        </ExpandBox>
                        </div>
                    </FlipMove>
                </PickMenu>
             <Header 
                currentMode = {props.mode}
                modes = {{
                    bar: {width: window.innerWidth, height: 55},
                    button: {width: 150, height: 55},
                    offscreen: {width: 150, height: 0} 
                }}
                backgroundColor = 'var(--offwhitebg)'
                borderColor = 'var(--offwhitebg)'
            >
                <HeaderContent
                >
                    <Prompt active = {props.mode==='bar'}>
                        <SearchIcon img = "searchzoom" color = 'white'/>
                        Refine or restart your search...
                    </Prompt>
                    <Shorthand active = {props.mode==='shorthand'}>
                        Shorthand bla bla
                    </Shorthand>
                    <Btn active = {props.mode==='button'}>
                        Back to view
                    </Btn>
                </HeaderContent>
            </Header>
            </FixWrap>
        )
    }
}

const MenuSelectBlock = (props) => {
    return(
    <MSB multiline = {props.multiline}>
        <MSBLabel multiline = {props.multiline}>{props.left}</MSBLabel>
        <MSBValue multiline = {props.multiline}><Val>{props.right}</Val><Caret /></MSBValue>
    </MSB>
    )
}
const MSB = styled.div`
    padding: 0 25px;
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center; justify-content: space-between;
    ${props => props.multiline? `
        align-items: flex-start;
        padding-top: 18px;
    ` : ''}
`
const MSBLabel = styled.div`
    font-size: 12px;
    flex-shrink: 0;
`
const MSBValue = styled.div`
    display: flex; align-items: center;
    font-size: 16px;
    color: var(--fainttext);
    margin-left: 25px; 
`
const Val = styled.div`
    flex-shrink: 1;
    white-space: normal;
    text-align: right;
    ${props => props.multiline? `
        margin-top: -4px;
        line-height: 23px;
    ` : ''}
`
const Caret = styled.div`
    margin-left: 13px; 
    width: 15px; height: 15px;
    border: 1px solid black;
    flex-shrink: 0;
`
const FixWrap = styled.div`
    position: fixed;
    top: 0px; left: 0px;
`
const WorkflowWrap = styled.div`
    border: 1px solid red;
    height: 83px;

` 
const PickMenu = styled(ExpandBox)`
    top: -1px; left: -2px;
    height: 83px;

`
const Header = styled(ExpandBox)`
    z-index: 2;
    top: 0; left: 0;
    transform: translate(${props=>props.currentMode==='button'? window.innerWidth - 150 + 'px,235px' : '0px,0px'});
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    &::before{
        content: '';
        position: absolute;
        left: -20px;
        height: 1px;
        top: 15px;
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
`
const HeaderSection = styled.div`
    position: absolute; top: 0; left: 0;
    display: flex; align-items: center;
    padding-left: 25px;
    // white-space: nowrap;
    height: 55px;
    transition: transform .35s;
    width: 100%;
`
const Prompt = styled(HeaderSection)`
    transform: translateY(${props => props.active? 0 : -100}%);
`
const Shorthand = styled(HeaderSection)`
    transform: translateY(${props => props.active? 0 : 100}%)
`
const Btn = styled(HeaderSection)`
    transform: translateY(${props => props.active? 0 : 100}%)
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

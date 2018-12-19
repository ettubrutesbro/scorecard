import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import IntersectionObserver from '@researchgate/react-intersection-observer'

import indicators from './data/indicators'

import Icon from './components/generic/Icon'
import ExpandBox from './components/ExpandBox'

@observer
export default class MobileNav extends React.Component{
	render(){ 
		const {open} = this.props
		return(
                <Header 
                    store = {store}
                    mode = {
                    	open === 'county' || open === 'indicator' || open === 'race'? 'offscreen' :
                    	open? 'button' : 'prompt'
                    } //shorthand, button, prompt, offscreen
                />
		)
	}
}


const Header = (props) => {
    return(
    	<Fixer>
        <HeaderExpandBox 
        	// mode = {props.mode}
        	currentMode = {props.mode==='prompt'?'bar': 'button'}
        	modes = {{
        		bar: {width: 300, height: 55},
        		button: {width: 150, height: 55} 
        	}}
        	borderColor = 'offwhitebg'
        >
        	<HeaderContent>
	        	<Prompt active = {props.mode==='prompt'}>
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
        </HeaderExpandBox>
        </Fixer>
    )
}
const HeaderContent = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	color: white;
	width: 100%;
`
const HeaderSection = styled.div`
	position: absolute; top: 0;
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
`

const HeaderExpandBox = styled(ExpandBox)`
	font-size: 14px;
	background: var(--offwhitebg);
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

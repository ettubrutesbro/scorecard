import React from 'react'
import styled from 'styled-components'

import ExpandBox from './ExpandBox'
import Icon from './generic/Icon'

const FixedActionsHelper = (props) =>{
    return(
        <Fah
            currentMode = {props.mode}
            modes = {{
                collapsed: {width: 48, height: 5},
                expanded: {width: 48, height: 100},
                xOnly: {width: 48, height: 48},
            }}
            borderColor = {props.mode === 'collapsed'? 'transparent' : 'var(--fainttext)'}
            backgroundColor = {props.mode === 'collapsed'? 'transparent' : 'white'}
            offsetFromTop = {props.offsetFromTop}
        >
            <Icons
                mode = {props.mode}
            >
                <Btn mode = {props.mode}
                    onClick = {props.onX}
                >
                    <XIcon img = "x_thin" color = 'normtext'/>
                </Btn>
                <Btn mode = {props.mode}
                    onClick = {props.onSearch}
                >
                    <SearchIcon img = "searchzoom" color = {props.mode==='searching'? 'fainttext' : 'normtext'}/>
                </Btn>

            </Icons>
        </Fah>
    )
}

const Fah = styled(ExpandBox)`
    position: absolute;
    right: 15px; top: 20px;
    transform: translate(0px, ${props => props.offsetFromTop}px);
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    z-index: 20;
`
const Icons = styled.div`
    position: absolute;
    top: 0; 
    width: 48px; height: 100px;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    transform: translateY(${props => props.mode==='searching'? -50 : props.mode==='xOnly'?-2:0}px);
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
`
const Btn = styled.div`
    height: 45px;
    display: flex;
    align-items: center;
    &:first-of-type{
        border-bottom: 1px solid ${props => props.mode==='xOnly'? 'transparent' : 'var(--bordergrey)'};
    }
`
const XIcon = styled(Icon)`
    width: 18px; height: 18px;
`
const SearchIcon = styled(Icon)`
    width: 18px; height: 18px;
`

export default FixedActionsHelper

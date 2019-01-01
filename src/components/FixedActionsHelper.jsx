import React from 'react'
import styled from 'styled-components'
import ExpandBox from './ExpandBox'
import Icon from './generic/Icon'

const FixedActionsHelper = (props) => {
    return(
        <Fah
            currentMode = {props.mode}
            modes = {{
                collapsed: {width: 5, height: 5},
                expanded: {width: 48, height: 100},
                xOnly: {width: 48, height: 48},
                searching: {width: 275, height: 48},
            }}
            borderColor = 'var(--fainttext)'
        >
            <Icons
                mode = {props.mode}
            >
                <Btn mode = {props.mode}><XIcon img = "x" color = 'normtext'/></Btn>
                <Btn mode = {props.mode}><SearchIcon img = "searchzoom" color = {props.mode==='searching'? 'fainttext' : 'normtext'}/></Btn>
                <SearchInput 
                    placeholder = 'Type to search...'
                />
            </Icons>
        </Fah>
    )
}

const Fah = styled(ExpandBox)`
    position: absolute;
    right: 20px; top: 20px;
    transform: translateX(${props => -props.modes[props.currentMode].width}px);
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
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
    width: 20px; height: 20px;
`
const SearchIcon = styled(Icon)`
    width: 20px; height: 20px;
`
const SearchInput = styled.input`
    position: absolute;
    letter-spacing: 0.5px;
    border: none;
    appearance: none; outline: none; background: none;
    bottom: 2px;
    height: 46px;
    left: 100%;
    font-size: 16px;
`

export default FixedActionsHelper
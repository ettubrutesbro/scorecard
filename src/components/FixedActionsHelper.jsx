import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import ExpandBox from './ExpandBox'
import Icon from './generic/Icon'

@observer
export default class FixedActionsHelper extends React.Component {
    @observable searchMaskOn = false
    constructor(){
        super()
        this.searchInput = React.createRef()
    }
    componentDidUpdate(prevProps){
        if(prevProps.mode !== this.props.mode){
            if(this.props.mode === 'searching'){
                this.searchInput.current.focus()
            }
            else{
                //clear search string..?
                this.searchInput.current.blur()
            }
        }
    }
    focusSearch = (tf) => {
        if(tf) this.searchMaskOn = true
        else this.searchMaskOn = false
    }
    render(){
        const props = this.props
        return(
            <React.Fragment>
            <Fah
                currentMode = {props.mode}
                modes = {{
                    collapsed: {width: 5, height: 5},
                    expanded: {width: 48, height: 100},
                    xOnly: {width: 48, height: 48},
                    searching: {width: 275, height: 48},
                }}
                borderColor = 'var(--fainttext)'
                backgroundColor = 'white'
            >
                <Icons
                    mode = {props.mode}
                >
                    <Btn mode = {props.mode}><XIcon img = "x" color = 'normtext'/></Btn>
                    <Btn mode = {props.mode}><SearchIcon img = "searchzoom" color = {props.mode==='searching'? 'fainttext' : 'normtext'}/></Btn>
                    <SearchInput 
                        ref = {this.searchInput}
                        placeholder = 'Type to search...'
                        onFocus = {()=> this.focusSearch(true)}
                        onBlur = {()=> this.focusSearch(false)}
                    />

                </Icons>
                
            </Fah>
            <MaskForSearch on = {this.searchMaskOn} />
            </React.Fragment>
        )
    }
}

const Fah = styled(ExpandBox)`
    position: absolute;
    right: 20px; top: 20px;
    transform: translateX(${props => -props.modes[props.currentMode].width}px);
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

const MaskForSearch = styled.div`
    position: absolute;
    left: 0; top: 0;
    width: 100%; height: 100%;
    background: red;
    display: ${props => props.on? 'block' : 'none'};
    z-index: 19;
    opacity: 0.25;
`

import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import makeHash from '../utilities/makeHash'
import {findDOMNode} from 'react-dom'

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
    outline: 1px solid ${props => props.selected? 'var(--strokepeach)':'var(--fainttext)'};
    z-index: ${props => props.selected? 1 : 0}
    font-size: 13px;
    letter-spacing: 0.5px;
    padding: 6px 15px;
    // &:first-of-type{
    //     // border-left: none;
    // }
    &:not(:first-of-type){
        // border-left: none;
        // transform: translateX(-1px);
        // outline-left-color: none;
    }
    color: ${props => props.selected? 'var(--strokepeach)' : props.disabled? 'var(--inactivegrey)' : 'var(--fainttext)'};
    background-color: ${props => props.selected? 'var(--faintpeach)' : props.disabled? 'var(--inactivegrey)' : 'white'};
    // background: ${props => props.disabled? '#f3f3f5' : 'white'};
    &:hover{
        // background: white;
        color: ${props => props.selected?'var(--strokepeach)':'var(--strokepeach)'};
        outline-color: var(--strokepeach);
        z-index: 1;
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
export default class Toggle extends React.Component {
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
        <ToggleBody>
            {this.props.options.map((option, i)=>{
                
                return <Option 
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
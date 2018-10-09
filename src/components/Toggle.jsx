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
    border: 1px solid ${props => props.selected? 'var(--strokepeach)':'var(--fainttext)'};
    z-index: ${props => props.selected? 1 : 0}
    font-size: ${props=> props.size === 'big'? '16px' : '13px'};
    letter-spacing: 0.5px;
    padding: ${props => props.size==='big'? '10px 20px' : '6px 15px'};
    // border-radius: ${props => props.firstLast==='first'? '4px 0 0 4px' : props.firstLast === 'last'? '0 4px 4px 0' : ''};
    color: ${props => props.selected? 'var(--strokepeach)' : props.disabled? 'var(--inactivegrey)' : 'var(--fainttext)'};
    background-color: ${props => props.selected? 'var(--faintpeach)' : props.disabled? 'var(--inactivegrey)' : 'white'};
    // background: ${props => props.disabled? '#f3f3f5' : 'white'};
    white-space: nowrap;
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
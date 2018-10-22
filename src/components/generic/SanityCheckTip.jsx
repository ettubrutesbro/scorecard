import React from 'react'
import {findDOMNode} from 'react-dom'
import styled, {keyframes} from 'styled-components'
import {Tooltip, Tip, Button} from './index'

import media, {getMedia} from '../../utilities/media'


export default class SanityCheckTip extends React.Component{
    constructor(){
        super()
        this.sanityCheck = React.createRef()
    }
    componentDidMount(){
        document.addEventListener('click', this.handleClick)
    }
    componentWillUnmount(){
        // console.log('unmounting sanitycheck')
        document.removeEventListener('click', this.handleClick)
    }
    handleClick = (e) => {
        // console.log(this.sanityCheck)
        console.log(e)
        console.log(e.nativeEvent)
        if(!findDOMNode(this.sanityCheck.current).contains(e.target)){
            // e.nativeEvent.stopImmediatePropagation()
            this.props.store.clearSanityCheck(this.props.checkType)

        }
    }

    render(){
        const {pos, store, direction, needsCentering, checkType, caretOffset, horizontalAnchor} = this.props
        const data = store.sanityCheck
        const screen = getMedia()
        return(
            <ModTip
                ref = {this.sanityCheck}
                pos = {{x: pos.x, y: pos.y}}
                direction = {direction}
                horizontalAnchor = {horizontalAnchor}
                duration = {'.35s'}
                className = 'actionable'
                needsCentering = {needsCentering}
                caretOffset = {caretOffset}
            >
            <Check>
                {data.message}
                <SanityControls>
                    <Button 
                        className = {screen==='compact'?'compact':''}
                        label = 'Nevermind, back to list' 
                        style = {{marginRight: '15px'}}
                        onClick = {(e)=>{

                            e.nativeEvent.stopImmediatePropagation()
                            store.clearSanityCheck(checkType)
                        }}
                    />
                    <Button 
                        label = 'Yes, continue' 
                        className = {`dark ${screen}`} 
                        onClick = {()=>{
                            data.action()
                            store.clearSanityCheck(checkType)
                        }}

                    />
                </SanityControls>
            </Check>
            </ModTip>
    )
    }
}

const ModTip = styled(Tip)`
    cursor: auto;
    margin-top: ${p=>p.direction==='above'?-20:20}px;
    // transform-origin: ${p=>p.direction==='above'?'50% 100%':'50% 0%'}; 

    transform-origin: ${p=>p.needsCentering? 50 : p.horizontalAnchor==='left'? 0 : 100}% ${p=>p.direction==='above'? 100: 0}%;
    &::after{
        left: calc(50% - 9.5px);
        ${p=>p.direction==='above'? 'bottom' : 'top'}: -19px;
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 9.5px solid transparent;
    }
    &::before{
        left: calc(50% - 10.5px);
        ${p=>p.direction==='above'? 'bottom' : 'top'}: -21.5px;
        position: absolute;
        content: '';
        width: 0; height: 0;
        border: 10.5px solid transparent;
    }
        &::before { border-${p => p.direction === 'above'? 'top' : 'bottom'}: 10.5px var(--bordergrey) solid; }
        &::after{ border-${p => p.direction === 'above'? 'top' : 'bottom'}: 9.5px var(--offwhitefg) solid;  }
        animation: ${
            p=> p.needsCentering && p.direction==='above'? tooltipaboveCenter
            : p.needsCentering ? tooltipanimCenter 
            : p.direction==='above'? tooltipabove 
            : tooltipanim

        } .3s forwards;
`       


const tooltipanim = keyframes`
    from {
        opacity: 0; 
        transform: scale(0.8) translateY(-60px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`
const tooltipabove = keyframes`
    from {
        opacity: 0; 
        transform: scale(0.8) translateY(-100%) translateY(60px);
    }
    to {
        opacity: 1;
        transform: translateY(-100%) translateY(0);
    }
`

const tooltipanimCenter = keyframes`
    from {
        opacity: 0; 
        transform: translate(-50%, -60px) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0) scale(1);
    }
`
const tooltipaboveCenter = keyframes`
    from {
        opacity: 0; 
        transform: translate(-50%,-100%) translateY(60px) scale(0.8) ;
    }
    to {
        opacity: 1;
        transform: translate(-50%,-100%) translateY(0) scale(1);
    }
`

const SanityControls = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const Check = styled.div`
    width: 480px;
    line-height: 180%;
    white-space: normal;
    @media ${media.optimal}{
        font-size: 16px;
        padding: 30px;
    }
    @media ${media.compact}{
        font-size: 13px;
        padding: 20px;
    }
`
import React from 'react'
import styled from 'styled-components'
import {Tooltip, Tip} from './index'

export default class SanityCheckTip extends React.Component{
    render(){
        const {pos, store, side} = props
        const data = store.sanityCheck
        const screen = getMedia()
        return(
            <ModTip
                pos = {{x: pos.x, y: pos.y}}
                direction = {side}
                horizontalAnchor = 'right'
                duration = {'.35s'}
                className = 'actionable'
            >
            <Check>
                {data.message}
                <SanityControls>
                    <Button 
                        className = {screen==='compact'?'compact':''}
                        label = 'Nevermind, back to list' 
                        style = {{marginRight: '15px'}}
                        onClick = {(e)=>{
                            store.clearSanityCheck('indicator')
                            e.nativeEvent.stopImmediatePropagation()
                        }}
                    />
                    <Button 
                        label = 'Yes, continue' 
                        className = {`dark ${screen}`} 
                        onClick = {()=>{
                            data.action()
                            store.clearSanityCheck('indicator')
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
    transform-origin: ${p=>p.direction==='above'?'50% 100%':'50% 0%'}; 
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
        animation: ${p=>p.direction==='above'? tooltipabove : tooltipanim} .3s forwards;
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

const SanityControls = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`

const Check = styled.div`
    width: 480px;
    line-height: 180%;
    @media ${media.optimal}{
        font-size: 16px;
        padding: 30px;
    }
    @media ${media.compact}{
        font-size: 13px;
        padding: 20px;
    }
`
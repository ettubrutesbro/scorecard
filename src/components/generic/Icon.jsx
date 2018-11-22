import React from 'react'
import styled, {keyframes} from 'styled-components'

import sprites from './spritemanifest'

const icons = {
    x: (<polygon points="33.1,6.1 29.8,2.8 17.9,14.5 6,2.8 2.7,6.1 14.4,18 2.7,29.9 6,33.2 17.9,21.5 29.8,33.2 33.1,29.9 21.4,18 "/>),
    chevright: <polygon points="22.8,18.4 10.6,30.6 11,30.6 13.2,30.6 25.4,18.4 13.1,5.4 10.6,5.4 "/>,
    chevleft: <polygon points="25.4,5.4 22.9,5.4 10.6,18.4 22.8,30.6 25,30.6 25.4,30.6 13.2,18.4 "/>,
    minigraph: <g>
        <rect x="5.2" y="7.1" width="2" height="21.7"/>
        <rect x="10.8" y="8.6" width="14.4" height="2"/>
        <rect x="10.8" y="25.5" width="9.5" height="2"/>
        <rect x="10.8" y="17" width="19" height="2.1"/>
    </g>,
    
}

const IconWrapper = styled.div`
    position: relative;
    fill: var(--${props => props.color});
    &:hover{
        fill: var(--${props => props.hoverColor || props.color});
    }
`

const IconSvg = styled.svg`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    /*transition: fill .25s;*/
`

const Icon = (props) => {

    const {img, ...restOfProps} = props

    return (
        <IconWrapper
            {...restOfProps}
        >
            <IconSvg
                viewBox = '0 0 36 36'
                className = {'icon-'+img} 
            >
                {icons[img]}
            </IconSvg>
        </IconWrapper>
    )
}

const SpriteWrapper = styled(IconWrapper)`
    display: inline-flex;
    /*outline: 1px solid red;*/
    width: 25px; height: 25px;
    overflow: hidden;
`
const SpriteSvg = styled(IconSvg)`
    width: auto;
    height: 100%;
    animation-duration: .35s;
    animation-fill-mode: forwards;
    animation-timing-function: steps(${props=>props.numFrames-1}, end);
    &.up{
        /*animation: spriteForward .08s steps(5) forwards;*/
        /*transform:translateX(${props=> (-100 * ((props.numFrames-1)/props.numFrames))}%);*/
        animation-name: ${props=> computeAnim(0, -100 * ((props.numFrames-1)/props.numFrames))};
       
    }
    &.down{
        animation-name: ${props=> computeAnim(-100 * ((props.numFrames-1)/props.numFrames), 0)};
    }
`

// const chevUp = keyframes`
//     from{ transform: translateX(0); }
//     to{ transform: translateX(-87.5%); }
// `
// const chevDown = keyframes`
//     from{ transform: translateX(-87.5%); }
//     to{ transform: translateX(0); }
// `
//     &.sprite-chevsprite{
//         &.up{
//             animation-name: ${chevUp};
//         }
//         &.down{
//             animation-name: ${chevDown};
//         }
//     }

const computeAnim = (from, goTo) => {
    let frames = `
        0%{
            transform: translateX(${from}%);
        }
        100%{
            transform: translateX(${goTo}%);
        }
    `

    return keyframes`${frames}`
}

export const Sprite = (props) =>{
    const {img, state, ...restOfProps} = props

    return (
        <SpriteWrapper
            {...restOfProps}
        >
            <SpriteSvg
                viewBox = {sprites[img].viewBox}
                className = {[
                    'sprite-'+img,
                    state
                ].join(' ')} 
                numFrames = {sprites[img].frames}
            >
                {sprites[img].paths}
            </SpriteSvg>
        </SpriteWrapper>
    )
}

export default Icon
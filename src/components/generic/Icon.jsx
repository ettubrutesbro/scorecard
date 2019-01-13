import React from 'react'
import styled, {keyframes} from 'styled-components'

import sprites from './spritemanifest'

const icons = {
    x: (<polygon points="33.1,6.1 29.8,2.8 17.9,14.5 6,2.8 2.7,6.1 14.4,18 2.7,29.9 6,33.2 17.9,21.5 29.8,33.2 33.1,29.9 21.4,18 "/>),
    x_thin: <polygon points="17.9,20.4 29.8,32.1 32,29.9 20.3,18 32,6.1 29.8,3.9 17.9,15.6 6,3.9 3.8,6.1 15.5,18 3.8,29.9 6,32.1 "/>,
    chevright: <polygon points="22.8,18.4 10.6,30.6 11,30.6 13.2,30.6 25.4,18.4 13.1,5.4 10.6,5.4 "/>,
    chevright_thin: <polygon points="11.5,4.2 12.7,4.2 25,18.4 12.8,31.8 10.6,31.8 11.5,31.8 23.7,18.4 "/>,
    chevleft: <polygon points="25.4,5.4 22.9,5.4 10.6,18.4 22.8,30.6 25,30.6 25.4,30.6 13.2,18.4 "/>,
    chevleft_thin: <polyline points="22.8,31.8 10.6,18.4 22.9,4.2 24.1,4.2 11.9,18.4 24.1,31.8 "/>,
    chevup: <polygon points="30.6,24.8 30.6,21.5 17.6,9.2 5.4,21.4 5.4,24.8 17.6,12.6 "/>,
    minigraph: <g>
        <rect x="5.2" y="7.1" width="2" height="21.7"/>
        <rect x="10.8" y="8.6" width="14.4" height="2"/>
        <rect x="10.8" y="25.5" width="9.5" height="2"/>
        <rect x="10.8" y="17" width="19" height="2.1"/>
    </g>,
    searchzoom: <path d="M32.5,29.2l-8.7-8.7c1.2-1.7,1.7-3.9,1.7-6c0.2-6-4.8-11-11-11c-6,0-11,5-11,11c0,6.2,5,11,11,11
    c2.1,0,4.3-0.6,6-1.7l8.7,8.7L32.5,29.2z M14.5,21.5c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7C21.5,18.4,18.4,21.5,14.5,21.5z"/>,
    reset: <path d="M34.1,3H23.3v10.7h2.3V6.6c3.7,2.5,5.9,6.6,5.9,11.2c-0.1,3.7-1.6,7.1-4.2,9.6c-2.6,2.6-6,4-9.6,3.9
    c-3.7-0.1-7.1-1.6-9.6-4.2c-2.6-2.6-4-6-3.9-9.5c0.1-6.4,4.7-12,11-13.3l0.5-0.1l-0.4-2.3L14.7,2C7.4,3.5,2,10,1.9,17.4
    c-0.1,4.1,1.6,8.2,4.6,11.3c2.9,3,7,4.8,11.2,4.9h0.3c4.2,0,8.1-1.6,11-4.6c3-2.9,4.8-7,4.9-11.2c0-4.9-2.2-9.5-5.9-12.5h6.3V3z"/>,
    ind: <g>
        <rect x="6" y="7.3" width="2" height="21.7"/>
        <path d="M11.5,8.8v3.5h14.4V8.8H11.5z M24.9,11.3H12.5V9.8h12.4V11.3z"/>
        <path d="M20,25.1v1.5h-7.5v-1.5H20 M21,24.1h-9.5v3.5H21V24.1L21,24.1z"/>
        <path d="M29.5,17.4v1.5h-17v-1.5H29.5 M30.5,16.4h-19v3.5h19V16.4L30.5,16.4z"/>
    </g>,
    check: <polygon points="29.5,7.5 14.9,24.7 8,17.1 4.6,17.1 14.9,28.5 31.4,9.2 "/>,
    getstartedarrow: <polygon points="24.8,10 23.6,11 28.2,16.2 6,16.2 6,17.8 28.2,17.8 23.6,23 24.8,24 31.1,17 "/>,

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
    width: ${props => props.width}px; height: ${props => props.height}px;
    overflow: hidden;
`
const SpriteSvg = styled(IconSvg)`
    width: auto;
    height: 100%;
    animation-duration: ${props => props.duration}s;
    animation-fill-mode: ${props => props.fillMode || 'forwards'};
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
    const {width, height, img, state, ...restOfProps} = props

    return (
        <SpriteWrapper
            width = {width || 25} height = {height || 25}
            {...restOfProps}
        >
            <SpriteSvg
                viewBox = {sprites[img].viewBox}
                className = {[
                    'sprite-'+img,
                    state
                ].join(' ')} 
                numFrames = {sprites[img].frames}
                duration = {props.duration || .35}
                fillMode = {props.fillMode}
            >
                {sprites[img].paths}
            </SpriteSvg>
        </SpriteWrapper>
    )
}

export default Icon
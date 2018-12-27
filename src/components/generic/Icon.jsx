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
    reset: <path class="st0" d="M26.8,4.3h5.6V2.9h-8.3V11h1.4V5.2c4.4,2.6,7.1,7.3,7.1,12.6c-0.1,3.9-1.7,7.6-4.5,10.3
    c-2.8,2.8-6.5,4.3-10.4,4.2c-3.9-0.1-7.6-1.7-10.3-4.5C4.6,25,3.1,21.3,3.2,17.5C3.3,9.4,10,2.9,18,2.9V1.5
    C9.2,1.5,1.9,8.7,1.8,17.4c-0.1,4.2,1.6,8.3,4.6,11.4c3,3.1,7.1,4.8,11.3,4.9c0.1,0,0.2,0,0.3,0c4.1,0,8.1-1.6,11.1-4.6
    c3.1-3,4.8-7.1,4.9-11.3C34,12.2,31.2,7.2,26.8,4.3z"/>
    
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
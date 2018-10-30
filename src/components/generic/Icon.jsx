import React from 'react'
import styled from 'styled-components'

const icons = {
    x: (<polygon points="33.1,6.1 29.8,2.8 17.9,14.5 6,2.8 2.7,6.1 14.4,18 2.7,29.9 6,33.2 17.9,21.5 29.8,33.2 33.1,29.9 21.4,18 "/>),

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
    transition: fill .25s;
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

export default Icon
import React from 'react'
import styled from 'styled-components'


import ExpandBox from './ExpandBox'
import InteractiveMap from './InteractiveMap'

const Container = styled.div`
    
    width: ${p => window.innerWidth}px;
    height: ${p => window.innerWidth * 1.15}px;
    transform: translateX(${p => p.zoom? 25 : 0}px);
    overflow: hidden;
    border: 1px solid red;

`

const ZoomableMap = (props) => {
    return(
        <Container
            currentMode = {props.zoom? 'countyZoom' : 'california'}
            modes = {{
                california: {width: window.innerWidth-50, height: (window.innerWidth - 50) * 1.15},
                countyZoom: {width: window.innerWidth-50, height: (window.innerWidth - 50) * 1.15}
            }}
            borderColor = {props.zoom? 'var(--bordergrey)' : 'red'}
        >
            <InteractiveMap 
                data = {props.data}
                store = {props.store}
                zoomable
                zoom = {props.zoom}
            />
        </Container>
    )
}

export default ZoomableMap
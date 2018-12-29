import React from 'react'
import styled from 'styled-components'


import ExpandBox from './ExpandBox'
import InteractiveMap from './InteractiveMap'


const ZoomableMap = (props) => {
    return(
        <ExpandBox
            currentMode = {props.zoom? 'countyZoom' : 'california'}
            modes = {{
                california: {width: window.innerWidth, height: window.innerWidth * 1.15},
                countyZoom: {width: window.innerWidth, height: window.innerWidth * 1.15}
            }}
            borderColor = {props.zoom? 'var(--bordergrey)' : 'red'}
        >
            <InteractiveMap 
                data = {props.data}
                store = {props.store}
                zoomable
                zoom = {props.zoom}
            />
        </ExpandBox>
    )
}

export default ZoomableMap
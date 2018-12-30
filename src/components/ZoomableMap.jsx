import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'


import ExpandBox from './ExpandBox'
import InteractiveMap from './InteractiveMap'

const Container = styled.div`
    position: absolute;
    left: 0;
    width: ${p => window.innerWidth}px;
    height: ${p => window.innerWidth * 1.15}px;
    transform: translateX(${p => p.zoom? 25 : 0}px);
    overflow: hidden;
    border: 1px solid red;

`

@observer
export default class ZoomableMap extends React.Component {
    calcDeviation = (zoomTo) => {
        const svgRect = this.containerRect
        const currentContainerRect = document.getElementById('svgMap').getBoundingClientRect()
        let countybox = document.getElementById(zoomTo).getBoundingClientRect()
        const adjustedLeft = countybox.left - ((this.zoomOrigin.x - svgRect.left))
        const adjustedTop  = countybox.top - ((this.zoomOrigin.y - svgRect.top))

        //target center calculated by finding local position relative to origin (topleft corner)
        //of container plus half its width and height
        const targetCtrX = (adjustedLeft + (countybox.width/2)) - svgRect.left
        const targetCtrY = (adjustedTop + ( countybox.height / 2)) - svgRect.top

        //find deviation from center of container?
        const containerCtrX = svgRect.left + (svgRect.width / 2)
        const containerCtrY = svgRect.top + (svgRect.height / 2)

        let deviationX = (containerCtrX - targetCtrX) * (this.zoomOrigin.x === 0 && this.zoomOrigin.y === 0? 2.28 : 1)
        let deviationY = (containerCtrY - targetCtrY) * (this.zoomOrigin.x === 0 && this.zoomOrigin.y === 0? 2.28 : 1)

        console.log(zoomTo, 's center of', containerCtrX, containerCtrY)
        console.log('deviates by', deviationX, deviationY)

        // console.log('target area:', (countybox.width * countybox.height).toFixed(1))
        // console.log('scale factor:', 2+ (9000-(countybox.width * countybox.height)) / 4500 )

        return {x: deviationX.toFixed(1), y: deviationY.toFixed(1)}
    }

    render(){
        const props = this.props
        return(
            <Container

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
}


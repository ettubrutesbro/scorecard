import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import ExpandBox from './ExpandBox'
import InteractiveMap from './InteractiveMap'


@observer
export default class ZoomableMap extends React.Component {

    @observable zoomLevel = .875
    @action setZoom = (val) => this.zoomLevel = val
    @observable containerTranslation = {x: 0, y: 0}
    @action translateContainer = (coords) => { 
        // console.log('translating container: ', coords)
        this.containerTranslation.x = coords.x
        this.containerTranslation.y = coords.y
    }

    componentDidMount(){
        if(this.props.zoomTo){
            console.log('map mounting with zoom:', this.props.zoomTo)
            this.translateContainer(this.calcTransform(this.props.zoomTo))
        }
        else{
            console.log('map mounting unzoomed')
        }
    }
    componentWillUpdate(newProps){
        if(newProps.zoomTo !== this.props.zoomTo){
            if(!newProps.zoomTo){
                console.log('map updated: unzooming')
                this.translateContainer(this.calcTransform())
            }
            else{
                console.log('map updated: zooming to', newProps.zoomTo)
                this.translateContainer(this.calcTransform(newProps.zoomTo))
            }
        }
    }

    calcTransform = (zoomTo) => {
        if(!zoomTo){
            this.setZoom(.875)
            return {x: 0, y:0}
        }

        const map = document.getElementById('svgMap').getBoundingClientRect()
        const county = document.getElementById(zoomTo).getBoundingClientRect()

        const countySize = ((county.width / this.zoomLevel) * (county.height / this.zoomLevel)) 
        const scaleAdjust = countySize < 2000? (4000 - (countySize*2)) / 2000: countySize > 9000? -.3 : 0

        const zoomLevel = 2 + scaleAdjust
        const zoomDifferential = (zoomLevel / this.zoomLevel).toFixed(1)

        const mapbox = {
            left: map.left * zoomDifferential, 
            top: map.top * zoomDifferential,
            width: map.width * zoomDifferential,
            height: map.height * zoomDifferential
        }
        const countybox = {
            left: county.left * zoomDifferential, 
            top: county.top * zoomDifferential,
            width: county.width * zoomDifferential,
            height: county.height * zoomDifferential
        }

        //relative
        const countyCenter = {
            x: (countybox.left + (countybox.width/2)),
            y: (countybox.top + (countybox.height/2))
        }
        const deviationFromContainerCenter = {
            x: (mapbox.left + (mapbox.width / 2)) - countyCenter.x, 
            y: (mapbox.top + (mapbox.height / 2)) - countyCenter.y, 
        }

        // console.log(zoomTo, 'deviates from ctr by', deviationFromContainerCenter)

        this.setZoom(zoomLevel)
        return {
            x: deviationFromContainerCenter.x,
            y: deviationFromContainerCenter.y
        }
    }

    render(){
        const props = this.props
        return(
            <Container>
                <TransformWrapper
                    offset = {this.containerTranslation} 
                    zoom = {this.zoomLevel}
                >
                    <InteractiveMap 
                        data = {props.data}
                        store = {props.store}
                        hoveredCounty = {props.zoomTo}
                        // selected = {props.zoomTo}
                    />
                </TransformWrapper>
            </Container>
        )
    }
}


const Container = styled.div`
    position: absolute;
    width: ${p => window.innerWidth}px;
    height: ${p => window.innerWidth * 1.15}px;
    overflow: hidden;
    border: 1px solid red;
`

const TransformWrapper = styled.div`
    position: absolute;
    width: ${p => window.innerWidth}px;
    height: ${p => window.innerWidth * 1.15}px;
    transform-origin: 50% 50%;
    transition: transform .5s;
    transform: translate(${props=> props.offset.x}px, ${props=>props.offset.y}px) scale(${props => props.zoom});
`
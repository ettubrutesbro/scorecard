import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'


import ExpandBox from './ExpandBox'
import InteractiveMap from './InteractiveMap'


@observer
export default class ZoomableMap extends React.Component {

    @observable zoomLevel = 1
    @action setZoom = (val) => this.zoomLevel = val
    @observable containerTranslation = {x: 0, y: 0}
    @action translateContainer = (coords) => { 
        // console.log('translating container: ', coords)
        this.containerTranslation.x = coords.x
        this.containerTranslation.y = coords.y
    }

    constructor(){
        super()
        this.container = React.createRef()
    }

    componentDidMount(){
        if(this.props.zoomTo){
            console.log('map mounting with zoom:', this.props.zoomTo)
            this.translateContainer(this.calcTransform(this.props.zoomTo))
            this.setZoom(2)
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
                this.setZoom(1)
            }
            else{
                console.log('map updated: zooming to', newProps.zoomTo)
                this.translateContainer(this.calcTransform(newProps.zoomTo))
                this.setZoom(2)
            }
        }
    }

    calcTransform = (zoomTo) => {
        if(!zoomTo){
            return {x: 0, y:0}
            console.log('fux')
        }
        //absolute screen coordinates
        //current offset/translations need to be accounted for...
        
        const map = document.getElementById('svgMap').getBoundingClientRect()
        // const mapbox = this.container.current.getBoundingClientRect()
        const county = document.getElementById(zoomTo).getBoundingClientRect()

        //todo: calc zoom level
        const zoomLevel = 2 
        const zoomDifferential = zoomLevel / this.zoomLevel
        console.log(zoomDifferential)

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

        console.log(zoomTo, 'deviates from ctr by', deviationFromContainerCenter)

        return {
            x: deviationFromContainerCenter.x,
            y: deviationFromContainerCenter.y
        }

//         const adjustedLeft = countybox.left - ((this.zoomOrigin.x - mapbox.left))
//         const adjustedTop  = countybox.top - ((this.zoomOrigin.y - mapbox.top))
// 
//         //target center calculated by finding local position relative to origin (topleft corner)
//         //of container plus half its width and height
//         const targetCtrX = (adjustedLeft + (countybox.width/2)) - mapbox.left
//         const targetCtrY = (adjustedTop + ( countybox.height / 2)) - mapbox.top
// 
//         //find deviation from center of container?
//         const containerCtrX = mapbox.left + (mapbox.width / 2)
//         const containerCtrY = mapbox.top + (mapbox.height / 2)
// 
//         let deviationX = (containerCtrX - targetCtrX) * (this.zoomOrigin.x === 0 && this.zoomOrigin.y === 0? 2.28 : 1)
//         let deviationY = (containerCtrY - targetCtrY) * (this.zoomOrigin.x === 0 && this.zoomOrigin.y === 0? 2.28 : 1)

        // console.log(zoomTo, 's center of', containerCtrX, containerCtrY)
        // console.log('deviates by', deviationX, deviationY)

        // console.log('target area:', (countybox.width * countybox.height).toFixed(1))
        // console.log('scale factor:', 2+ (9000-(countybox.width * countybox.height)) / 4500 )

        // return {x: deviationX.toFixed(1), y: deviationY.toFixed(1)}
    }

    render(){
        const props = this.props
        return(
            <Container
                ref = {this.container}
            >
                <TransformWrapper
                    offset = {this.containerTranslation} 
                    zoom = {this.zoomLevel}
                >
                    <InteractiveMap 
                        data = {props.data}
                        store = {props.store}
                    />
                </TransformWrapper>
            </Container>
        )
    }
}


const Container = styled.div`

    overflow: hidden;
    border: 1px solid red;

`

const TransformWrapper = styled.div`
    border: 1px solid green;
    width: ${p => window.innerWidth}px;
    height: ${p => window.innerWidth * 1.15}px;
    transform-origin: 50% 50%;
    transform: translate(${props=> props.offset.x}px, ${props=>props.offset.y}px) scale(${props => props.zoom});
`
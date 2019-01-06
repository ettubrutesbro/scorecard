import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import media from '../utilities/media'

import ExpandBox from './ExpandBox'
import InteractiveMap from './InteractiveMap'
import Legend from './Legend'

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
        console.log('going to zoomTo', zoomTo)
        if(!zoomTo){
            this.setZoom(.875)
            return {x: 0, y:0}
        }

        const map = document.getElementById('svgMap').getBoundingClientRect()
        const county = document.getElementById(zoomTo).getBoundingClientRect()

        const countySize = ((county.width / this.zoomLevel) * (county.height / this.zoomLevel)) 
        const scaleAdjust = countySize < 2000? (4000 - (countySize*2)) / 2000: countySize > 9000? -.3 : 0

        const zoomLevel = 1.5 + scaleAdjust
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

        this.setZoom(zoomLevel)
        console.log(deviationFromContainerCenter.y)
        return {
            x: deviationFromContainerCenter.x,
            y: deviationFromContainerCenter.y - ((window.innerWidth * .75) / 3) 
        }
    }

    render(){
        const props = this.props
        return(
            <Container 
                // zooming = {props.zoomTo}
                currentMode = {props.zoomTo? 'zoomed' : 'tall'}
                modes = {{
                    tall: {width: window.innerWidth, height: window.innerWidth * 1.15},
                    zoomed: {width: window.innerWidth, height: window.innerWidth * .75}
                }}
                // borderColor = 'red'
                duration = {.5}
                dontAlignContentsToCenter
                noSideBorders
            >
                <DotGrid />
                <LegendContainer 
                    currentMode = {!props.zoomTo? 'expanded' : 'collapsed'}
                    modes = {{collapsed: {width: 10, height: 10}, expanded: {width: 119, height: 140}}}
                    backgroundColor = 'var(--offwhitefg)'
                    duration = {.5}
                    offset = {!props.store.county && !props.zoomTo? '-109px, -8px' : !props.zoomTo? '-109px, 0' : '0, -50px'}
                >
                    <Legend 
                        store = {props.store}
                    />
                </LegendContainer>
                <TransformWrapper
                    offset = {this.containerTranslation} 
                    zoom = {this.zoomLevel}
                >
                    <InteractiveMap 
                        garbMask = {!props.zoomTo}
                        data = {props.data}
                        store = {props.store}
                        hoveredCounty = {props.zoomTo}
                        selected = {!props.zoomTo && props.store.county? props.store.county : ''}
                        onSelect = {(a,b)=>{
                            props.unforceCA()
                            props.store.completeWorkflow(a,b)
                        }}
                    />
                </TransformWrapper>
                <TipText>
                    {!props.zoomTo && !props.store.county && 
                        <React.Fragment>
                        Tap a county to <br />
                        view its demographics.
                        </React.Fragment>
                    }
                    {props.store.county && !props.zoomTo &&
                        <React.Fragment>
                        Select 'county' <br />
                        below to zoom back in.
                        </React.Fragment>
                    }
                    
                </TipText>
            </Container>
        )
    }
}


const Container = styled(ExpandBox)`
    position: absolute;
    left: -1px;
`
const dots = require('../assets/dots.png')
const DotGrid = styled.div`
    position: absolute;
    top: 0; left: 0;
    background-image: url(${dots});
    width: 100%;
    height: 100vh;
    background-size: 20px;
    background-position: 17px 17px;
`
const TransformWrapper = styled.div`
    position: absolute;
    width: ${p => window.innerWidth}px;
    height: ${p => window.innerWidth * 1.15}px;
    transform-origin: 50% 50%;
    transition: transform .5s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate(${props=> props.offset.x}px, ${props=>props.offset.y}px) scale(${props => props.zoom});
    z-index: 2;
`
const TipText = styled.div`
    display: none;
    position: absolute;
    color: var(--fainttext);
    font-size: 12px;
    letter-spacing: 0.5px;
    left: 37px; 
    bottom: 15px;
`

const LegendContainer = styled(ExpandBox)`
    position: absolute;
    top: 35px; right: 45px;
    transition: transform .5s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate(${props=>props.offset});
    
    @media ${media.smallphone}{
        right: 26px;
        top: 32px;
    }
    /*width: 120px;*/
    /*height: 140px;*/
    /*border: 1px solid var(--bordergrey);*/
`

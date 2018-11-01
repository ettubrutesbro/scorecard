
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

const Box = styled.div`
    position: absolute;
    top: 100px;
    left: 100px;
    box-sizing: content-box;
    outline: 3px solid red;
    transform-origin: 50% 0%;
    height: ${props => props.expandHeight}px;
    overflow: hidden; 
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: 1500ms;
    &.expand{
        opacity: 0.8;
        animation-name: ${p => computeAnim(p.expandHeight, p.collapseHeight)};
    }
    &.collapse{
        animation-name: ${p => computeAnim(p.expandHeight, p.collapseHeight, false, true)};
    }



`
const Content = styled.div`
    transform-origin: 50% 0%;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: 1500ms;
    &.expand{
        opacity: 0.8;
        animation-name: ${p => computeAnim(p.expandHeight, p.collapseHeight, true)};
    }

    &.collapse{
        animation-name: ${p => computeAnim(p.expandHeight, p.collapseHeight, true, true)};
    }
`

const computeAnim = (expHeight, colHeight, inv, collapse) => {
        const collapsedSize = colHeight
        const expandedSize = expHeight
        console.log(colHeight, expHeight)
        let y = collapsedSize / expandedSize 
        let frames = ''

        for(let step = 0; step<101; step++){
            let easedStep = ease(step/100)
            let yScale
            if(!collapse) yScale = y + (1 - y) * easedStep 
            else if(collapse) yScale = 1 + (y - 1) * easedStep
            if(inv) yScale = 1/yScale

            frames += `${step}% { 
                transform: scaleY(${yScale}); 
            } `
        }

        return keyframes`${frames}`
}

let expandAnim, expandContentAnim, collapseAnim, collapseContentAnim

@observer
export default class ExpandBox extends React.Component{

    @observable frames = ''
    @observable invFrames = ''
    @observable collapseFrames = ''
    @observable invCollapseFrames = ''

    defineKeyframes = () => {
        const collapsedSize = this.props.collapseHeight
        const expandedSize = this.props.expandHeight

        let y = collapsedSize / expandedSize 
        let frames = ''
        let inverseFrames = ''

        let collapseFrames = ''
        let invCollapseFrames = '' 

        for(let step = 0; step<100; step++){
            let easedStep = ease(step/100)
            const yScale = y + (1 - y) * easedStep 

            const yScale2 = 1 + (y - 1) * easedStep
            frames += `${step}% { 
                transform: scaleY(${yScale}); 
            } `
            collapseFrames += `${step}% { 
                transform: scaleY(${yScale2}); 
            } `
            const invYScale = 1 / yScale

            const invYScale2 = 1 / yScale2
            inverseFrames += `${step}% {
                 transform: scaleY(${invYScale});
            } `
            invCollapseFrames += `${step}% {
                 transform: scaleY(${invYScale2});
            } `
        }

        // expandAnim = keyframes`${frames}` 
        // expandContentAnim = keyframes`${inverseFrames}`
        // collapseAnim = keyframes`${inverseFrames}`
        // collapseContentAnim = keyframes`${invCollapseFrames}`
    }

    componentWillMount(){
        this.defineKeyframes()
    }

    render(){
        return(
            <Box 
                // expand = {this.props.expand}

                expandHeight = {this.props.expandHeight}
                collapseHeight = {this.props.collapseHeight}
                style = {this.props.style}
                className = {this.props.expand? 'expand' : 'collapse'}
            >
                <Content
                    className = {this.props.expand? 'expand' : 'collapse'}
                    expandHeight = {this.props.expandHeight}
                    collapseHeight = {this.props.collapseHeight}
                >
                    {this.props.children}
                </Content>
            </Box>
        )
    }
}

function ease (v, pow=4) {
  return 1 - Math.pow(1 - v, pow);
}
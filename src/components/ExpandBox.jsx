
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import {Scrollbars} from 'react-custom-scrollbars'

const Box = styled.div`
    width: 100%;
    position: absolute;
    border-left: 1px solid var(--bordergrey);
    border-right: 1px solid var(--bordergrey);
    transform-origin: 50% 0%;
    height: ${props => props.expandHeight}px;
    overflow: hidden;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: .5s;
    &.expand{
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
    animation-duration: .5s;
    &.expand{
        animation-name: ${p => computeAnim(p.expandHeight, p.collapseHeight, true)};
    }

    &.collapse{
        animation-name: ${p => computeAnim(p.expandHeight, p.collapseHeight, true, true)};
    }
`

const computeAnim = (expHeight, colHeight, inv, collapse) => {
        const collapsedSize = colHeight
        const expandedSize = expHeight
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

class ExpandBox extends React.Component {
    constructor(){
        super()
    }
    componentDidMount(){

    }
    render(){
    return(
        <Wrapper>
            <Header>
                {this.props.header}
            </Header>
            <FadeCropper show = {this.props.expand}/>
            <Box 
                expandHeight = {this.props.expandHeight}
                collapseHeight = {this.props.collapseHeight}
                style = {this.props.style}
                className = {this.props.expand? 'expand' : 'collapse'}
            >
                <Scrollbars style = {{width: '100%', height: 600}}>
                <Content
                    className = {this.props.expand? 'expand' : 'collapse'}
                    expandHeight = {this.props.expandHeight}
                    collapseHeight = {this.props.collapseHeight}
                >
                    {this.props.children}
                   
                </Content>

            </Scrollbars>
            </Box>
            <FadeCropperBottom show = {this.props.expand}/>
            <Footer
                className = {this.props.expand? 'expand' : 'collapse'}
                expandHeight = {this.props.expandHeight}
                collapseHeight = {this.props.collapseHeight}
            >
                {this.props.footer}
            </Footer>
        </Wrapper>
        )
    }
    
}


const Wrapper = styled.div`
    position: relative;
    /*width: 100px;*/
    width: 400px;
    width: 100%;
`
const Header = styled.div`
    z-index: 2;
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
    border-top: 1px solid var(--bordergrey);
`
const Footer = styled.div`
    z-index: 2;
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--bordergrey);
    transition: transform .5s cubic-bezier(0.215, 0.61, 0.355, 1);
    &.expand{
        transform: translateY(${props=>props.expandHeight}px);  
    }
    &.collapse{
        transform: translateY(${props=>props.collapseHeight}px);    
    }
`

const FadeCropper = styled.div`
    /*border: 1px solid red;*/
    z-index: 1;
    position: absolute;
    left: 1px;
    width: calc(100% - 2px);
    height: 40px;
    background: linear-gradient(var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);
    opacity: ${props => props.show? 1 : 0};
    transition: opacity .25s;
    /*border: 1px solid green;*/

`
const FadeCropperBottom = styled(FadeCropper)`
    top: auto;
    bottom: 0px;
    height: 30px;
    background: linear-gradient(to top, var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);
`
function ease (k) {
  // return 1 - Math.pow(1 - v, pow);
  return --k * k * k + 1;

}


export default ExpandBox
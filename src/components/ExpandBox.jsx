
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

const Box = styled.div`
    position: absolute;
    /*top: 100px;*/
    /*left: 100px;*/
    box-sizing: content-box;
    /*outline: 3px solid red;*/
    border-left: 1px solid var(--bordergrey);
    border-right: 1px solid var(--bordergrey);
    transform-origin: 50% 0%;
    height: ${props => props.expandHeight}px;
    overflow: hidden; 
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: .5s;
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
    animation-duration: .5s;
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

const ExpandBox = (props) => {
    return(
        <Wrapper>
            <Header>
                {props.header}
            </Header>
            <Box 
                expandHeight = {props.expandHeight}
                collapseHeight = {props.collapseHeight}
                style = {props.style}
                className = {props.expand? 'expand' : 'collapse'}
            >
                <Content
                    className = {props.expand? 'expand' : 'collapse'}
                    expandHeight = {props.expandHeight}
                    collapseHeight = {props.collapseHeight}
                >
                    {props.children}
                </Content>
            </Box>
            <Footer
                className = {props.expand? 'expand' : 'collapse'}
                expandHeight = {props.expandHeight}
                collapseHeight = {props.collapseHeight}
            >
                {props.footer}
            </Footer>
        </Wrapper>
        )
    
}


const Wrapper = styled.div`
    position: relative;
    width: 100px;
    margin-top: 50px;
    margin-left: 50px;
`
const Header = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
    border-top: 1px solid var(--bordergrey);
`
const Footer = styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid red;
    transition: transform .5s cubic-bezier(0.215, 0.61, 0.355, 1);
    &.expand{
        transform: translateY(${props=>props.expandHeight}px);  
    }
    &.collapse{
        transform: translateY(${props=>props.collapseHeight}px);    
    }
`

function ease (k) {
  // return 1 - Math.pow(1 - v, pow);
  return --k * k * k + 1;

}


export default ExpandBox
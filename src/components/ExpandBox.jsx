
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import {Scrollbars} from 'react-custom-scrollbars'

import {getMedia} from '../utilities/media'
import {capitalize} from '../utilities/toLowerCase'

const Box = styled.div`
    position: absolute;
    overflow: hidden;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: .35s;
`
const HeightBox = styled(Box)`
    width: 100%;
    height: ${props => props.expandHeight}px;
    transform-origin: 50% 0%;
    border-left: 1px solid var(--bordergrey);
    border-right: 1px solid var(--bordergrey);
    &.expand{ animation-name: ${p => computeAnim('y', p.expandHeight, p.collapseHeight)}; }
    &.collapse{ animation-name: ${p => computeAnim('y', p.expandHeight, p.collapseHeight, false, true)}; }
`


const Content = styled.div`
    transform-origin: 50% 0%;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: .35s;
    
`
const HeightContent = styled(Content)`
    &.expand{animation-name: ${p => computeAnim('y', p.expandHeight, p.collapseHeight, true)};}
    &.collapse{animation-name: ${p => computeAnim('y', p.expandHeight, p.collapseHeight, true, true)};}
`


const computeAnim = (xOrY, exp, col, inv, collapse) => {
        const collapsedSize = col
        const expandedSize = exp
        let ratio = collapsedSize / expandedSize 
        let frames = ''

        for(let step = 0; step<101; step++){
            let easedStep = ease(step/100)
            let scale
            if(!collapse) scale = ratio + (1 - ratio) * easedStep 
            else if(collapse) scale = 1 + (ratio - 1) * easedStep
            if(inv) scale = 1/scale

            frames += `${step}% { 
                transform: scale${capitalize(xOrY)}(${scale}); 
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
            <FadeCropper show = {props.expand && props.withScroll}/>
            <HeightBox 
                expandHeight = {props.expandHeight}
                collapseHeight = {props.collapseHeight}
                style = {props.style}
                className = {props.expand? 'expand' : 'collapse'}
            >
                <Scrollbars 
                    style = {{width: '100%', height: props.expand && props.withScroll? props.expandHeight : 1000}}
                >
                <HeightContent
                    className = {props.expand? 'expand' : 'collapse'}
                    expandHeight = {props.expandHeight}
                    collapseHeight = {props.collapseHeight}
                >
                    {props.children}
                   
                </HeightContent>

            </Scrollbars>
            </HeightBox>
            <FadeCropperBottom 
                show = {props.expand && props.withScroll}
                offset = {props.expandHeight}
            />
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
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
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
    height: 20px;
    background: linear-gradient(var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);
    opacity: ${props => props.show? 1 : 0};
    transition: opacity .25s;
    /*border: 1px solid green;*/

`
const FadeCropperBottom = styled(FadeCropper)`
    top: ${props => props.offset - 25}px;
    height: 25px;
    background: linear-gradient(to top, var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);
`
function ease (k) {
  // return 1 - Math.pow(1 - v, pow);
  return --k * k * k + 1;

}

@observer
export class ExpandWidthBox extends React.Component{
    @observable contentHeight = 0
    @action setContentHeight = (val) => this.contentHeight = val
    constructor(){
        super()
        this.content = React.createRef()
    }
    componentDidMount(){
        this.setContentHeight(this.content.current.offsetHeight)
    }
    render(){
    return(
        <WidthWrapper
            expandWidth = {this.props.expandWidth}
            height = {this.contentHeight}
        >
            <WidthBox
                expandWidth = {this.props.expandWidth}
                collapseWidth = {this.props.collapseWidth}
                style = {this.props.style}
                className = {this.props.expand? 'expand' : 'collapse'}
            >
                <WidthContent
                    ref = {this.content}
                    className = {this.props.expand? 'expand' : 'collapse'}
                    expandWidth = {this.props.expandWidth}
                    collapseWidth = {this.props.collapseWidth}
                >
                    {this.props.children}
                </WidthContent>
            </WidthBox>  
            <LeftBound
                className = {this.props.expand? 'expand' : 'collapse'}
                expandWidth = {this.props.expandWidth}
                collapseWidth = {this.props.collapseWidth}
             />
            <RightBound
            />
        </WidthWrapper>
    )
    }
}


const WidthWrapper = styled.div`
    position: absolute;
    width: ${props => props.expandWidth}px;
    /*border: 1px blue solid;*/
    height: ${props => props.height}px;
`
const WidthBox = styled(Box)`
    height: auto;
    width: ${props => props.expandWidth}px;
    transform-origin: 100% 0%;
    border-left: none; border-right: none;
    border-top: 1px solid var(--bordergrey);
    border-bottom: 1px solid var(--bordergrey);
    &.expand{ animation-name: ${p => computeAnim('x', p.expandWidth, p.collapseWidth)}; }
    &.collapse{ animation-name: ${p => computeAnim('x', p.expandWidth, p.collapseWidth, false, true)}; }
`
const WidthContent = styled(Content)`
/*border: 1px solid green;*/
    &.expand{animation-name: ${p => computeAnim('x', p.expandWidth, p.collapseWidth, true)};}
    &.collapse{animation-name: ${p => computeAnim('x', p.expandWidth, p.collapseWidth, true, true)};}
`
const LeftBound = styled.div`
    top: 0;
    position: absolute;
    right: 0;
    height: 100%;
    width: 0;
    border-right: 1px solid red;
    
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    &.expand{
        transform: translateX(-${props=>props.expandWidth}px);
    }
    &.collapse{

        transform: translateX(-${props=>props.collapseWidth}px);
    }
`
const RightBound = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 0;
    border-left: 1px solid var(--bordergrey);
`

export default ExpandBox
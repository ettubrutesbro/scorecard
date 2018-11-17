import React from 'react'
import {findDOMNode} from 'react-dom'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {keyframes} from 'styled-components'

import {Scrollbars} from 'react-custom-scrollbars'

const Box = styled.div`
    position: absolute;
    overflow: hidden;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: .35s;
    transform-origin: 0% 0%;
    /*border: 3px solid green;*/
    width: ${props => props.current.width}px;
    height: ${props => props.current.height}px;
    animation-name: ${props => props.animFrames};
    top: 0;
    left: 0;
`

const Content = styled.div`
    transform-origin: 0% 0%;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
    animation-duration: .35s;

    animation-name: ${props => props.animFrames};

`

const computeAnim = (goTo, startFrom, invert) => {
        const ratioX =  goTo.width / startFrom.width
        const ratioY = goTo.height / startFrom.height 
        let frames = ''

        for(let step = 0; step<101; step++){
            let easedStep = ease(step/100)
            let scaleX, scaleY

            scaleX = (ratioX + (1 - ratioX) * easedStep )
            scaleY = (ratioY + (1 - ratioY) * easedStep )

            if(invert){
                scaleX = 1/scaleX
                scaleY = 1/scaleY
                if(step===3){
                    console.log(frames)
                }
             }

            frames += `${step}% { 
                transform: scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}); 
            } `
        }
        return keyframes`${frames}`
}

function ease (k) {
  return --k * k * k + 1;
}

const ScrollbarWrap = ({withScroll, wrap, children}) => withScroll? wrap(children) : children

@observer
export default class ExpandTest extends React.Component{
    //from prop obj modes, turn each set of width/height into an animation...
    //calc the animations on the fly when prop 'mode' changes?
    @observable default = this.props.modes[Object.keys(this.props.modes)[0]]
    @observable current = this.props.modes[Object.keys(this.props.modes)[0]]
    @observable goTo = this.props.modes[Object.keys(this.props.modes)[0]]
    
    @action setDims = (which, dims) => {
        this[which].width = dims.width
        this[which].height = dims.height
    }

    constructor(props){
        super(props)
        if(props.withScroll) this.scrollbar = React.createRef()
    }

    componentWillUpdate(newProps){
        if(newProps.currentMode !== this.props.currentMode){
            console.log('setting mode to', newProps.currentMode, {...this.props.modes[newProps.currentMode]})
            this.setDims('goTo', this.props.modes[newProps.currentMode])
            if(this.props.withScroll){
                findDOMNode(this.scrollbar.current).firstChild.scrollTop = 0
            }
        }
    }

    render(){
        const scaleX = this.goTo.width / this.default.width 
        const scaleY = this.goTo.height / this.default.height
        return(
            <Wrapper
                default = {this.default}
            >
                {this.props.header &&
                    <Header>
                        {this.props.header}
                    </Header>
                }
                <Box
                    current = {this.goTo}
                    animFrames = {computeAnim(this.current, this.goTo)}
                    onAnimationEnd = {()=>{
                        this.setDims('current', this.goTo)    
                    }}
                >
                    <ScrollbarWrap
                        withScroll = {this.props.withScroll}
                        wrap = {children => <Scrollbars ref = {this.scrollbar} style = {{width: '100%'}}> {children}</Scrollbars>}
                    >
                        <Content
                            animFrames = {computeAnim(this.current, this.goTo, true)}
                        >
                            {this.props.children}
                        </Content>
                    </ScrollbarWrap>
                </Box>
                <Top scale = {scaleX} current = {this.goTo}/>
                <Bottom scale = {scaleX} current = {this.goTo} offset = {this.goTo.height}/>
                <Left scale = {scaleY} current = {this.goTo}/>
                <Right scale = {scaleY} current = {this.goTo} offset = {this.goTo.width}/>
                
                {this.props.footer &&
                    <Footer
                        offset = {this.goTo.height}
                    >
                        {this.props.footer}
                    </Footer>
                }
            </Wrapper>
        )

    }
}

const Wrapper = styled.div`
    /*position: relative; */
    position: absolute;
    width: ${props => props.default.width + 2}px;
    height: ${props => props.default.height + 2}px;
    border: 1px solid transparent;
`

const Bound = styled.div`
    position: absolute;
    border-color: var(--bordergrey);
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform-origin: 0% 0%;
`

const Top = styled(Bound)`
    width: 100%;
    border-top: 1px solid var(--bordergrey);
    top: 0;
    transform: scaleX(${props=>props.scale});
`
const Bottom = styled(Bound)`
    border-bottom: 1px solid var(--bordergrey);
    width: 100%;
    top: 0;
    transform: translateY(${props=>props.offset}px) scaleX(${props=>props.scale});
`
const Left = styled(Bound)`
    border-left: 1px solid var(--bordergrey);
    height: 100%;
    left: 0;
    transform: scaleY(${props=>props.scale});
`
const Right = styled(Bound)`
    border-right: 1px solid var(--bordergrey);
    height: 100%;
    left: 0;
    transform: translateX(${props=>props.offset}px) scaleY(${props=>props.scale});
`

const Header = styled.div`
    z-index: 2;
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
`
const Footer = styled.div`
    z-index: 2;
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(${props=>props.offset}px);

`
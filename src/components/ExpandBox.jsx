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
    animation-fill-mode: both;
    animation-duration: ${props=>props.duration}s;
    transform-origin: 0% 0%;
    /*border: 3px solid green;*/
    width: ${props => props.current.width}px;
    height: ${props => props.current.height}px;
    animation-name: ${props => props.animFrames};

    animation-delay: ${props=>props.delay};
    top: 0;
    left: 0;
    transition: background-color .35s;
`

const Content = styled.div`
    transform-origin: 0% 0%;
    animation-timing-function: step-end;
    animation-fill-mode: both;
    animation-duration: ${props=>props.duration}s;

    animation-name: ${props => props.animFrames};
    animation-delay: ${props=>props.delay};
    display: flex;
    align-items: ${props => props.dontAlignContentsToCenter? 'normal' : 'center'};
    white-space: nowrap;
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
             }

            frames += `${step}% { 
                transform: scale(${scaleX.toFixed(5)}, ${scaleY.toFixed(5)}); 
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
    @observable default = this.props.defaultAsString? this.props.modes[this.props.defaultAsString] : this.props.modes[Object.keys(this.props.modes)[0]]
    @observable current = this.props.modes[Object.keys(this.props.modes)[0]]
    @observable goTo = this.props.modes[this.props.currentMode]
    
    @action setDims = (which, dims) => {
        this[which].width = dims.width
        this[which].height = dims.height
    }
    forceScrollToTop = () => {
        //method to be called from outside to force scroll to top
        findDOMNode(this.scrollbar.current).firstChild.scrollTop = 0
    }
    constructor(props){
        super(props)
        if(props.withScroll) this.scrollbar = React.createRef()
    }
    componentDidMount(){
        // const default = this.default
        // const current = this.props.modes[this.props.currentMode]
        // if(default.height !== current.height || default.width !== current.width){
        //     
        // }
    }
    componentWillUpdate(newProps){
        if(newProps.currentMode !== this.props.currentMode){
            console.log('setting mode to', newProps.currentMode, {...this.props.modes[newProps.currentMode]})
            this.setDims('goTo', newProps.modes[newProps.currentMode])
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
                className = {this.props.className}
                default = {this.default}
            >
                {this.props.header &&
                    <Header>
                        {this.props.header}
                    </Header>
                }
                {this.props.withScroll && !this.props.noFade &&
                    <FadeCropper 
                        id = 'fadecropper'
                        width = {Math.max(...Object.keys(this.props.modes).map((mode)=>{return this.props.modes[mode].width}))}
                        // a hack...
                        show = {this.props.currentMode.toLowerCase().includes('expanded')} 
                        // width = {1000}
                    />
                }
                <Box
                    current = {this.goTo}
                    animFrames = {computeAnim(this.current, this.goTo)}
                    onAnimationEnd = {()=>{
                        this.setDims('current', this.goTo)    
                    }}
                    duration = {this.props.duration}
                    delay = {this.props.delay}
                    style = {{
                        backgroundColor: this.props.backgroundColor || 'transparent'
                    }}
                >
                    <ScrollbarWrap
                        withScroll = {this.props.withScroll}
                        wrap = {children => 
                            <Scrollbars 
                                id = 'scrollbar'
                                ref = {this.scrollbar} 
                                style = {{
                                    width: '100%',
                                    //expanded exception hack II
                                    height: !this.props.currentMode.includes('expanded') && this.props.withScroll? this.props.modes[this.props.currentMode].height
                                    : '100%'
                                }}
                                renderTrackVertical = {
                                    (props) => <div {...props} style = {
                                        this.props.hideScroll? {display: 'none'} : {position: 'absolute', width: '6px', right: '2px', bottom: '2px', top: '2px', borderRadius: '0px'}} 
                                        className = 'track-vertical' 
                                    />

                                }
                                renderTrackHorizontal = {props => <div {...props} style = {{display: 'none'}} className = 'track-horizontal' />}
                                onScrollFrame = {this.props.onScroll? (e)=>this.props.onScroll(e) : ()=>{} }
                            > 
                                {children}
                            </Scrollbars>
                        }
                    >
                        <Content
                            animFrames = {computeAnim(this.current, this.goTo, true)}
                            duration = {this.props.duration}
                            delay = {this.props.delay}
                            dontAlignContentsToCenter = {this.props.dontAlignContentsToCenter}
                        >
                            {this.props.children}
                        </Content>
                    </ScrollbarWrap>
                </Box>
                {this.props.withScroll && !this.props.noFade &&
                    <FadeCropperBottom
                        width = {Math.max(...Object.keys(this.props.modes).map((mode)=>{return this.props.modes[mode].width}))}
                        // width = {this.props.modes.expanded.width}
                        // expanded exception hack.III
                        show = {this.props.currentMode.toLowerCase().includes('expanded')}
                        offset = {this.goTo.height}
                    />
                }
                {!this.props.noBorderTop &&
                    <Top delay = {this.props.delay} duration = {this.props.duration} borderColor = {this.props.borderColor} scale = {scaleX} current = {this.goTo}/>
                }
                <Bottom delay = {this.props.delay} duration = {this.props.duration} borderColor = {this.props.borderColor} scale = {scaleX} current = {this.goTo} offset = {this.goTo.height}/>
                {!this.props.noSideBorders &&
                    <React.Fragment>
                        <Left delay = {this.props.delay} duration = {this.props.duration} borderColor = {this.props.borderColor} scale = {scaleY} current = {this.goTo}/>
                        <Right delay = {this.props.delay} duration = {this.props.duration} borderColor = {this.props.borderColor} scale = {scaleY} current = {this.goTo} offset = {this.goTo.width}/>
                    </React.Fragment>
                }
                {this.props.footer &&
                    <Footer
                        offset = {this.goTo.height}
                        duration = {this.props.duration}
                    >
                        {this.props.footer}
                    </Footer>
                }
            </Wrapper>
        )

    }
}

ExpandTest.defaultProps = {
    duration: .35,
    delay: 0,
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
    transition: transform ${props=>props.duration}s cubic-bezier(0.215, 0.61, 0.355, 1), border-color .25s;
    transition-delay: ${props=>props.delay};
    transform-origin: 0% 0%;
    z-index: 2;
`

const Top = styled(Bound)`
    width: 100%;
    border-top: 1px solid ${props=>props.borderColor || 'var(--bordergrey)'};
    top: 0;
    transform: scaleX(${props=>props.scale});
`
const Bottom = styled(Bound)`
    border-bottom: 1px solid ${props=>props.borderColor || 'var(--bordergrey)'};
    width: 100%;
    top: 0;
    transform: translateY(${props=>props.offset}px) scaleX(${props=>props.scale});
`
const Left = styled(Bound)`
    border-left: 1px solid ${props=>props.borderColor || 'var(--bordergrey)'};
    height: 100%;
    left: 0;
    transform: scaleY(${props=>props.scale});
`
const Right = styled(Bound)`
    border-right: 1px solid ${props=>props.borderColor || 'var(--bordergrey)'};
    height: 100%;
    left: 0;
    transform: translateX(${props=>props.offset}px) scaleY(${props=>props.scale});
`

const Header = styled.div`
    z-index: 3;
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
`
const Footer = styled.div`
    z-index: 3;
    position: absolute;
    width: 100%;
    top: 0;
    height: 0;
    display: flex;
    align-items: center;
    transition: transform ${props=>props.duration}s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(${props=>props.offset}px);

`

const FadeCropper = styled.div`
    /*border: 1px solid red;*/
    z-index: 1;
    position: absolute;
    left: 1px;
    width: ${props=>props.width}px;
    height: 45px;
    background: linear-gradient(var(--offwhitefg) 30%, rgba(252,253,255,0) 80%);
    opacity: ${props => props.show? 1 : 0};
    transition: opacity .25s;
    /*border: 1px solid green;*/

`
const FadeCropperBottom = styled(FadeCropper)`
    top: ${props => props.offset - 45}px;
    height: 45px;
    background: linear-gradient(to top, var(--offwhitefg) 30%, rgba(252,253,255,0) 80%);
`

import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import media, {getMedia} from '../utilities/media'

import ExpandBox from './ExpandBox'

import {find, findIndex} from 'lodash'
import FlipMove from 'react-flip-move'


const Wrapper = styled.div`
    position: relative;
    width: 100%;
    border: 1px solid var(--bordergrey);
`

const WrappedGraphComponent = (props) => {
    const {noFade, header, footer, modes, duration, delay, currentMode, fullHeight, withScroll, hideScroll, borderColor, ...restOfProps} = props
    return props.expandable?(
        <ExpandBox 
            currentMode = {currentMode}
            modes = {modes}
            duration = {duration}
            delay = {delay}

            borderColor = {borderColor}
            noFade = {noFade}
            header = {header}
            footer = {footer}
            expand = {fullHeight}
            withScroll = {withScroll}
            hideScroll = {hideScroll}
            collapseHeight = {props.collapseHeight}
            expandHeight = {props.expandHeight}
        >
            <HorizontalBarGraph {...restOfProps} noFade = {noFade}/>
        </ExpandBox>
    ):(
        <Wrapper>
            <Header>{props.header}</Header>
            <HorizontalBarGraph {...restOfProps} />
        </Wrapper>
    )
}

const Header = styled.div`
    position: absolute;
    margin: 0 20px;
    display: inline-flex;
    padding: 0 15px;
    background: var(--offwhitefg);
    z-index: 3;
    transform: translateY(-50%);
`

@observer class HorizontalBarGraph extends React.Component{

    @observable width = 400
    @observable contentHeight = 300
    // @observable hoveredRow = null
    @observable expanded = false

    @action handleHoverRow = (row) => {
        // if(this.props.selectable) this.hoveredRow = row
        const screen = getMedia()
        if(this.props.onHoverRow && screen !== 'mobile') this.props.onHoverRow(row)
    }

    @action expandGraph = () => {
        this.expanded = !this.expanded
        if(this.props.onClickGraph) this.props.onClickGraph()
    }

    constructor(props){
        super(props)
        this.graph = React.createRef()
    }

    componentDidMount(){
        this.setGraphDimensions()
        window.addEventListener('resize', this.setGraphDimensions)
    }
    @action
    setGraphDimensions = () => {
        if(!this.graph) return
        if(!this.graph.current) return
        this.width = findDOMNode(this.graph.current).offsetWidth 
        // this.contentHeight = findDOMNode(this.graph.current).offsetHeight 
        // console.log(this.contentHeight)
    }

    render(){
        const {selectBar} = this.props
        // console.log(selectBar)
        const screen = getMedia()
        const labelLineOffset = screen === 'mobile'? 65 : 75
        return (

            <GraphTable
                ref = {this.graph}
                onClick = {this.props.expandable? this.expandGraph : ()=>{}}
                expanded = {this.expanded}
                hideGraph = {this.props.hideGraph}
            >
                <Content beefyPadding = {this.props.beefyPadding}>
                <FlipMove
                    duration = {175}
                    // staggerDurationBy = {5}
                    // typeName = {null}
                    enterAnimation = 'fade'
                    leaveAnimation = 'fade'
                    // disableAllAnimations = {this.props.disableAnim || this.expanded}
                >
                    {this.props.bars.map((item,i,bars)=>{
                        const invalidValue = item.value !==0 && (!item.value || item.value==='*')
                        const condensed = item.condensed
                        return(
                            <Row 
                                key = {i}
                                condensed = {condensed}
                                onClick = {selectBar?()=>{selectBar(item.id)}: ()=>{} }
                                onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                onMouseLeave = {()=>{this.handleHoverRow(null)}}
                                hovered = {item.id === this.props.hovered}
                                hoverable = {item.hoverable}
                            >
                                
                                    <Label 
                                        selected = {item.id === this.props.selected}
                                        labelWidth = {this.props.labelWidth} 
                                        invalid = {invalidValue}
                                        hovered = {item.id === this.props.hovered}
                                        onMouseEnter = {item.hoverable? ()=>{this.handleHoverRow(item.id)}: ()=>{}}
                                        onMouseLeave = {item.hoverable? ()=>{this.handleHoverRow(null)}: ()=>{}}
                                        hasLeftLabel = {item.leftLabel}
                                    >
                                        {item.leftLabel && 
                                            <LeftLabel
                                                hovered = {item.id === this.props.hovered}
                                                selected = {item.id === this.props.selected}
                                            >
                                                {!condensed && item.leftLabel}

                                            </LeftLabel>
                                        }
                                        {!condensed && item.label && typeof item.label === 'string' &&
                                            item.label
                                        }
                                        {!condensed && item.label && typeof item.label !== 'string' &&                                            React.cloneElement(
                                                item.label, 
                                                Object.assign(
                                                    {hovered: item.id===this.props.hovered},
                                                    item.label.props
                                                )
                                            )
                                        }
                                        
                                    </Label>
                                
                                {!invalidValue &&
                                    <React.Fragment>
                                        <Bar
                                            condensed = {condensed}
                                            hovered = {item.id === this.props.hovered}
                                            selected = {item.id === this.props.selected}
                                            percentage = {item.value}
                                            height = {100/bars.length} 
                                            fill = {item.fill || ''}
                                            onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                            onMouseLeave = {()=>{this.handleHoverRow(null)}}
                                        >
                                        </Bar>
                                        
                                        {!condensed && 
                                        <Value
                                            percentage = {item.value}
                                            muted = {i!==0}
                                            hovered = {item.id === this.props.hovered}
                                            selected = {item.id === this.props.selected}
                                            alignValue = {this.props.alignValue}
                                            offset = {this.props.labelWidth + (((this.width-labelLineOffset) - this.props.labelWidth) * (item.value/100) ) }
                                        >
                                            {item.trueValue && item.trueValue}
                                            {!item.trueValue && item.value.toFixed(2).replace(/[.,]00$/, "")}
                                            {!item.trueValue && <Pct>%</Pct>}
                                            
                                        </Value>
                                        }
                                    </React.Fragment>
                                }
                                {invalidValue && !item.value && 
                                    <Invalid> No data </Invalid>
                                }
                                {invalidValue && item.value==='*' &&
                                    <Invalid> 
                                        {!this.props.noFade && 'Data too small or unstable'} 
                                        {this.props.noFade && 'Small/unstable'} 
                                    </Invalid>
                                }
                            </Row>
                        )
                    })}
                </FlipMove>
                    {this.props.average &&
                        <AverageLine 
                            labelWidth = {this.props.labelWidth}
                            // offset = {0}
                            side = {this.props.average>65?'left':'right'}
                            muted = {this.props.hovered}
                            offset = {(this.props.average/100)*(this.width-this.props.labelWidth-labelLineOffset)}
                        >
                            <AverageLabel side = {this.props.average>65?'left':'right'}>
                             CA Avg 
                             {/*<AverageValue>{this.props.average}%</AverageValue>*/}
                             </AverageLabel>
                        </AverageLine>
                    }
                </Content>

            </GraphTable>

        )
    }
}

const Pct = styled.span`
    margin-left: 1px;
`

const GraphTable = styled.div`
    /*position: absolute;*/
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    letter-spacing: 0.5px;
    font-size: 13px;
    @media ${media.mobile}{
        font-size: 12px;
    }
    transition: border-color .25s, background-color .25s, box-shadow .25s, opacity .45s;
    overflow: hidden;
    position: absolute;
    top: 0;
    @media ${media.optimal}{
        width: 610px;
    }
    @media ${media.compact}{
        width: 480px;
    }
    opacity: ${props => props.hideGraph? 0 : 1};
    pointer-events: ${props => props.hideGraph? 'none' : 'auto'};
`

const CropBox = styled.div`
    position: absolute;
    margin: 0 20px;
    display: inline-flex;
    padding: 0 15px;
    background: var(--offwhitefg);
    z-index: 3;
`

const Content = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 36px 0px 25px;
    margin: ${props => props.beefyPadding?'42px 0 32px 0' : '25px 0 18px 0'};
    @media ${media.mobile}{
        padding: 0 30px 0px 20px;
    }
    transition: transform .25s;
    // transform: ${props => props.offset? 'translateY(-20px)' : ''};
`

const Label = styled.div`
    position: relative;
    display: inline-flex;
    width: ${props => props.labelWidth}px;
    align-items: center;
    flex-shrink: 0;
    justify-content: ${props => props.hasLeftLabel? 'space-between' : 'flex-end'};
    padding-right: 20px;
    @media ${media.mobile}{
        padding-right: 6px;
    }
    // border: 1px solid black;
    color: ${props => props.selected||props.hovered? "var(--strokepeach)" :props.invalid? "var(--fainttext)" : "var(--normtext)"};
    white-space: nowrap;


`
const LeftLabel = styled.div`
    color: ${props => props.selected||props.hovered? "var(--strokepeach)" : "var(--fainttext)"};

`
const Invalid = styled.span`
    color: var(--fainttext);
`
const Rank = styled.span`
    margin-right: 5px;
    color: var(--fainttext);
`
class Row extends React.Component{
    render(){
        const {children, ...restOfProps} = this.props
        return( <RowComponent {...restOfProps}> {children} </RowComponent>)
    }
}
const RowComponent = styled.div`
    cursor: ${props=>props.hoverable? 'pointer' : 'auto'};
    position: relative;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    margin-top: 3px;
    @media ${media.mobile}{
        margin-top: 5.5px;
        height: 18px;
    }
`
const AverageLine = styled.div`
    position: absolute;
    bottom: 20px;
    left: ${props => props.labelWidth + 20}px;

    width: 1px;
    background-color: var(--fainttext);
    height: calc(100% - 52px);
    @media ${media.mobile}{
        left: ${props => props.labelWidth + 15}px;
        height: calc(100% - 56px);
        bottom: 25px;
    }
    box-shadow: -1.5px 0 0 0 var(--offwhitefg);
    /*border-left: 1.5px solid var(--offwhitefg);*/
    /*border-right: 1px solid var(--normtext);*/
    z-index: 2;
    // margin-left: calc(${props=>props.percentage}% - 200px);
    transition: transform .5s, border-color .15s;
    transform: translateX(${props=>props.offset}px);
    // opacity: ${props=>props.muted?0.5:1};

    &::before{  
        content: '';
        position: absolute;
        width: 15px;
        height: 1px;
        border-bottom: 1px var(--fainttext) solid;
        top: -1px;
        transform-origin: 0%;
        transform: scaleX(${props=>props.side==='left'?-1:1});
        /*transition: transform .5s;*/
        /*left: -10px;*/
    }
    &::after{
        content: '';
        position: absolute;
        white-space: nowrap;
        /*width: 0;*/
        border-top: 1px var(--fainttext) solid;
        width: 25px;
        height: 1px;
        transform: translateX(-50%);
        bottom: -1px;
        text-align: center;
    }
`
const AverageLabel = styled.div`
    white-space: nowrap;
    position: absolute;
    display: inline-flex;
    justify-content: ${props=>props.side==='left'? 'flex-end' : 'flex-start'};
    top: -10px;
    @media ${media.mobile}{
        top: -6px;
    }
    transform: translateX(${props=>props.side==='left'?-100:0}%);
    /*transition: transform .5s;*/
    padding: 0 23px;
    color: var(--fainttext);

`
const AverageValue = styled.span`   
    margin-left: 5px;
    color: var(--normtext);
`
const Bar = styled.div`
    position: relative;
    width: 100%;
    height: ${props => props.condensed? '6px' : '13px'};
    transform-origin: 0% 0%;
    transition: transform .25s, background-color ${props=>props.selected? 0 : .25}s;
    transform: scaleX(${props=> props.percentage/100});

    background: ${props => props.selected? 'var(--peach)': props.condensed? 'var(--inactivegrey)': props.fill? props.fill : 'green'};
    /*border-right-color: transparent;*/
    border: 1.5px solid ${props=>props.hovered? 'var(--peach)' : 'transparent'};
    border-left-width: ${props=> (150/props.percentage).toFixed(3)}px;
    border-right-width: ${props=> (150/props.percentage).toFixed(3)}px;

`
const Value = styled.div`
    color: ${props => props.hovered||props.selected?'var(--strokepeach)': props.muted? 'var(--fainttext)' : 'var(--normtext)'};
    letter-spacing: 0.5px;
    position: absolute;
    // right: 0;
    ${props => props.alignValue==='outside'? css`left: 0;` : css`right: 0;` }
    transition: transform .25s;
    transform: translateX(${props => props.alignValue === 'outside'? props.offset : -props.offset}px);
    margin-left: ${props => props.percentage===0? 0 : 5}px;
    @media ${media.mobile}{
        margin-left: ${props => props.percentage===0? 0 : 3}px;
    }
`

HorizontalBarGraph.defaultProps = {
    header: 'Needs header',
    alignValue: 'outside' //outside or inside
}


export default WrappedGraphComponent
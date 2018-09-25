
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'
import FlipMove from 'react-flip-move'

import {floatingCorner, flushHard} from './BoxStyling'

@observer
export default class HorizontalBarGraph extends React.Component{

    @observable width = 400
    @observable hoveredGraph = false
    @observable hoveredRow = null
    @observable expanded = false

    @action handleHoverGraph = (v) => {if(this.props.expandable) this.hoveredGraph = v}
    @action handleHoverContents = (tf) => {if(this.props.expandable) this.hoveredGraph = tf? false : true }
    @action handleHoverRow = (row) => {if(this.props.selectable) this.hoveredRow = row}

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

    setGraphDimensions = () => {
        if(!this.graph) return
        if(!this.graph.current) return
        this.width = findDOMNode(this.graph.current).offsetWidth 
    }

    render(){
        const {selectBar} = this.props
        // console.log(selectBar)
        return (
            <GraphTable
                innerRef = {this.graph}
                onMouseEnter = {()=>this.handleHoverGraph(true)}
                onMouseLeave = {()=>this.handleHoverGraph(false)}
                hovered = {this.hoveredGraph&&!this.expanded}
                onClick = {this.props.expandable? this.expandGraph : ()=>{}}
                expanded = {this.expanded}
            >
                <Header expanded = {this.expanded}>
                    {!this.expanded && this.props.header}
                    {this.expanded && this.props.expandedHeader}
                    {this.expanded && this.props.expandedSubHeader && 
                        <Subheader>{this.props.expandedSubHeader}</Subheader>
                    }
                </Header>
                <Content
                    offset = {this.hoveredGraph&&!this.expanded}
                    onMouseEnter = {()=>this.handleHoverContents(true)}
                    onMouseLeave = {()=>this.handleHoverContents(false)}
                >
                <FlipMove
                    duration = {250}
                    typeName = {null}
                    enterAnimation = {null}
                    leaveAnimation = {null}
                    disableAllAnimations = {this.props.disableAnim || this.expanded}
                >
                    {this.props.bars.map((item,i,bars)=>{
                        const invalidValue = item.value !==0 && (!item.value || item.value==='*')
                        const condensed = item.condensed
                        return(
                            <Row 
                                key = {i}
                                condensed = {condensed}
                                onClick = {selectBar?()=>{selectBar('county',item)}: ()=>{} }
                                // onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                // onMouseLeave = {()=>{this.handleHoverRow(null)}}
                                hovered = {item.id === this.hoveredRow}
                            >
                                
                                    <Label 
                                        selected = {item.id === this.props.selected}
                                        labelWidth = {this.props.labelWidth} 
                                        invalid = {invalidValue}
                                        hovered = {item.id === this.hoveredRow}
                                        onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                        onMouseLeave = {()=>{this.handleHoverRow(null)}}
                                    >
                                        <LeftLabel
                                            hovered = {item.id === this.hoveredRow}
                                        >
                                            {!condensed && item.leftLabel}

                                        </LeftLabel>
                                        {!condensed && item.label}
                                    </Label>
                                
                                {!invalidValue &&
                                    <React.Fragment>
                                        <Bar
                                            condensed = {condensed}
                                            selected = {item.id === this.props.selected}
                                            hovered = {item.id === this.hoveredRow}
                                            percentage = {item.value}
                                            height = {100/bars.length} 
                                            fill = {item.fill || ''}
                                            onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                            onMouseLeave = {()=>{this.handleHoverRow(null)}}
                                        >

                                        <EndHatch
                                            scaleX = {100 / item.value}
                                            selected = {item.id === this.props.selected}
                                            // offset = {this.props.labelWidth}
                                            // offset = {this.props.labelWidth + (((this.width-60) - this.props.labelWidth) * (item.value/100)) }
                                        />
                                        </Bar>
                                        {!condensed && 
                                        <Value
                                            hovered = {item.id === this.hoveredRow}
                                            alignValue = {this.props.alignValue}
                                            offset = {this.props.alignValue === 'outside'? this.props.labelWidth + (((this.width-60) - this.props.labelWidth) * (item.value/100) ) 
                                                : ((100-item.value)/100) * (this.width-this.props.labelWidth)}
                                        >
                                            {item.trueValue && item.trueValue}
                                            {!item.trueValue && item.value.toFixed(2).replace(/[.,]00$/, "")+'%'}
                                            
                                        </Value>
                                        }
                                    </React.Fragment>
                                }
                                {invalidValue && 
                                    <Invalid> N/A </Invalid>
                                }
                            </Row>
                        )
                    })}
                </FlipMove>
                                {this.props.average &&
                    <AverageLine 
                        labelWidth = {this.props.labelWidth}
                        // offset = {0}
                        muted = {this.hoveredRow}
                        offset = {(this.props.average/100)*(this.width-this.props.labelWidth-60)}
                    >
                        <AverageLabel> CA Avg: <AverageValue>{this.props.average}%</AverageValue></AverageLabel>
                    </AverageLine>
                }
                </Content>

                {this.props.graphHoverPrompt &&
                    <Prompt visible = {this.hoveredGraph&&!this.expanded}>
                        {this.props.graphHoverPrompt}
                    </Prompt>
                }
            </GraphTable>
        )
    }
}

const GraphTable = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    /*width: 100%;*/
    /*max-width: 480px;*/
    ${flushHard}
    /*border-radius: 12px;*/
    /*box-shadow: ${props => props.hovered || props.expanded? 'var(--highlightshadow)' : 'var(--shadow)'};*/
    letter-spacing: 0.5px;
    font-size: 13px;
    /*border: 1px solid;*/
    transition: border-color .25s, background-color .25s, box-shadow .25s;
    // border-color: ${props => props.hovered? 'var(--peach)' : 'transparent'};
    // background-color: ${props => props.hovered? 'white' : 'var(--offwhitefg)'};
    cursor: pointer;
    overflow: hidden;
`
const Header = styled.div`
    width: 100%;
    // color: ${props=>props.expanded?'var(--normtext)' : 'var(--fainttext)'};
    // margin: ${props=>props.expanded? '20px 0 20px 20px' : '20px 0 10px 20px'};
    // 
    // font-size: ${props=>props.expanded? '16px' : '13px'};
    color: var(--normtext);
    margin: 20px 0 10px 20px;
    font-size: 16px;
    transition: transform .25s, opacity .25s;
`
const Subheader = styled.div`
    font-size: 13px;
    color: var(--fainttext);
    margin-top: 5px;

`
const Content = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 20px 0px 20px;
    margin-bottom: 20px;
    transition: transform .25s;
    // transform: ${props => props.offset? 'translateY(-20px)' : ''};
`

const Label = styled.div`
    display: inline-flex;
    width: ${props => props.labelWidth}px;
    align-items: center;
    flex-shrink: 0;
    justify-content: flex-end;
    // justify-content: space-between;
    padding-right: 10px;
    // border: 1px solid black;
    color: ${props => props.selected||props.hovered? "var(--strokepeach)" :props.invalid? "var(--fainttext)" : "var(--normtext)"};
    white-space: nowrap;
`
const LeftLabel = styled.div`
    font-weight: bold;
    // font-weight: 500;
    // border: 1px solid red;
    color: ${props => props.selected||props.hovered? "var(--strokepeach)" : "var(--fainttext)"};

`
const Invalid = styled.span`
    color: var(--fainttext);
`
const Rank = styled.span`
    margin-right: 5px;
    color: var(--fainttext);
`
const Row = styled.div`
    cursor: pointer;
    position: relative;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    margin-top: 5px;
    /*height: 100%;*/
    // padding: 0px 20px;
    background: ${props=>props.hovered? 'var(--faintpeach)': ''};
`
const AverageLine = styled.div`
    position: absolute;
    bottom: -5px;
    left: ${props => props.labelWidth + 19}px;
    width: 0px;
    height: calc(100% + 5px);
    border-left: 1px dashed ${props=>props.muted?'transparent':'var(--offwhitefg)'};
    border-right: 1px dashed ${props=>props.muted?'rgba(0,0,0,0.25)':'var(--normtext)'};
    z-index: 2;
    // margin-left: calc(${props=>props.percentage}% - 200px);
    transition: transform .5s, border-color .15s;
    transform: translateX(${props=>props.offset}px);
    // opacity: ${props=>props.muted?0.5:1};

    &::before{  
        content: '';
        position: absolute;
        width: 20px;
        height: 1px;
        border-bottom: 1px var(--fainttext) solid;
        top: -1px;
        left: -10px;
    }
    &::after{
        content: '';
        position: absolute;
        white-space: nowrap;
        /*width: 0;*/
        border-top: 1px var(--fainttext) solid;
        width: 20px;
        height: 1px;
        transform: translateX(-50%);
        bottom: -1px;
        text-align: center;
    }
`
const AverageLabel = styled.div`
    width: 100%;
    white-space: nowrap;
    position: absolute;
    // border: 1px solid black;
    display: inline-flex;
    justify-content: center;
    top: -20px;
    // color: var(--normtext);
    color: var(--fainttext);

`
const AverageValue = styled.span`   
    margin-left: 5px;
    color: var(--normtext);
`
const Bar = styled.div`
    position: relative;
    width: 100%;
    height: ${props => props.condensed? '6px' : '15.5px'};
    transform-origin: 0% 0%;
    transition: transform .25s;
    transform: scaleX(${props=> props.percentage/100});
    //TODO: selection handling
    background: ${props => props.selected? 'var(--peach)': props.condensed? 'var(--inactivegrey)': props.fill? props.fill : 'green'};
    // border: ${props => props.condensed? '' : props.selected? '1px solid var(--strokepeach)' : '1px solid var(--strokepurple)'};
    border-right-color: transparent;
`
const EndHatch = styled.div`
    position: absolute;
    right: 0px;
    transform: scaleX(${props => props.scaleX});
    /*border-left: 1px solid ${props => props.selected? 'var(--strokepeach)' : 'var(--strokepurple)'};*/
    height: 100%;
`
const Value = styled.div`
    color: ${props => props.hovered?'var(--strokepeach)':'var(--normtext)'};
    letter-spacing: 0.5px;
    position: absolute;
    // right: 0;
    ${props => props.alignValue==='outside'? css`left: 0;` : css`right: 0;` }
    transform: translateX(${props => props.alignValue === 'outside'? props.offset : -props.offset}px);
    margin-left: 8px;
`
const Prompt = styled.div`
    position: absolute;
    width: 100%;
    font-size: 13px;
    // color: var(--strokepeach);
    // font-weight: bold;
    // letter-spacing: 0.1px;
    text-align: center;
    bottom: 0;
    padding: 45px 0 10px 0;
    // border-top: 1px solid red;
    color: var(--normtext);
    transition: transform .25s, opacity .25s;
    transform: ${props => props.visible? 'translateY(0px)' : 'translateY(20px)'};
    opacity: ${props => props.visible? 1 : 0};
    background: linear-gradient(0deg, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 100%)
`

HorizontalBarGraph.defaultProps = {
    header: 'Needs header',
    alignValue: 'outside' //outside or inside
}
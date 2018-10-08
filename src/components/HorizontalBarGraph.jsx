
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
    @observable hoveredRow = null
    @observable expanded = false

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
                ref = {this.graph}
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
                <Content>
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
                                onClick = {selectBar?()=>{selectBar(item.id)}: ()=>{} }
                                onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                onMouseLeave = {()=>{this.handleHoverRow(null)}}
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
                                            hovered = {item.id === this.hoveredRow}
                                            alignValue = {this.props.alignValue}
                                            offset = {this.props.labelWidth + (((this.width-75) - this.props.labelWidth) * (item.value/100) ) }
                                        >
                                            {item.trueValue && item.trueValue}
                                            {!item.trueValue && item.value.toFixed(2).replace(/[.,]00$/, "")}
                                            {i===0 && !item.trueValue && <Pct>%</Pct>}
                                            
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
                            side = {this.props.average>65?'left':'right'}
                            muted = {this.hoveredRow}
                            offset = {(this.props.average/100)*(this.width-this.props.labelWidth-77)}
                        >
                            <AverageLabel side = {this.props.average>65?'left':'right'}> CA Avg: <AverageValue>{this.props.average}%</AverageValue></AverageLabel>
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
    position: relative;
    display: flex;
    flex-wrap: wrap;
    ${flushHard}
    letter-spacing: 0.5px;
    font-size: 13px;
    transition: border-color .25s, background-color .25s, box-shadow .25s;
   
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
    padding: 0 36px 0px 20px;
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
class Row extends React.Component{
    render(){
        const {children, ...restOfProps} = this.props
        return( <RowComponent {...restOfProps}> {children} </RowComponent>)
    }
}
const RowComponent = styled.div`
    cursor: pointer;
    position: relative;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    margin-top: 5px;
`
const AverageLine = styled.div`
    position: absolute;
    bottom: -12px;
    left: ${props => props.labelWidth + 19}px;
    width: 1px;
    background-color: var(--fainttext);
    height: calc(100% + 24px);
    box-shadow: -1px 0 0 0 var(--offwhitefg);
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
    height: ${props => props.condensed? '6px' : '15.5px'};
    transform-origin: 0% 0%;
    transition: transform .25s, background-color .25s;
    transform: scaleX(${props=> props.percentage/100});

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
    color: ${props => props.hovered?'var(--strokepeach)': props.muted? 'var(--fainttext)' : 'var(--normtext)'};
    letter-spacing: 0.5px;
    position: absolute;
    // right: 0;
    ${props => props.alignValue==='outside'? css`left: 0;` : css`right: 0;` }
    transition: transform .25s;
    transform: translateX(${props => props.alignValue === 'outside'? props.offset : -props.offset}px);
    margin-left: ${props => props.percentage===0? 0 : 5}px;
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
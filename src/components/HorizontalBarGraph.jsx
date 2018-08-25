
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'
import FlipMove from 'react-flip-move'

@observer
export default class HorizontalBarGraph extends React.Component{

    @observable width = 400
    @observable hoveredGraph = false
    @observable hoveredRow = null
    @observable expanded = false

    @action handleHoverGraph = (v) => {this.hoveredGraph = v}
    @action handleHoverContents = (tf) => this.hoveredGraph = tf? false : true 
    @action handleHoverRow = (row) => this.hoveredRow = row

    @action expandGraph = () => {
        this.expanded = !this.expanded
        if(this.props.onClickGraph) this.props.onClickGraph()
    }

    componentDidMount(){
        this.setGraphDimensions()
        window.addEventListener('resize', this.setGraphDimensions)
    }

    setGraphDimensions = () => {
        this.width = findDOMNode(this.graph).offsetWidth 
    }

    render(){
        const {selectBar} = this.props
        console.log(selectBar)
        return (
            <GraphTable
                ref = {(graph)=>{this.graph=graph}}
                onMouseEnter = {()=>this.handleHoverGraph(true)}
                onMouseLeave = {()=>this.handleHoverGraph(false)}
                hovered = {this.hoveredGraph&&!this.expanded}
                onClick = {this.props.expandable? this.expandGraph : ()=>{}}
            >
                <Header offset = {this.hoveredGraph&&!this.expanded}>
                    {this.props.header} {this.selectedIndex}
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
                    disableAllAnimations = {this.props.disableAnim}
                >
                    {this.props.bars.map((item,i,bars)=>{
                        const invalidValue = item.value !==0 && (!item.value || item.value==='*')
                        const condensed = item.condensed
                        return(
                            <Row key = {item.label+'bar'}
                                condensed = {condensed}
                                onClick = {selectBar?()=>{selectBar('county',item)}:console.log(item) }
                                onMouseEnter = {()=>{this.handleHoverRow(item.id)}}
                                onMouseLeave = {()=>{this.handleHoverRow(null)}}
                                hovered = {item.id === this.hoveredRow}
                            >
                                
                                    <Label 
                                        selected = {item.id === this.props.selected}
                                        labelWidth = {this.props.labelWidth} 
                                        invalid = {invalidValue}
                                        hovered = {item.id === this.hoveredRow}
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
                                        />
                                        <EndHatch
                                            selected = {item.id === this.props.selected}
                                            offset = {this.props.labelWidth + (((this.width-40) - this.props.labelWidth) * (item.value/100)) }
                                        />
                                        {!condensed && 
                                        <Value
                                            hovered = {item.id === this.hoveredRow}
                                            alignValue = {this.props.alignValue}
                                            offset = {this.props.alignValue === 'outside'? this.props.labelWidth + (((this.width-40) - this.props.labelWidth) * (item.value/100) ) 
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
                </Content>
                {this.props.average &&
                    <AverageLine 
                        labelWidth = {this.props.labelWidth}
                        offset = {(this.props.average/100)*(this.width-this.props.labelWidth)}
                    />
                }
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
    max-width: 480px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    letter-spacing: 0.5px;
    font-size: 13px;
    border: 1px solid;
    transition: border-color .25s, background-color .25s;
    border-color: ${props => props.hovered? 'var(--peach)' : 'transparent'};
    background-color: ${props => props.hovered? 'var(--faintpeach)' : 'var(--offwhitefg)'};
    cursor: pointer;
`
const Header = styled.div`
    width: 100%;
    color: var(--fainttext);
    margin: 20px 0 5px 20px;
    // font-weight: bold;
    transition: transform .25s, opacity .25s;
    opacity: ${props => props.offset? 0 : 1};
    transform: ${props => props.offset? 'translateY(-15px)' : ''};

`
const Content = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 20px 0px 20px;
    margin-bottom: 20px;
    transition: transform .25s;
    transform: ${props => props.offset? 'translateY(-25px)' : ''};
`

const Label = styled.div`
    display: inline-flex;
    width: ${props => props.labelWidth}px;
    align-items: center;
    flex-shrink: 0;
    // justify-content: flex-end;
    justify-content: space-between;
    padding-right: 10px;
    // border: 1px solid black;
    color: ${props => props.selected||props.hovered? "var(--strokepeach)" :props.invalid? "var(--fainttext)" : "var(--fainttext)"};

`
const LeftLabel = styled.div`
    font-weight: bold;
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
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
    /*height: 100%;*/
    // padding: 0px 20px;
    background: ${props=>props.hovered? 'var(--faintpeach)': ''};
`
const AverageLine = styled.div`
    position: absolute;
    bottom: -10px;
    left: ${props => props.labelWidth}px;
    width: 0px;
    height: calc(100%);
    border-right: 1px solid black;
    z-index: 2;
    // margin-left: calc(${props=>props.percentage}% - 200px);
    transition: transform .5s;
    transform: translateX(${props=>props.offset}px);
    &::before{  
        content: '';
        position: absolute;
        width: 25px;
        height: 1px;
        border-bottom: 1px black solid;
        top: -1px;
        left: -12px;
    }
    &::after{
        content: '';
        position: absolute;
        white-space: nowrap;
        /*width: 0;*/
        border-top: 1px black solid;
        width: 25px;
        height: 1px;
        transform: translateX(-50%);
        bottom: -1px;
        text-align: center;
    }
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
    border: ${props => props.condensed? '' : props.selected? '1px solid var(--strokepeach)' : '1px solid var(--strokepurple)'};
    border-right-color: transparent;
`
const EndHatch = styled.div`
    position: absolute;
    left: -2px;
    transform: translateX(${props => props.offset}px);
    border-left: 1px solid ${props => props.selected? 'var(--strokepeach)' : 'var(--strokepurple)'};
    height: 100%;
`
const Value = styled.div`
    color: ${props => props.hovered?'var(--strokepeach)':'var(--fainttext)'};
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
    color: var(--strokepeach);
    font-weight: bold;
    // letter-spacing: 0.1px;
    text-align: center;
    bottom: 0;
    padding: 10px;
    transition: transform .25s, opacity .25s;
    transform: ${props => props.visible? 'translateY(0px)' : 'translateY(10px)'};
    opacity: ${props => props.visible? 1 : 0};
`

HorizontalBarGraph.defaultProps = {
    header: 'Needs header',
    alignValue: 'outside' //outside or inside
}
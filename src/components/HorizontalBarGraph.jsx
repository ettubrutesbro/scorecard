
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'
import FlipMove from 'react-flip-move'

@observer
export default class HorizontalBarGraph extends React.Component{

    @observable width = 400
    @observable selectedIndex = null

    componentDidMount(){
        this.setGraphDimensions()
        window.addEventListener('resize', this.setGraphDimensions)
    }

    setGraphDimensions = () => {
        this.width = findDOMNode(this.graph).offsetWidth 
    }

    render(){
        return (
            <GraphTable
                ref = {(graph)=>{this.graph=graph}}
            >
                <Header>
                    {this.props.header}
                </Header>
                <FlipMove
                    duration = {250}
                    typeName = {null}
                    enterAnimation = {null}
                    leaveAnimation = {null}
                >
                    {this.props.bars.map((item,i,bars)=>{
                        const invalidValue = item.value !==0 && (!item.value || item.value==='*')

                        return(
                            <Row key = {item.label+'bar'}>
                                <Label 
                                    labelWidth = {this.props.labelWidth} 
                                    invalid = {invalidValue}
                                >
                                    {item.label}
                                </Label>
                                {!invalidValue &&
                                <Bar
                                    selected = {i === this.props.selected}
                                    percentage = {item.value}
                                    height = {100/bars.length} 
                                    fill = {item.fill || ''}
                                />
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
                        offset = {(this.props.average/100)*(this.width-this.props.labelWidth)}
                    />
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
    max-width: 800px;
`
const Header = styled.div`
    width: 100%;
`

const labelWidth = 175

const Label = styled.div`
    display: inline-flex;
    width: ${props => props.labelWidth}px;
    align-items: center;
    flex-shrink: 0;
    justify-content: flex-end;
    padding-right: 10px;
    color: ${props => props.invalid? "#898989" : "black"};
`
const Invalid = styled.span`
    color: #898989;
`
const Rank = styled.span`
    margin-right: 5px;
    color: #898989;
`
const Row = styled.div`
    font-size: 13px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
    /*height: 100%;*/
`
const AverageLine = styled.div`
    position: absolute;
    bottom: 0;
    left: ${props => props.labelWidth}px;
    width: 0px;
    height: calc(100% - 10px);
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
        content: 'CA avg';
        position: absolute;
        white-space: nowrap;
        /*width: 0;*/
        transform: translateX(-50%);
        top: -20px;
        text-align: center;
    }
`
const Bar = styled.div`
    width: 100%;
    height: 100%;
    transform-origin: 0% 0%;
    /*background: ${props => props.selected? 'orange' : 'green'};*/
    transition: transform .25s;
    transform: scaleX(${props=> props.percentage/100});
    //TODO: selection handling
    background: ${props => props.fill? props.fill : 'green'};
`
HorizontalBarGraph.defaultProps = {
    header: 'Needs header'
}
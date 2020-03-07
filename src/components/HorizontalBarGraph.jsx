
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import {find, findIndex} from 'lodash'

@observer
export default class HorizontalBarGraph extends React.Component{

    @observable width = 400

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
            >
                <Header>
                    {this.props.header} {this.selectedIndex}
                </Header>
                <Content>

                    {this.props.bars.map((item,i,bars)=>{
                        const invalidValue = item.value !==0 && (!item.value || item.value==='*')
                        const condensed = item.condensed
                        return(
                            <Row key = {item.label+'bar'}
                                condensed = {condensed}
                                onClick = {selectBar?()=>{selectBar('county',item)}:console.log(item) }
                            >
                                
                                    <Label 
                                        selected = {item.id === this.props.selected}
                                        labelWidth = {this.props.labelWidth} 
                                        invalid = {invalidValue}
                                    >
                                        <LeftLabel>{!condensed && item.leftLabel}</LeftLabel>
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
                                        />
                                        <EndHatch
                                            selected = {item.id === this.props.selected}
                                            offset = {this.props.labelWidth + (((this.width-40) - this.props.labelWidth) * (item.value/100)) }
                                        />
                                        {!condensed && 
                                        <Value
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
                </Content>
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
    max-width: 480px;
    // border: 1px solid black;
    // border: 1px solid var(--strokepurple);
    // padding: 20px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    letter-spacing: 0.5px;
    font-size: 13px;
    background: #fbfbfc;
`
const Header = styled.div`
    width: 100%;
    color: var(--fainttext);
    margin: 20px 0 15px 20px;
    // font-weight: bold;
`
const Content = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 20px 20px 20px;
    // border: 1px solid red;
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
    color: ${props => props.selected? "var(--strokepeach)" :props.invalid? "var(--fainttext)" : "var(--fainttext)"};

`
const LeftLabel = styled.div`
    font-weight: bold;
    // border: 1px solid red;
`
const Invalid = styled.span`
    color: var(--fainttext);
`
const Rank = styled.span`
    margin-right: 5px;
    color: var(--fainttext);
`
const Row = styled.div`

    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 4px;
    /*height: 100%;*/
    // padding: 0px 20px;
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
`
const EndHatch = styled.div`
    position: absolute;
    left: 0;
    transform: translateX(${props => props.offset-1}px);
    border-left: 1px solid ${props => props.selected? 'var(--strokepeach)' : 'var(--strokepurple)'};
    height: 100%;
`
const Value = styled.div`
    color: var(--fainttext);
    letter-spacing: 0.5px;
    position: absolute;
    // right: 0;
    ${props => props.alignValue==='outside'? css`left: 0;` : css`right: 0;` }
    transform: translateX(${props => props.alignValue === 'outside'? props.offset : -props.offset}px);
    margin-left: 8px;
`

HorizontalBarGraph.defaultProps = {
    header: 'Needs header',
    alignValue: 'outside' //outside or inside
}
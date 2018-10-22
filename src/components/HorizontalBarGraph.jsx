
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled, {css} from 'styled-components'
import {findDOMNode} from 'react-dom'

import media from '../utilities/media'

import PerfectScrollBar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import {find, findIndex} from 'lodash'
import FlipMove from 'react-flip-move'

import {floatingCorner, flushHard} from './BoxStyling'

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    max-height: 100%;
    @media ${media.optimal}{
        ${props => props.fullHeight? 'height: calc(100% - 10px);' : ''}    
    }
    @media ${media.compact}{
        ${props => props.fullHeight? 'height: calc(100% - 15px);' : ''}    
    }
    border: 1px solid var(--bordergrey);
`

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
            <Wrapper fullHeight = {this.props.fullHeight}>
            <Header>
                {this.props.header}
            </Header>
            {this.props.beefyPadding && <FadeCropper />}
            <PerfectScrollBar>
            <GraphTable
                ref = {this.graph}
                onClick = {this.props.expandable? this.expandGraph : ()=>{}}
                expanded = {this.expanded}
            >
                {/* 
                <Header expanded = {this.expanded}>
                    {!this.expanded && this.props.header}
                    {this.expanded && this.props.expandedHeader}
                    {this.expanded && this.props.expandedSubHeader && 
                        <Subheader>{this.props.expandedSubHeader}</Subheader>
                    }
                </Header>
                */}
                <Content beefyPadding = {this.props.beefyPadding}>
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
                                        hasLeftLabel = {item.leftLabel}
                                    >
                                        {item.leftLabel && 
                                            <LeftLabel
                                                hovered = {item.id === this.hoveredRow}
                                            >
                                                {!condensed && item.leftLabel}

                                            </LeftLabel>
                                        }
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
                                            {!item.trueValue && <Pct>%</Pct>}
                                            
                                        </Value>
                                        }
                                    </React.Fragment>
                                }
                                {invalidValue && !item.value && 
                                    <Invalid> No data </Invalid>
                                }
                                {invalidValue && item.value==='*' &&
                                    <Invalid> Data too small or unstable </Invalid>
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
                            offset = {(this.props.average/100)*(this.width-this.props.labelWidth-75)}
                        >
                            <AverageLabel side = {this.props.average>65?'left':'right'}>
                             CA Avg 
                             {/*<AverageValue>{this.props.average}%</AverageValue>*/}
                             </AverageLabel>
                        </AverageLine>
                    }
                </Content>

            </GraphTable>
            </PerfectScrollBar>

           {this.props.beefyPadding && <FadeCropperBottom />}
            {this.props.footer && 
            <Footer>
                {this.props.footer}
            </Footer>
            }
            </Wrapper>
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
    letter-spacing: 0.5px;
    font-size: 13px;
    transition: border-color .25s, background-color .25s, box-shadow .25s;
   
    overflow: hidden;
`

const CropBox = styled.div`
    position: absolute;
    margin: 0 20px;
    display: inline-flex;
    padding: 0 15px;
    background: var(--offwhitefg);
    z-index: 3;
`

const Header = styled(CropBox)`
    transform: translateY(-50%);
`
const FadeCropper = styled.div`
    /*border: 1px solid red;*/
    z-index: 2;
    position: absolute;
    width: 100%;
    height: 40px;
    background: linear-gradient(var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);
    /*border: 1px solid green;*/

`
const FadeCropperBottom = styled(FadeCropper)`
    top: auto;
    bottom: 0px;
    height: 30px;
    background: linear-gradient(to top, var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);
`
const Footer = styled(CropBox)`
    bottom: 0; right: 0;
    transform: translateY(50%);
    height: 4px; display: flex; align-items: center;
`

const Subheader = styled.div`
    font-size: 13px;
    color: var(--fainttext);
    margin-top: 5px;

`
const Content = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 36px 0px 25px;
    margin: ${props => props.beefyPadding?'42px 0 32px 0' : '25px 0 18px 0'};
    transition: transform .25s;
    // transform: ${props => props.offset? 'translateY(-20px)' : ''};
`

const Label = styled.div`
    display: inline-flex;
    width: ${props => props.labelWidth}px;
    align-items: center;
    flex-shrink: 0;
    justify-content: ${props => props.hasLeftLabel? 'space-between' : 'flex-end'};
    padding-right: 20px;
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
    cursor: pointer;
    position: relative;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    margin-top: 3px;
`
const AverageLine = styled.div`
    position: absolute;
    bottom: -12px;
    left: ${props => props.labelWidth + 20}px;
    width: 1px;
    background-color: var(--fainttext);
    height: calc(100% + 21px);
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
    transition: transform .25s, background-color .25s;
    transform: scaleX(${props=> props.percentage/100});

    background: ${props => props.selected? 'var(--peach)': props.condensed? 'var(--inactivegrey)': props.fill? props.fill : 'green'};
    border-right-color: transparent;
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

HorizontalBarGraph.defaultProps = {
    header: 'Needs header',
    alignValue: 'outside' //outside or inside
}
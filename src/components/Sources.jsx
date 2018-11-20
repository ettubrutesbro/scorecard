import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'

import {Button, Toggle} from './generic/'
import ExpandBox from './ExpandBox2'

import sources from '../data/sourcesfinal'
import indicators from '../data/indicators'
import media from '../utilities/media'


export default class Sources extends React.Component{


    render(){
        const expandWidth = this.props.screen === 'optimal'? 608 : 478
        return(
            <Wrapper
                currentMode = {this.props.expand?'expanded':'collapsed'}
                modes = {{
                    collapsed: {width: expandWidth/2, height: this.props.screen==='optimal'?530:410},
                    expanded: {width: expandWidth, height: this.props.screen==='optimal'?530:410}
                }}

                expand = {this.props.expand} //keeping vestigial prop for wrapper transitions
                expandWidth = {expandWidth}

                withScroll
                header = {(<Header>Indicator and demographics sources </Header>)}
                duration = {.4}
                delay = {this.props.expand? '.15s' : 0}
            >
                <AllSources width = {expandWidth}>
                    <Contents>
                    <IndicatorSourceInfo indicator = {this.props.indicator} />    
                    <DemographicSourceInfo />
                    </Contents>
                </AllSources>
            </Wrapper>
        )
    }
}

const Wrapper = styled(ExpandBox)`
    position: absolute;
    top: 70px;
    z-index: ${props=>props.expand? 30 : 5};
    pointer-events: ${props=>props.expand?'auto':'none'};
    opacity: ${props=>props.expand?1:0};
    transform: translateX(${props=>props.expand?0:props.expandWidth/2+'px'});
    transition: transform .4s cubic-bezier(0.215, 0.61, 0.355, 1), opacity ${props=>props.expand? .2 : .35}s;
    transition-delay: ${props=>props.expand? .15:0}s;
`

const X = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    border: 1px solid red; 
    width: 20px; height: 20px;
`

const AllSources = styled.div`
    position: absolute;
    height: 100%;
    width: ${props=>props.width}px;
    /*border: 1px solid var(--bordergrey);*/
    @media ${media.optimal}{
        width: 610px;
        max-height: 602px;
    }
    @media ${media.compact}{
        width: 480px;
        max-height: 470px;
    }

    white-space: normal;
`
const Contents = styled.div`
    padding: 35px;

`
const Header = styled.div`
    position: absolute;
    margin: 0 20px;
    display: inline-flex;
    padding: 0 15px;
    align-items: center;
    background: var(--offwhitefg);
    z-index: 3;
    height: 10px;
    white-space: nowrap;
`

const Indicator = styled.div`
    /*display: flex;*/
    padding-bottom: 25px;
    border-bottom: 1px solid ${props => props.last? 'transparent' : 'var(--bordergrey)'};
    margin-bottom: ${props=>props.last?0:25}px;
    justify-content: space-between;
`
const FadeCropper = styled.div`
    z-index: 2;
    position: absolute;
    width: 100%;
    height: 40px;
    background: linear-gradient(var(--offwhitefg) 30%, rgba(252,253,255,0) 100%);


`
const SourceBlock = styled.div`

    
    &:first-of-type{
        margin-top: 0;
    }
    h1, h3, a, p{
        margin-top: 15px;
    }
    h3, a{
        font-size: 13px;
        font-weight: bold;
        /*letter-spacing: 0.3px;*/
    }
    h1{
        font-size: 16px;
        font-weight: normal;
        margin: 0;
        margin-top: 10px;
        /*letter-spacing: 0.25px;*/
    }
    h3{
        margin: 0;
        padding: 0;
        color: var(--fainttext);
        text-transform: uppercase;
        margin-bottom: 5px;
    }
    a{
        display: block;
        margin-top: 15px;
        color: var(--strokepeach);
    }
    p{
        margin: 0;
    }
    @media ${media.optimal}{
        /*width: calc(50% - 15px);*/
    }
    @media ${media.compact}{
        /*width: calc(50% - 10px);*/
        h1{ font-size: 13px; }
    }

`

const NotesBlock = styled(SourceBlock)`
    /*font-size: 13px;*/
    p{ font-size: 13px; }
    margin-top: 15px;
`


export const IndicatorSourceInfo = (props) => {
    const {indicator} = props
    const src = find(sources, (o)=>{return o.indicator === indicator})
    return(
         <Indicator>
            <SourceBlock>
                <h3>indicator</h3>
                <h1>{src.source}</h1>
                <a href = {src.url} >{src.url}</a>
            </SourceBlock>
            {src.source2 &&
                <SourceBlock>
                <h1>{src.source}</h1>
                <a href = {src.url2} >{src.url2}</a>
                </SourceBlock>
            }

            {src.notes && 
            <NotesBlock>
                <p>{src.notes}</p>
            </NotesBlock>
            }
            {src.notes2 && 
            <NotesBlock>
                <p>{src.notes2}</p>
            </NotesBlock>
            }
            {src.notes3 && 
            <NotesBlock>
                <p>{src.notes3}</p>
            </NotesBlock>
            }
            {src.notes4 && 
            <NotesBlock>
                <p>{src.notes4}</p>
            </NotesBlock>
            }
            {src.redirect &&
                <Redirect 
                    text = {src.redirect}
                    link = {src.methoURL}
                />
            }
        </Indicator>
    )
}

const Redirect = (props) => {
    return(
        <RedirectLink href = {props.link}>
            <RedirectSpan>
            {props.text}
            </RedirectSpan>
        </RedirectLink>    
    )
}
const RedirectSpan = styled.div`
margin-top: 10px;
    color: var(--fainttext);
    font-size: 13px;
`
const RedirectLink = styled.a`
    text-decoration: none;
`

@observer
export class DemographicSourceInfo extends React.Component{
    @observable getSrc = 'population'
    @action setSrc = (val) => {this.getSrc = val}

    render(){
        const srcs = {
            population: find(sources, (o)=>{return o.indicator==='population'}),
            raceBreakdown: find(sources, (o)=>{return o.indicator==='raceBreakdown'}),
            immigrantFamilies: find(sources, (o)=>{return o.indicator==='immigrantFamilies'}),
            poverty: find(sources, (o)=>{return o.indicator==='poverty'}),
            homelessness: find(sources, (o)=>{return o.indicator==='homelessness'}),
        }
        const blockTitles = {
            population: 'Population count',
            raceBreakdown: 'Race percentages',
            immigrantFamilies: 'Number of children living with 1+ immigrant parents',
            poverty: 'Percent of children living 2X below the Federal Poverty Level',
            homelessness: 'Count of students experiencing homelessness'
        }

        return(
            <DemoSources>
                {Object.keys(srcs).map((src, i, arr)=>{
                    return(
                        <Indicator last = {i===arr.length-1}>
                            <SourceBlock>
                                <h3>{blockTitles[src]}</h3>
                                <h1>{srcs[src].source}</h1>
                                <a href = {srcs[src].url}>{srcs[src].url}</a>
                            </SourceBlock>  
                            {srcs[src].notes && 
                            <NotesBlock>
                                <p>{srcs[src].notes}</p>
                            </NotesBlock>
                            }
                            {srcs[src].redirect &&
                                <Redirect 
                                    text = {srcs[src].redirect}
                                    link = {srcs[src].methoURL}
                                />
                            }
                        </Indicator>
                    )
                })}

            </DemoSources>
        )
    }
}

const DemoSources = styled.div`
    
`
const DemoBlock = styled.div`
    

`
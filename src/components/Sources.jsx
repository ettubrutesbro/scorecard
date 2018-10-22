import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'

import {Button, Toggle} from './generic/'

import sources from '../data/sources'
import media from '../utilities/media'

import PerfectScrollBar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

export default class Sources extends React.Component{
    render(){
        return(
            <AllSources>
                <FadeCropper />
                <Header>
                    Indicator and demographics sources
                </Header>
                <PerfectScrollBar>
                    <Contents>
                    <IndicatorSourceInfo indicator = {this.props.indicator} />    
                    <DemographicSourceInfo />
                    </Contents>
                </PerfectScrollBar>    
            </AllSources>
        )
    }
}

const AllSources = styled.div`
    position: relative;
    height: 100%;
    border: 1px solid var(--bordergrey);

`
const Contents = styled.div`
    padding: 35px;

`
const Header = styled.div`
    position: absolute;
    margin: 0 20px;
    display: inline-flex;
    padding: 0 15px;
    background: var(--offwhitefg);
    z-index: 3;
    transform: translateY(-50%);
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

            {src.notes && 
            <NotesBlock>
                <p>{src.notes}</p>
            </NotesBlock>
            }
        </Indicator>
    )
}

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
import React from 'react'
// import {observable, action} from 'mobx'
// import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find} from 'lodash'

import Button from './Button'

import sources from '../data/sources'
import media from '../utilities/media'

export default class Sources extends React.Component{
    
    render(){
        const {indicator, race, year} = this.props.store

        return(
            <SourcesButton
                onClick = {this.props.onClick}
            >
                
                <DefaultSourcesView sources = {this.props.sources} onClick = {this.props.onClick}/>

            </SourcesButton>
        )
    }
}

const DefaultSourcesView = (props) => {
    return(
        <Button label = {props.sources? "Back to data" : "View sources and notes"} />
    )
}

export const FullSourcesView = (props)=> {
    const {indicator} = props
    const src = find(sources, (o)=>{return o.indicator === indicator})
    return(
        <FullView>
            {!src && `Error: no source for indicator (data typo likely) ${indicator} `}

            <SourceBlock>
                <h3>SOURCE</h3>
                <h1>{src.source}</h1>
                <a href = {src.url} >{src.url}</a>
            </SourceBlock>

            {src.project && 
                <SourceBlock>
                <h3>project</h3>
                <h1>{src.project}</h1>
                <a href = {src.projectURL}>{src.projectURL}</a>
                </SourceBlock>
            }

            <SourceBlock>
                <h3>date retrieved</h3>
                <h1>{src.dateRetrieved}</h1>
            </SourceBlock>
            {src.notes1 && 
            <SourceBlock>
                <h3>Notes</h3>
                <p>{src.notes1}</p>
            </SourceBlock>
            }
        </FullView>
    )
}

export const DemoSources = (props) => {
    const srcs = [
        find(sources, (o)=>{return o.indicator==='population'}),
        find(sources, (o)=>{return o.indicator==='poverty'}),
        find(sources, (o)=>{return o.indicator==='homeless'}),
        find(sources, (o)=>{return o.indicator==='immigrantFamilies'}),
    ]
    return(
        <DemoSourcesContent>
            <h1> Demographic data sources</h1>
            <DemoSourceBlock>
                <h3>child population & race </h3>
                <h1>{srcs[0].source}</h1>
                <Link href = {srcs[0].url}>{srcs[0].url}</Link>
            </DemoSourceBlock>  
            <DemoSourceBlock>
                <h3>foreign-born parents</h3>
                <h1>{srcs[3].source}</h1>
                <Link href = {srcs[3].url}>{srcs[1].url}</Link>
            </DemoSourceBlock>  
            <DemoSourceBlock className = 'indent'>
                <h3>children in poverty </h3>
                <h1>{srcs[1].source}</h1>
                <Link href = {srcs[1].url}>{srcs[2].url}</Link>
            </DemoSourceBlock>  
            <DemoSourceBlock className = 'bigindent'>
                <h3>student homelessness </h3>
                <h1>{srcs[2].source}</h1>
                <Link href = {srcs[2].url}>{srcs[3].url}</Link>
            </DemoSourceBlock>  
            <h4> Further details available in PDF.</h4>
        </DemoSourcesContent>
    )
}

const DemoSourcesContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    /*flex-direction: column;*/
    /*justify-content: space-betw\een;*/
    h1{
        width: 100%;
        font-size: 24px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px;
    }
    h4{
        width: 100%;
        color: var(--fainttext);
        font-size: 13px;
        text-align: right;
        font-weight: normal;
        margin: 0;
    }

`

const Link = styled.a`
    
`

const FullView = styled.div`
    border: 2px solid var(--bordergrey);
    @media ${media.optimal}{
        padding: 35px;
    }
    @media ${media.compact}{
        padding: 20px;
    }

`

const SourcesButton = styled.div`
    position: absolute;
    /*bottom: 0;*/
    right: 0;
    z-index: 20;
    @media ${media.optimal}{
        bottom: 150px;
    }
    @media ${media.compact}{
        bottom: 100px;
    }
`

const SourceBlock = styled.div`
    width: 100%;
    margin-top: 30px;
    &:first-of-type{
        margin-top: 0;
    }
    h1, h3, a, p{
    }
    h3, a{
        font-size: 13px;
        font-weight: bold;
        letter-spacing: 0.3px;
    }
    h1{
        font-size: 16px;
        font-weight: normal;
        margin: 0;
        letter-spacing: 0.25px;
    }
    h3{
        margin: 0;
        padding: 0;
        color: var(--fainttext);
        text-transform: uppercase;
        margin-bottom: 5px;
    }
    a{
        color: var(--strokepeach);
    }
    p{
        margin: 0;
    }

`

const DemoSourceBlock = styled(SourceBlock)`
    &:first-of-type{
        padding-right: 20px;
    }
    margin-top: 0;
    display: inline-flex;
    flex-direction: column;
    flex-basis: 50%;
    flex-shrink: 1;
    margin-bottom: 15px;
    @media ${media.optimal}{
        &.indent{
            h1{
                padding-left: 25px;
            }
            a{ padding-left: 50px; }
        }
    }
  


`

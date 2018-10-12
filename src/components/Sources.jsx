import React from 'react'
// import {observable, action} from 'mobx'
// import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find} from 'lodash'

import {Button} from './generic/'

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
    const srcs = [
        find(sources, (o)=>{return o.indicator==='population'}),
        find(sources, (o)=>{return o.indicator==='poverty'}),
        find(sources, (o)=>{return o.indicator==='homelessness'}),
        find(sources, (o)=>{return o.indicator==='immigrantFamilies'}),
    ]
    return(
        <FullView>
            {!src && `Error: no source for indicator (data typo likely) ${indicator} `}
            {src && 
                <React.Fragment>
                    <Indicator>
                        <SourceBlock>
                            <h3>indicator SOURCE</h3>
                            <h1>{src.source}</h1>
                            <a href = {src.url} >{src.url}</a>
                        </SourceBlock>

                        {src.notes && 
                        <NotesBlock>
                            <h3>indicator Notes</h3>
                            <p>{src.notes}</p>
                        </NotesBlock>
                        }
                    </Indicator>
                    <DemoSourceBlock>
                        <h3>child population & race </h3>
                        <h1>{srcs[0].source}</h1>
                        <a href = {srcs[0].url}>{srcs[0].url}</a>
                    </DemoSourceBlock>  
                    <DemoSourceBlock>
                        <h3>foreign-born parents</h3>
                        <h1>{srcs[3].source}</h1>
                        <a href = {srcs[3].url}>{srcs[1].url}</a>
                    </DemoSourceBlock>  
                    <DemoSourceBlock>
                        <h3>children in poverty </h3>
                        <h1>{srcs[1].source}</h1>
                        <a href = {srcs[1].url}>{srcs[2].url}</a>
                    </DemoSourceBlock>  
                    <DemoSourceBlock>
                        <h3>student homelessness </h3>
                        <h1>{srcs[2].source}</h1>
                        <a href = {srcs[2].url}>{srcs[3].url}</a>
                    </DemoSourceBlock>  

                    <h4> Further details available in PDF.</h4>
            </React.Fragment>
            }
        </FullView>
    )
}

const Indicator = styled.div`
    display: flex;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--bordergrey);
    margin-bottom: 25px;
    justify-content: space-between;
`

const FullView = styled.div`
    border: 2px solid var(--bordergrey);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: white;
    @media ${media.optimal}{
        padding: 35px;
        width: 175%;
    }
    @media ${media.compact}{
        padding: 20px;
        width: 200%;
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

const SourcesButton = styled.div`
    position: absolute;
    /*bottom: 0;*/
    right: 0;
    z-index: 20;
    @media ${media.optimal}{
        bottom: 105px;
    }
    @media ${media.compact}{
        bottom: 0;
    }

`

const SourceBlock = styled.div`

    
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
    @media ${media.optimal}{
        width: calc(50% - 15px);
    }
    @media ${media.compact}{
        width: calc(50% - 10px);
        h1{ font-size: 13px; }
    }

`

const NotesBlock = styled(SourceBlock)`
    /*font-size: 13px;*/
    p{ font-size: 13px; }

`


const DemoSourceBlock = styled(SourceBlock)`
    &:first-of-type{
        padding-right: 20px;
    }
    margin-top: 0;
    display: inline-flex;
    flex-direction: column;
    margin-bottom: 15px;
    @media ${media.optimal}{
        &.indent{
            h1{
                padding-left: 25px;
            }
            a{ padding-left: 50px; }
        }
    }
    @media ${media.compact}{
        &.indent{
            h1{
                padding-left: 15px;
            }
            a{ padding-left: 30px; }
        }
    }
    a{
        max-width: 200px;
    }
  


`

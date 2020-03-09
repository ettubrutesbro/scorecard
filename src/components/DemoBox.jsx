import React from 'react'
import styled from 'styled-components'

import commaNumber from 'comma-number'

import RaceBreakdownBar from './RaceBreakdownBar'
import CountingNumber from './CountingNumber'
import {Toggle} from './generic'

import {DemographicSourceInfo} from './Sources'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import countyLabels from '../assets/countyLabels'
import media, {getMedia} from '../utilities/media'
import sigFig, {rawSigFig} from '../utilities/sigFig'


const Box = styled.div`
        position: absolute;
        opacity: ${props => props.show? 1 : 0};
        top: 0;
        right: 0;
        @media ${media.optimal}{
            width: 550px;
            height: 475px;
            padding: 35px;
        }
        @media ${media.compact}{
            padding: 35px;
            padding-top: 25px;
            width: 515px;
            height: 390px;   

        }
        right: 0;
        // border: 2px solid var(--bordergrey);
        z-index: 1;
        transition: transform .4s, opacity .4s;

    @media ${media.mobile}{
        position: relative;
        padding: 0px 15px 100px 15px;
        width: calc(100vw - 40px);
        /*height: 500px;*/
        font-size: 14px;
        /*border: 1px solid var(--bordergrey);*/
    }
`

const DemoBox = (props) => {
    const {store, forceCA, ...restOfProps} = props
    const {screen} = store

    const county = forceCA? '' : store.county

    let pop = county? demopop[county].population : demopop.california.population
    let countyLabel = county? countyLabels[county] : 'California'
    let needsAddendum
    if(screen==='mobile' && countyLabel!=='California' && countyLabel.includes(' ')){
        countyLabel+= '\xa0county'
    }
    else if((countyLabel.length < 10 || screen==='mobile') && countyLabel!=='California') countyLabel+= ' county'
    else needsAddendum = true
    if(countyLabel==='California') needsAddendum = false
    pop = sigFig(pop)

    return(
        <Box
            id = "demobox"
            {...restOfProps}
        >
                    <Title>
                        {screen!=='mobile' &&
                             `Current ${county? 'county' : 'state'} demographics`
                        }
                    </Title>
                    <Population className = 'title'> 
                        <b>{pop}</b> children live in&nbsp;{countyLabel}. 
                        {needsAddendum && screen!=='mobile'&& <CountyAddendum>(county)</CountyAddendum>}
                    </Population>
                    <Content>
                        {screen!=='mobile' &&
                        <DataTable store = {store} />
                        }
                        <RaceBreakdownBar 
                            store = {store} forceCA = {props.forceCA} 
                            width = {screen === 'mobile'? store.mobileDeviceWidth - 72 : 'idc'}
                            height = {screen === 'optimal'? 315 : screen === 'compact'? 275 : 44}
                        />
                        {screen === 'mobile' && <DataTable store = {store} forceCA = {props.forceCA} />}
                    </Content>
            

            <StrokeShape 
                viewBox = {screen==='optimal'? "0 0 515 433" : screen === 'compact'? "0 0 515 375": "0 0 100 100"}
                preserveAspectRatio = "none"
            >
                {screen !== 'mobile' &&
                <polyline 
                    points = {screen==='optimal'? "0,194.85 0,0 515,0 515,433 231.75,433" 
                        : screen === 'compact'? "0,168.75 0,0 515,0 515,375 231.75,375" 
                        : "0,45 0,0 100,0 100,100 45,100"
                    }
                />
                }
            </StrokeShape>
        </Box>  
    )
}

export default DemoBox



const DemoToggle = styled(Toggle)`
`

const StrokeShape = styled.svg`
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    fill: none;
    stroke-width: 2;
    stroke: var(--bordergrey);
    pointer-events: none;
`

const Population = styled.h1`
    position: relative;
    margin: 0;
    margin-top: 5px;
    text-align: center;
    b{
        font-weight: 500;
    }
    white-space: nowrap;
    @media ${media.mobile}{
        text-align: left;
        font-size: 16px;
        font-weight: 400;
        b{ font-weight: 600; }
        letter-spacing: 0.5px;
        white-space: normal;
    }
`
const CountyAddendum = styled.div`
    position: absolute;
    @media ${media.optimal}{
        right: 25px; 
        top: 40px;
        font-size: 16px;
    }
    @media ${media.compact}{
        right: 30px; 
        top: 32px;
        font-size: 13px;
    }
    color: var(--fainttext);
`

const DataTable = (props) => {
    const county = props.forceCA? '' : props.store.county
    const demo = county? demopop[county] : demopop.california
    const place = county? countyLabels[county] : 'California'

        return(
            <RowTable> 
                <DemoRow> 
                    <DemoValue> <CountingNumber maxDuration = {0.85} number = {demo.immigrantFamilies} /> </DemoValue>
                    have one or more immigrant parent.
                </DemoRow>
                <DemoRow> 
                    <DemoValue> {demo.poverty}% </DemoValue>
                    are living at or below 2X the&nbsp;poverty&nbsp;level.
                </DemoRow>
                <DemoRow className = 'last'> 
                    <DemoValue> <CountingNumber maxDuration = {0.85} number = {rawSigFig(demo.homeless)} /> </DemoValue>
                    students&nbsp;experience homelessness.
                </DemoRow>
            </RowTable>
        )
    
}

const RowTable = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 25px;
    margin-right: 15px;
    @media ${media.optimal}{
        // padding-right: 20px;
    }
    @media ${media.mobile}{
        align-items: flex-start;
    }

`
const DemoRow = styled.div`
    position: relative;
    text-align: right;
    font-size: 13px;

    @media ${media.optimal}{
        &:not(:first-of-type){
            margin-top: 37px;   
            
        }
        padding: 0 20px;
        /*padding-left: 15px;*/
        line-height: 160%;
        &.last{
            margin-left: 80px;
            text-indent: -35px;
        }
    }
    @media ${media.compact}{
        &:not(:first-of-type){
            margin-top: 25px;   
            
        }
        padding: 0 20px;
        line-height: 150%;
        &.last{
            width: 210px;
        }
    }
    @media ${media.mobile}{
        font-size: 14px;
        letter-spacing: 0.5px;
        line-height: 19px;
        text-align: left;
        &:not(:first-of-type){
            margin-top: 15px;
        }
    }

`
const DemoLabel = styled.span`
    margin-left: 5px;
`
const DemoValue = styled.span`
    display: inline;
    font-weight: bold;
` 

const Title = styled.div`
    position: absolute;
    font-size: 16px;
    top: 0; right: 0;
    transform: translateY(-50%);
    margin-right: 20px;
    padding: 0 15px;
    background: var(--offwhitefg);
    z-index: 2;
    @media ${media.mobile}{
        /*position: relative;*/
        margin-left: 15px;
        margin-right: 0;
        right: auto;
        left: 0;
        letter-spacing: 0.5px;
        white-space: nowrap;
    }
`

const Content = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    z-index: 3;
    @media ${media.mobile}{
        display: flex;
        flex-wrap: wrap;
    }
`
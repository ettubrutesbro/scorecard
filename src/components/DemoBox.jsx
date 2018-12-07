import React from 'react'
import styled from 'styled-components'

import commaNumber from 'comma-number'

import RaceBreakdownBar from './RaceBreakdownBar'
import CountingNumber from './CountingNumber'

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

`

const DemoBox = (props) => {
    const store = props.store
    const {county, screen} = store
    let pop = county? demopop[county].population : demopop.california.population
    let countyLabel = county? countyLabels[county] : 'California'
    if(countyLabel.length < 9) countyLabel+= ' county'
    pop = sigFig(pop)
    return(
        <Box
            id = "demobox"
            {...props}
        >
                    <Title>
                         Current {county? 'county' : 'state'} demographics
                    </Title>
                    <Population className = 'title'> <b>{pop}</b> children live in {countyLabel}. </Population>
                    <Content>
                        <DataTable store = {store} />
                        <RaceBreakdownBar 
                            store = {store} 
                            height = {screen === 'optimal'? 315 : 275}
                        />
                    </Content>
            

            <StrokeShape 
                viewBox = {screen==='optimal'? "0 0 515 433" : screen === 'compact'? "0 0 515 375": "0 0 100 100"}
                preserveAspectRatio = "none"
            >
                
                <polyline 
                    points = {screen==='optimal'? "0,194.85 0,0 515,0 515,433 231.75,433" 
                        : screen === 'compact'? "0,168.75 0,0 515,0 515,375 231.75,375" 
                        : "0,45 0,0 100,0 100,100 45,100"
                    }
                />
            </StrokeShape>
        </Box>  
    )
}

export default DemoBox

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
    margin: 0;
    margin-top: 5px;
    text-align: center;
    b{
        font-weight: 500;
    }
    white-space: nowrap;
`

const DataTable = (props) => {
        const {county} = props.store
        const demo = county? demopop[county] : demopop.california
        const place = county? countyLabels[county] : 'California'

        return(
            <RowTable> 
                {/*     
                <DemoRow> 
                    <DemoValue> <CountingNumber number = {demo.population} /> </DemoValue>
                     children live in {place}.
                </DemoRow>
                */}
                <DemoRow> 
                    <DemoValue> <CountingNumber maxDuration = {0.85} number = {rawSigFig(demo.immigrantFamilies)} /> </DemoValue>
                    have one or more immigrant&nbsp;parent.
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
`

const Content = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    z-index: 3;
`
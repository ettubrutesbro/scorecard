import React from 'react'
import styled from 'styled-components'

import commaNumber from 'comma-number'

import RaceBreakdownBar from './RaceBreakdownBar'
import CountingNumber from './CountingNumber'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import countyLabels from '../assets/countyLabels'
import media from '../utilities/media'


const Box = styled.div`
	    position: absolute;
	    opacity: ${props => props.show? 1 : 0};
	    top: 0;
	    right: 0;
	    @media ${media.optimal}{
	        width: 515px;
	        height: 433px;
	        padding: 35px;
	    }
	    @media ${media.compact}{
	        padding: 35px;
	        padding-top: 25px;
	        width: 515px;
	        height: 375px;   

	    }
	    right: 0;
	    // border: 2px solid var(--bordergrey);
	    z-index: 1;
	    transition: transform .4s, opacity .4s;

`

const DemoBox = (props) => {
	const store = props.store
	const {county} = store
	let pop = county? demopop[county].population : demopop.california.population
	let countyLabel = county? countyLabels[county] : 'California'
	if(countyLabel.length < 9) countyLabel+= ' county'
	if(pop >= 1000000){
		pop = Math.round(pop / 1000000) + ' million'
	}
	else pop = commaNumber(pop)
	return(
		<Box
			id = "demobox"
			{...props}
		>

			<Title>Current {county? 'county' : 'state'} demographics</Title>
			<Population className = 'title'> <b>{pop}</b> children live in {countyLabel}. </Population>
			<Content>
				<DataTable store = {store} />
				<RaceBreakdownBar store = {store} />
			</Content>
			<StrokeShape viewBox = "0 0 100 100" preserveAspectRatio = "none">
				<polyline points = "0,45 0,0 100,0 100,100 45,100" />
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
	stroke-width: 1;
	stroke: var(--bordergrey);
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
                    <DemoValue> <CountingNumber number = {demo.immigrantFamilies} /> </DemoValue>
                    live with one or more immigrant parent.
                </DemoRow>
                <DemoRow> 
                    <DemoValue> {demo['poverty']}% </DemoValue>
                    are living 2X below the Federal Poverty&nbsp;Level.
                </DemoRow>
                <DemoRow className = 'last'> 
                    <DemoValue> <CountingNumber number = {demo['homeless']} /> </DemoValue>
                    students are experiencing homelessness.
                </DemoRow>
            </RowTable>
        )
    
}

const RowTable = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: 15px;
	margin-right: 15px;
    @media ${media.optimal}{
        // padding-right: 20px;
    }

`
const DemoRow = styled.div`
    position: relative;
    text-align: right;
    @media ${media.optimal}{
        margin-top: 20px;
        padding-left: 15px;
        line-height: 160%;
        font-size: 16px;
        letter-spacing: 0.6px;
        &.last{
            margin-left: 70px;
            text-indent: -35px;
        }
    }
    @media ${media.compact}{
    	&:not(:first-of-type){
    		margin-top: 25px;   
        	
    	}
        padding: 0 20px;
        line-height: 150%;
        font-size: 13px;
        letter-spacing: 0.5px;
        &.last{
        	width: 190px;
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
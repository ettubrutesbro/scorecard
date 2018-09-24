
import React from 'react'
import styled from 'styled-components'

import commaNumber from 'comma-number'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

import CountingNumber from './CountingNumber'

import {capitalize} from '../utilities/toLowerCase'
import media from '../utilities/media'


const RowTable = styled.div`
    @media ${media.optimal}{
        padding-right: 20px;
    }

`
const DemoRow = styled.div`
    position: relative;
    @media ${media.optimal}{
        margin-top: 20px;
        padding-left: 15px;
        line-height: 160%;
        font-size: 16px;
        letter-spacing: 0.6px;
    }
    @media ${media.compact}{

        margin-top: 15px;   
        padding-left: 10px;
        line-height: 150%;
        font-size: 13px;
        letter-spacing: 0.5px;
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
    @media ${media.optimal}{
        font-size: 24px;
        letter-spacing: 0.5px;
        margin-bottom: 23px;
    }
    @media ${media.compact}{

        font-size: 16px;
        margin-bottom: 20px;    
    }
`

export default class DemoDataTable extends React.Component {
    render(){
        const {county} = this.props.store
        const demo = county? demopop[county] : demopop.california
        const place = county? capitalize(county) + ' county' : 'California'
        return(
            <RowTable>
                <Title> Children in {place} </Title>
                <DemoRow> 
                    <DemoValue> <CountingNumber number = {demo.population} /> </DemoValue>
                     children live in {place}.
                </DemoRow>
                <DemoRow> 
                    <DemoValue> <CountingNumber number = {demo.immigrantFamilies} /> </DemoValue>
                    live with foreign-born parents.
                </DemoRow>
                <DemoRow> 
                    <DemoValue> {demo['poverty_2016']}% </DemoValue>
                    are living 200% below the federal poverty level.
                </DemoRow>
                <DemoRow> 
                    <DemoValue> <CountingNumber number = {demo['studentHomeless_2018']} />% </DemoValue>
                    of students are experiencing homelessness.
                </DemoRow>
            </RowTable>
        )
    }
}
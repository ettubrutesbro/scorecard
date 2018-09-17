
import React from 'react'
import styled from 'styled-components'

import commaNumber from 'comma-number'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

import CountingNumber from './CountingNumber'

const RowTable = styled.div`


`
const DemoRow = styled.div`
    position: relative;
    margin-top: 15px;   
    padding-left: 10px;
    line-height: 150%;
    font-size: 13px;
    letter-spacing: 0.5px;
`
const DemoLabel = styled.span`
    margin-left: 5px;
`
const DemoValue = styled.span`
    display: inline;
    font-weight: bold;
` 

const Title = styled.div`
    font-size: 16px;
    margin-bottom: 20px;    
`

export default class DemoDataTable extends React.Component {
    render(){
        const {county} = this.props.store
        const demo = county? demopop[county] : demopop.california
        const place = county? county : 'California'
        return(
            <RowTable>
                <Title> Children in {place} </Title>
                <DemoRow> 
                    <DemoValue> <CountingNumber relative number = {demo.population} /> </DemoValue>
                     children live in {place}
                </DemoRow>
                <DemoRow> 
                    <DemoValue> <CountingNumber relative number = {demo.immigrantFamilies} /> </DemoValue>
                    live with foreign-born parents 
                </DemoRow>
                <DemoRow> 
                    <DemoValue> {demo['poverty_2016']}% </DemoValue>
                    are living 200% below the federal poverty level 
                </DemoRow>
                <DemoRow> 
                    <DemoValue> <CountingNumber relative number = {demo['studentHomeless_2018']} /> </DemoValue>
                    students are experiencing homelessness
                </DemoRow>
            </RowTable>
        )
    }
}
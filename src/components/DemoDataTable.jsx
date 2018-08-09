
import React from 'react'
import styled from 'styled-components'

import commaNumber from 'comma-number'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

const RowTable = styled.div`


`
const DemoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const DemoLabel = styled.div`
`
const DemoValue = styled.div`
    margin-left: 15px;
` 

export default class DemoDataTable extends React.Component {
    render(){
        const {county} = this.props.store
        const demo = county? demopop[county] : demopop.california
        return(
            <RowTable>
                <DemoRow> 
                    <DemoLabel>in immigrant families: </DemoLabel>
                    <DemoValue> {commaNumber(demo.immigrantFamilies)} </DemoValue>
                </DemoRow>
                <DemoRow> 
                    <DemoLabel>in poverty (2016): </DemoLabel>
                    <DemoValue> {demo['poverty_2016']}% </DemoValue>
                </DemoRow>
                <DemoRow> 
                    <DemoLabel>Homeless students (2018):</DemoLabel>
                    <DemoValue> {commaNumber(demo['studentHomeless_2018'])} </DemoValue>
                </DemoRow>
            </RowTable>
        )
    }
}
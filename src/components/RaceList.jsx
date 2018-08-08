
import React from 'react'
import styled, {keyframes} from 'styled-components'

import demopop from '../data/demographicsAndPopulation.json'

const RaceRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px 20px;
    border: 1px solid #dedede;
    h1{ 
        margin: 0;
        font-size: 16px;
        font-weight: 400;
    }
    h3{ 
        font-weight: 400;
        font-size: 13px;
        margin: 0;
        margin-top: 4px;
    }
    &:not(:first-of-type){
        margin-top: 15px;
    }
`
const RowList = styled.div`

`
const races = ['asian','black','latinx','white','other']
const RaceList = (props) => {
    return(
        <RowList>
            {races.map((race)=>{
                return <RaceRow
                    onClick = {()=>props.store.completeWorkflow('race',race)}
                >
                    <h1>
                        {race.charAt(0).toUpperCase()+ race.substr(1)} children
                    </h1>
                    <h3> 
                        {demopop.california[race]}% of California's kids
                    </h3>
                </RaceRow>
            })}
        </RowList>
    )
}

export default RaceList
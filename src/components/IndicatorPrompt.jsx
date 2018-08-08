import React from 'react'
import styled, {keyframes} from 'styled-components'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import FlipMove from 'react-flip-move'

import {shuffle} from 'lodash'

import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

const Prompt = styled.div`
    width: 100%;
    /*border-top: 1px solid black;*/
    box-shadow: 0 -2px 5px rgba(0,0,0,0.25);
    padding: 30px;
    flex-grow: 1;
    h1{
        margin: 0;
        font-size: 24px;
        font-weight: 400;
    }
`
const Button = styled.div`
    background: black;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    margin-top: 25px;
`

const SampleIndicator = styled.div`
    margin-top: 15px;
    border: 1px solid #dedede;
    padding: 15px;
    width: 100%;
` 

export default class IndicatorPrompt extends React.Component{

    render(){
        const {store} = this.props
        const {county, indicator, race} = store
        return(
             <FlipMove
                delay = {700}
                duration = {400}
                appearAnimation = {{
                    from: {transform: 'translateY(40%)', opacity: 0},
                    to: {transform: 'translateY(0)', opacity: 1}
                }}
            >
            <Prompt>
                <h1>Choose an indicator. </h1>
                {Object.keys(indicators).map((ind)=>{
                    return <SampleIndicator
                        onClick = {()=>store.completeWorkflow('indicator',ind)}
                    > 
                        {semanticTitles[ind].label} 
                    </SampleIndicator>    
                })}
                <Button
                    onClick = {()=>store.setWorkflow('indicator')}
                    > see full indicator list</Button>
            </Prompt>

            </FlipMove>
        )
    }
}
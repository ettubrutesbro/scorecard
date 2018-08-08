import React from 'react'
import styled, {keyframes} from 'styled-components'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import {shuffle} from 'lodash'

import indicators from '../data/indicators'
import semanticTitles from '../assets/semanticTitles'

const Prompt = styled.div`
    width: 100%;
    /*border-top: 1px solid black;*/
    box-shadow: 0 -2px 5px rgba(0,0,0,0.25);
    padding: 20px;
    flex-grow: 1;
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
        return(
            <Prompt>
                Pick an Indicator
                {Object.keys(indicators).map((ind)=>{
                    return <SampleIndicator> 
                        {semanticTitles[ind].label} 
                    </SampleIndicator>    
                })}
                <Button
                    onClick = {this.props.openList}
                    > see list</Button>
            </Prompt>
        )
    }
}
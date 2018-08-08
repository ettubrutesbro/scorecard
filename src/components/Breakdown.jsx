import React from 'react'
import styled, {keyframes} from 'styled-components'
import FlipMove from 'react-flip-move'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import IndicatorPrompt from './IndicatorPrompt'

const Wrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const BreakdownBox = styled.div`
    padding: 30px;
    margin: 0px 30px 30px 30px;
    border: 1px solid #dedede;
    flex-grow: 1;
`

export default class Breakdown extends React.Component{
    render(){
        const {indicator, county, race} = this.props.store
        return(
            <Wrapper>
            <FlipMove
                delay = {350}
                duration = {500}
                appearAnimation = {{
                    from: {transform: 'translateY(-100%)', opacity: 0},
                    to: {transform: 'translateY(0)', opacity: 1}    
                }}
            >
                <BreakdownBox>
                    {indicator && !county && !race && 'county performance distribution and indicator by race'}
                    {!indicator && county && !race && 'population race % breakdown and county demographic data'}
                    {!indicator && !county && race && 'counties with the most children of this race (number not percent)'}
                </BreakdownBox>
            </FlipMove>
            <FlipMove
                delay = {1000}
                duration = {600}
                appearAnimation = {{
                    from: {transform: 'translateY(100%)', opacity: 0},
                    to: {transform: 'translateY(0)', opacity: 1}
                }}
            >
                <IndicatorPrompt 
                    openList = {()=>{this.props.store.setWorkflow('indicator')}}
                />
            </FlipMove>
            </Wrapper>
        )
    }

}

import React from 'react'
import styled from 'styled-components'

// import {observable, action, computed} from 'mobx'
// import {observer} from 'mobx-react'

// import FlipMove from 'react-flip-move'

const Btn = styled.div`
    border: 1px solid black;
    padding: 15px 20px;
    margin-top: 15px;
    transition: ${props => props.mode==='button'? 'border-bottom-color .35s' : ''};
    border-color: ${props => props.mode === 'active'? 'transparent' : 'black'};
    transform-origin: 50% 0%; 
`

export default class WorkflowButton extends React.Component{
    render(){
        const {activeWorkflow, setWorkflow, county, indicator, race} = this.props.store
        const {track, btnlabel, activelabel, prompt, store} = this.props
        const mode = activeWorkflow === track? 'active' : !activeWorkflow && !store[track] && (county||indicator||race)? 'prompt' : 'button'

        return(
            <Btn track = {track} mode = {mode} onClick = {()=>setWorkflow(track)}>
                {mode === 'button' && btnlabel} 
                {mode === 'active' && 'Back'}
                {mode === 'prompt' && 'See full list'}
            </Btn>
        )
    }
}

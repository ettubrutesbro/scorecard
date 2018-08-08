
import React from 'react'
import styled, {keyframes} from 'styled-components'

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import {find, findIndex} from 'lodash'

// import FlipMove from 'react-flip-move'
// import Toggle from './Toggle'

// import indicators from '../data/indicators'
// import {counties} from '../assets/counties'
// import semanticTitles from '../assets/semanticTitles'
// import demopop from '../data/demographicsAndPopulation.json'

import IndicatorList from './IndicatorList'
import CountyList from './CountyList'
import RaceList from './RaceList'

const fadeIn = keyframes`
    from {opacity: 0;}
    to {opacity: 1;}
`
const rightColMount = keyframes`
    from {transform: scaleX(0.01);}
    to {transform: scaleX(1);}
`
const rightColUnmount = keyframes`
    from {transform: scaleX(1);}
    to {transform: scaleX(0.01);}
`

const Wkflw = styled.div`
    border: 1px solid black;
    transform-origin: 50% 0%;
    /*border-top-color: transparent;*/
    flex-grow: 1;
    padding: 10px;
    // margin-top: 15px;
`
const Wrapper = styled.div`
`
const Content = styled.div`
    position: absolute;
    z-index: 2;
    padding: 20px;
    width: ${props => props.doublewide?'160%' : '100%'};
    height: 100%;   
    top: 0; left: 0;
    opacity: 0;
    animation: ${fadeIn} .5s forwards;
    animation-delay: .5s;
`
const RightColumn = styled.div`
    position: absolute;
    left: calc(100% - 0.5px); 
    top: -2px;
    width: 60%;
    height: calc(100% + 3px);
    border: 1px solid black;
    border-left-color: white;
    background: white;
    transform-origin: 0% 50%;
    transform: scaleX(0);
    animation: ${rightColMount} .5s forwards};

`

const workflowManifest = {
    indicator: <IndicatorList />,
    race: <RaceList />,
    county: <CountyList />,
}
    

export default class Workflow extends React.Component{
    render(){
        const {store, target} = this.props

        console.log(workflowManifest[target])
        return(
            <Wkflw target = {target}>
                <Wrapper 
                    mounting = {store.activeWorkflow === target}
                    // onClick = {()=>store.completeWorkflow(target,'black')}
                >
                    <Content
                        doublewide = {target==='county'|| target==='indicator'}
                    >
                    {React.cloneElement(
                        workflowManifest[target],
                        // {clickedItem: store.completeWorkflow}
                        {store: store}
                    )}
                    </Content>
                    {(target === 'indicator' || target === 'county') &&
                        <RightColumn 
                            active = {store.activeWorkflow === target}
                        />
                    }
                </Wrapper>
            </Wkflw>
        )
    }
}






import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import FlipMove from 'react-flip-move'

import WorkflowButton, {CountyButton, RaceButton, IndicatorButton} from './WorkflowButton'
import Workflow from './Workflows'
import Completed from './Completed'
import Readout from './Readout'
import Breakdown from './Breakdown'
import Context from './Context'
import IndicatorPrompt from './IndicatorPrompt'

class InfoStore{
    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable activeWorkflow = null

    @observable queryOrder = []

    @computed get itemOrder(){
        const {indicator, county, race, activeWorkflow} = this
        if(!indicator && !county && !race && !activeWorkflow){
            console.log('initial state')
            return [ 'indicatorBtn', 'countyBtn', 'raceBtn']
        } 
        else if(!indicator && !county && !race && activeWorkflow){
            console.log('first workflow state')
            if(activeWorkflow === 'county') return ['indicatorBtn','raceBtn','countyBtn','countyWorkflow',]
            else if(activeWorkflow === 'indicator') return ['countyBtn','raceBtn','indicatorBtn','indicatorWorkflow']
            else if(activeWorkflow === 'race') return ['indicatorBtn','countyBtn','raceBtn','raceWorkflow']
        }
        else if((indicator||county||race) && !activeWorkflow){
            console.log('information state')
            const incompleteWorkflows = ['indicatorBtn','countyBtn','raceBtn'].filter((btn)=>{
                return !this[btn.replace('Btn','')]
            })
            // let order = ['complete','readout','breakdown','context',...incompleteWorkflows]
            // let order = ['complete','readout',...incompleteWorkflows]
            // let order = ['readout',...incompleteWorkflows]
            let order = ['readout','breakdown'] //indicator prompt if no indicator
            // if(!indicator) order.push('prompt')
            return order

        }
        else{
            console.log('drill state')
            const queryOrder = this.queryOrder.map((item)=> {return item+'Complete'})
            const incompleteWorkflows = ['indicatorBtn','countyBtn','raceBtn'].filter((btn)=>{
                return !this[btn.replace('Btn','')]
            }).sort((a,b)=>{
                if(a.replace('Btn','')!==this.activeWorkflow) return 1
                else return 0
            })

            // let order = ['complete','readout',...incompleteWorkflows]
            let order = ['readout',...incompleteWorkflows]


            if(!this[this.activeWorkflow]){
             order.splice(order.indexOf(this.activeWorkflow+'Btn',)+1, 0, this.activeWorkflow+'Workflow')
            } 
            else order.splice(1, 0, this.activeWorkflow+'Workflow')
            
            // let order = ['readout']
            return order
        }
    }

    @action setWorkflow = (mode) => this.activeWorkflow = mode===this.activeWorkflow? '' : mode
    @action completeWorkflow = (which, value) => {

        if(!this.queryOrder.includes(this.activeWorkflow)) this.queryOrder.push(this.activeWorkflow)
        this.activeWorkflow = null
        this[which] = value
        console.log('query order:', this.queryOrder.toJS())
    }
    
}

const store = new InfoStore()

const manifest = {
    countyBtn: <WorkflowButton 
        track = 'county' 
        btnlabel = 'by County'
        activelabel = {'Which county\'s data do you want to browse?'}
        prompt = 'By County'
    />,
    indicatorBtn: <WorkflowButton 
        track = 'indicator'
        btnlabel = 'by Topic / Indicator'
        activelabel = {'Children\'s wellness indicators'}
        prompt = 'Pick an indicator'
    />,
    raceBtn: <WorkflowButton 
        track = 'race'
        btnlabel = 'by Race'
        activelabel = {'What race do you want to see data for?'}
        prompt = 'By Specific Race'
    />,
    countyWorkflow: <Workflow
        target = 'county'
    />,
    indicatorWorkflow: <Workflow
        target = 'indicator'
    />,
    raceWorkflow: <Workflow
        target = 'race'
    />,
    // complete: <Completed />,
    readout: <Readout />,
    breakdown: <Breakdown />,
    // context: <Context key ='context'>context</Context>,
    prompt: <IndicatorPrompt />
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    /*width: 450px;*/
    flex-shrink: 0;
    position: relative;
    // border: 1px solid red;
    height: 100%;
`


@observer
export default class ProtoWorkflow extends React.Component{

    render(){
        const {activeWorkflow, county, race, indicator} = store
        return(
            <Wrapper>

                <FlipMove 
                    // disableAllAnimations
                    typeName = {null}
                    duration = {350}
                    staggerDurationBy = {!activeWorkflow && (county||race||indicator)? 100 : 0}
                    staggerDelay = {!activeWorkflow && (county||race||indicator)? 50 : 0}
                    enterAnimation = {activeWorkflow || (!county&&!race&&!indicator)? {
                        from: {transform: 'scaleY(0.2)', opacity: 0},
                        to: {transform: 'scaleY(1)', opacity: 1}
                    } : {
                        from: {
                            transform: 'translateX(100px)',
                            opacity: 0
                        },
                        to: {
                            transform: 'translateX(0)', 
                            opacity: 1
                        }
                    }}
                    leaveAnimation = {null}
                    // maintainContainerHeight = {true}
                >
                {store.itemOrder.map((item)=>{
                    return React.cloneElement(
                        manifest[item],
                        {store: store, key: item}
                    )
                })}
                </FlipMove>
            </Wrapper>
        )
    }
}
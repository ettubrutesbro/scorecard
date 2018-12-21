import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import IntersectionObserver from '@researchgate/react-intersection-observer'

import indicators from './data/indicators'

import Icon from './components/generic/Icon'
import ExpandBox from './components/ExpandBox'

import MobileNav from './MobileNav'
import IndicatorByCounties from '../src/components/IndicatorByCounties'
import IndicatorByRaces from '../src/components/IndicatorByRaces'
import Readout from '../src/components/Readout'

const width = window.innerWidth - 50

@observer
export default class MobileScorecard extends React.Component{

    @observable picking = false
    @observable view = 'breakdown'
    @observable showShorthand = false
    @action toggleHeaderInfo = (tf) => {
        this.showShorthand = tf
    }

    render(){
        const {store} = this.props
        return(
            <div>
                <MobileNav store = {store}
                    showShorthand = {this.showShorthand}
                />

                <Content>
                    <Breakdown store = {store} 
                        onScrollPastReadout = {this.toggleHeaderInfo}
                    />
                </Content>
                
                <SectionChooser>
                    <BreakdownBtn />
                    <DemoBtn />
                    <SourcesBtn />
                </SectionChooser>
            </div>
        )
    }
}


const Content = styled.div`
    position: absolute;
    top: 0;
    /*height: 100vh;*/
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--offwhitefg);
    z-index: 1;
    margin-top: 55px;
    padding: 10px 20px 80px 20px;
    margin-bottom: 67px;
`
const SectionChooser = styled.div`
    position: fixed;
    height: 67px;
    border-top: 1px solid var(--fainttext);
    background: white;
    width: 100%;
    bottom: 0;
    z-index: 1;
    display: flex; 
    align-items: center;
    justify-content: space-around;
`
const SectionBtn = styled.div`
    width: 45px; height: 45px;
    border: 1px solid black;
`
const BreakdownBtn = styled(SectionBtn)`
    
`
const DemoBtn = styled(SectionBtn)`
    
`
const SourcesBtn = styled(SectionBtn)`
    
`



@observer class Breakdown extends React.Component{
    @observable allCounties = false 
    @action expandCountyList = (tf) => this.allCounties = tf
    render(){
        const store = this.props.store
        const {indicator, race, county, year} = store
        const hasRace = indicators[indicator].categories.includes('hasRace')

        return(
            <React.Fragment>
                <IntersectionObserver
                    onChange = {(wat)=>this.props.onScrollPastReadout(!wat.isIntersecting)}
                    rootMargin = '-75px 0% 0% 0%'
                >
                    <Readout store = {store} />
                </IntersectionObserver>
                <Tables expanded = {this.allCounties} >
                    <IndicatorByCounties
                        entries = {hasRace? 9 : 12}
                        store = {store}
                        hasRace = {hasRace}
                        onExpand = {this.expandCountyList}
                        expand = {this.allCounties}
                        toggleDistribute = {()=>{
                            console.log('toggling distribution...')
                            this.expandCountyList(!this.allCounties?true:false)
                        }}
                        sources = {this.props.sources}
                    />
                    {hasRace && !this.allCounties && 
                        <IndicatorByRaces
                            store = {store}
                            expand = {true}
                            mobile = {true}
                        />
                    }
                </Tables>
            </React.Fragment>
        )
    }
}

const Tables = styled.div`
    position: relative;
    margin-top: 25px;
    width: ${width}px;
    height: ${props => props.expanded? 1400 : 495}px;
`
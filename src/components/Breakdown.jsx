import React from 'react'
import styled, {keyframes} from 'styled-components'
import FlipMove from 'react-flip-move'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

import commaNumber from 'comma-number'

import IndicatorByRaces from './IndicatorByRaces'
import IndicatorByCounties from './IndicatorByCounties'
import CountiesByRacePopulation from './CountiesByRacePopulation'


import DemoDataTable from './DemoDataTable'
import Sources from './Sources'

import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'

import {getMedia} from '../utilities/media'

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`

const BreakdownBox = styled.div`
    flex-grow: 1;
`
const BottomTable = styled.div`
    margin-top: 20px;
`


@observer
export default class Breakdown extends React.Component{

    @observable allCounties = false
    @action expandCountyList = (tf) => this.allCounties = tf 

    componentDidUpdate(oldProps){
        if(this.props.sources !== oldProps.sources){
            this.expandCountyList(false)
        }
    }

    render(){

        const {store} = this.props
        const {indicator, county, race, year, screen} = store
        //CALCULATE # ENTRIES FOR FIRST CHART FROM OFFSET + HASRACE

        let entryCount = 0
        if(indicator){
            const hasRace = indicators[indicator].categories.includes('hasRace')
            if(screen==='optimal'){
                if(hasRace) entryCount = 14
                else entryCount = 20
            }if(screen==='compact'){
                if(hasRace) entryCount = 9
                else entryCount = 18    
            }
        }


        return(
            <Wrapper >

                {!this.props.sources && indicator &&  
                    <IndicatorByCounties 
                        entries = {entryCount}
                        store = {store}
                        onExpand = {this.expandCountyList}
                    />  
                }
                {!this.props.sources && indicator && indicators[indicator].categories.includes('hasRace') &&

                    <IndicatorByRaces
                        store = {store}
                    />
                }
                {indicator && this.props.sources &&
                    <Sources indicator = {indicator} />
                }
            </Wrapper>
        )
    }

}


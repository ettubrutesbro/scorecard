
import React from 'react';
import styled from 'styled-components'
import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links';
import '../src/global.css'

import chroma from 'chroma-js'

import MobileScorecard from '../src/MobileScorecard'
import MobileNav from '../src/MobileNav'
import {counties} from '../src/assets/counties'
import indicators from '../src/data/indicators'
import demopop from '../src/data/demographicsAndPopulation'

import IndicatorByCounties from '../src/components/IndicatorByCounties'
import Readout from '../src/components/Readout'
import IndicatorByRaces from '../src/components/IndicatorByRaces'
import ExpandBox from '../src/components/ExpandBox'
import DemoBox from '../src/components/DemoBox'

addDecorator(withViewport('iphone6'))

const Void = styled.div`
    position: relative;
    width: 100vw;
    max-width: 640px;
    /*height: 100vh;*/
    height: 100vh;
    background: var(--offwhitefg);
    padding: 20px;
    /*font-size: 14px; */
`

let allCounties = counties.map((cty)=>{return cty.id})
allCounties.push('')
let allIndicators = Object.keys(indicators)
allIndicators.push('')

storiesOf('Mobile version', module)
.add('MobileScorecard', ()=>{
    const indicator = select('indicator',allIndicators, 'earlyPrenatalCare')
    const county = select('county', allCounties, null)
    const race = select('race', ['asian','black','latinx','white','other',null],null)
    const year = select('year(index)', [0,1], 0)

    const allNums = Object.keys(indicators[indicator].counties).map((cty)=>{
        let use = race
        if(!indicators[indicator].counties[cty][race]) use = 'totals'
        return indicators[indicator].counties[cty][use][year]
    }).filter((o)=>{return o===''||o==='*'?false : true})

    return(
        <MobileScorecard 
            store = {{
                indicator: indicator,
                screen: 'mobile',
                year: 0,
                race: race,
                county: county,
                colorScale: chroma.scale('BuPu')
                    .domain([0,100])
                    .padding([Math.min(...allNums)/100, 0])
                    .classes(5)
            }}
        />
    )
})

.add('MobileNav', ()=>{
    const mode = select('mode', ['button','bar','offscreen'], 'bar')
    return(
        <Void>
        <MobileNav
            store = {{
                indicator: 'earlyPrenatalCare',
                completeWorkflow: (t,v)=>{console.log('change',t,'to',v)}
            }}
            mode = {mode}
        />
        </Void>   
    )
})
.add('ExpandBox', ()=>{
    const current = select('mode', ['collapsed','expanded'], 'collapsed')
    return(
        <Void>
        <ExpandTest 
            currentMode = {current}
            modes = {{
                collapsed: {width: 100, height: 200},
                expanded: {width: 500, height: 300}
            }}
        >
            fuck
        </ExpandTest>
        </Void>
    )
})
.add('DemoBox', ()=>{
    const county = select('county', allCounties, null)
    return(
        <Void>
        <DemoBox
            store = {{
                ...store,
                county: county,
                screen: 'mobile',
            }}
            show
        />    
        </Void>
    )
})
.add('IndByCounties', ()=>{
    const indicator = select('indicator',allIndicators, 'earlyPrenatalCare')
    const county = select('county', allCounties, null)
    const race = select('race', ['asian','black','latinx','white','other',null],null)
    const year = select('year(index)', [0,1], 0)

    const allNums = Object.keys(indicators[indicator].counties).map((cty)=>{
        let use = race
        if(!indicators[indicator].counties[cty][race]) use = 'totals'
        return indicators[indicator].counties[cty][use][year]
    }).filter((o)=>{return o===''||o==='*'?false : true})
    return(
        <Void>
        <IndicatorByCounties
            entries = {10}
            store = {{
                screen: 'mobile',
                year: year,
                race: race,
                indicator: indicator,
                county: county,
                completeWorkflow: (a,b) => {console.log(a,b)},
                colorScale: chroma.scale('BuPu')
                    .domain([0,100])
                    .padding([Math.min(...allNums)/100, 0])
                    .classes(5)
            }}
        />
        </Void>
    )
})
.add('Readout', ()=>{
    const indicator = select('indicator',allIndicators, 'earlyPrenatalCare')
    const county = select('county', allCounties, null)
    const race = select('race', ['asian','black','latinx','white','other',null],null)
    const year = select('year(index)', [0,1], 0)
    return(
        <Void>
            <Readout 
                store = {{
                    screen: 'mobile',
                    year: year,
                    race: race,
                    indicator: indicator,
                    county: county,
                }}
            />
        </Void>
    )
})

const ExpandTest = styled(ExpandBox)`
    background: var(--offwhitebg);
`
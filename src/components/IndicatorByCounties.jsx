
import React, {Fragment} from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'
import commaNumber from 'comma-number'

import {counties} from '../assets/counties'
import countyLabels from '../assets/countyLabels'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import semanticTitles from '../assets/semanticTitles'

import {capitalize} from '../utilities/toLowerCase'
import {truncateNum} from '../utilities/sigFig'

import ordinal from 'ordinal'

import Graph from './HorizontalBarGraph'
import Icon, {Sprite} from './generic/Icon'
import {Button,Toggle} from './generic'
import ExpandBox from './ExpandBox2'


function indexOfClosest(nums, target) {
  let closest = 1000;
  let index = 0;

  nums.forEach((num, i) => {
    let dist = Math.abs(target - num);
    if (dist < closest) {
      index = i;
      closest = dist;
    }
  });

  return index;
}

@observer
export default class IndicatorByCounties extends React.Component{

    @observable distribute = true
    @observable fullHeight = false

    @observable performance = []
    @observable distribution = []
    @observable condensed = []

    @observable sortOverviewBy = 'pct'
    @action setOverviewSort = (v) => {
        console.log('setting sort for overview')
        this.sortOverviewBy = v
    }

    @action calculatePerformance = () => {
        // console.log('calculating performance')

        const {county, indicator, year, race, colorScale} = this.props.store
        const ind = indicators[indicator]
        //all counties' performance in this indicator 
        this.performance = Object.keys(ind.counties).filter((cty)=>{
            if(cty==='california') return false
            if(race){
                const value = ind.counties[cty][race?race:'totals'][year]
                return value !== '' && value !== '*'
            }
            else{
                const rank = ind.counties[cty].ranks[year]
                return !rank? false : typeof rank !== 'number'? false : true
            }
        }).map((cty,i)=>{
            const rank = ind.counties[cty].ranks[year]
            const value = ind.counties[cty][race?race:'totals'][year]
            return {
                //label should be dom element featuring rank ordinal
                id: cty,
                label: countyLabels[cty], 
                // leftLabel: !race? ordinal(rank) : '',
                rank: !race?rank:'', 
                value: value,
                //should i do this at the bargraph level?
                fill: colorScale? colorScale(value): '',
                population: demopop[cty].population
            }
        }).sort((a,b)=>{
            if(race) return a.value > b.value? -1 : a.value < b.value? 1 : 0
            else return a.rank > b.rank? 1 : a.rank < b.rank? -1 : 0 
        }).map((cty,i)=>{
            if(!race) return {...cty}
            else return {
                ...cty,
                // leftLabel: ordinal(i+1),
                rank: i+1,
            }
        })

    } 

    @action toggleDistribute = () => {
        this.distribute = !this.distribute
        this.fullHeight = !this.distribute
        if(this.props.onExpand) this.props.onExpand(!this.distribute)
    }

    @action generateDistribution = () => {
        // console.log('generating distribution')
        const {county, indicator, year, race} = this.props.store

        const ind = indicators[indicator]

        const validCounties = Object.keys(ind.counties).filter((cty)=>{
            if(!race){
                const rank = ind.counties[cty].ranks[year]
                 return cty!=='california' && rank && typeof rank === 'number'
            }
            else{
                const value = ind.counties[cty][race][year]
                return cty!=='california' && value && typeof value == 'number'   
            }
        })

        const entries = this.props.entries
        const countyCount = validCounties.length
        const unit = (countyCount-1) / entries
        // const offset = parseInt((Math.abs((countyCount - (unit*(entries-2))) - unit) / 2).toFixed(0))
        // console.log(offset)
        const offset = 0
            //-1 for california...
        let distribution = []
        for(let i = 1; i<entries-1; i++){
            distribution.push(Math.round(i*unit))
        }
        distribution.unshift(0)
        distribution.push(countyCount-1)

        if(county){
            let mustInclude = findIndex(this.performance, (o)=>{return o.id===county})
            //get actual index of this county within the performance list

                //to find the equivalent in race, we need to find its place in the entire pecking order
            if(race){
                const valueSortedCounties = Object.keys(ind.counties).map((cty)=>{
                    return {county: cty, value: ind.counties[cty][race][year]}
                }).filter((item)=>{
                    return item.county!=='california' && item.value!=='' && item.value !== '*'
                })
                .sort((a,b)=>{
                     return a.value > b.value? -1 : a.value < b.value? 1 : 0
                })
                mustInclude = findIndex(valueSortedCounties, (item)=>{return item.county===county})

            }
                
            let replaceIndex = indexOfClosest(distribution, mustInclude)
            // console.log('mustInclude is', mustInclude, 'replaceIndex is', replaceIndex)
            if(replaceIndex===0 && mustInclude !==0) replaceIndex = 1 //don't replace the first-ranked item
            if(replaceIndex===entries-1 && mustInclude !== distribution[entries-1]) replaceIndex = entries-2
            else if(replaceIndex===entries-1 && mustInclude === distribution[entries-1]) console.log('last one')

            this.selectedIndex = replaceIndex
            distribution[replaceIndex] = mustInclude
;``
            // console.log('adjusted distribution:', distribution)

            // this.condensed = distribution.slice(0)
            // this.condensed.splice(replaceIndex,1)
            // if(replaceIndex !== 0) this.condensed.splice(0,1)
            // if(replaceIndex !== this.condensed.length - 1) this.condensed.splice(this.condensed.length-1,1)

        }
        else if (!county){
            this.condensed = []
        }
        this.distribution = distribution
        console.log(indicator, entries)
        console.log(distribution)

    }


    componentDidMount(){
        // this.calculatePerformance()
        // this.generateDistribution()
        const wtf = autorun(()=>{
            const {indicator, race, county, year} = this.props.store
            // console.log(indicator, race, county, year)
            this.calculatePerformance()
            this.generateDistribution()
        })
        // this.averageTweeners()
    }

    


    render(){

        const {county, race, year, indicator, completeWorkflow, colorScale, screen} = this.props.store
        let {performance} = this 
        const ind = indicators[indicator]
        const unstable = ind.categories.includes('unstable')

        const distribute = !this.props.expand

        if(this.sortOverviewBy === 'pop'){
            performance = performance.sort((a,b)=>{
                return a.population > b.population? -1 : a.population < b.population? 1 : 0
            }).slice(0,distribute?this.props.entries:performance.length)
            .map((e)=>{

                return {
                    ...e,
                    leftLabel: !distribute && !unstable? e.rank + '.' : '',
                    label: <LabelComponent selected = {e.id===county} label = {e.label} right = {truncateNum(e.population)} />
                }
            })
        }
        else performance = performance.map((e,i,arr)=>{
            const distrib = this.distribution
            if(!distribute){
                return {...e, leftLabel: !unstable? e.rank+'.' : ''}
            
            }
            else if(distrib.includes(i)){ 
                return {
                    ...e,
                    label: <LabelComponent 
                        left = {unstable? '' : i===0? '1.' 
                            : i===arr.length-1? arr.length+'.' 
                            : e.id===county? e.rank+'.'
                            : ''
                        }
                        selected = {e.id===county}
                        label = {e.label}
                    />
                }

            }
            else return null
        })

        .filter((e,i)=>{
            if(!distribute) return true
            if(e===null) return false
            else return true
        })

        const sem = semanticTitles[indicator]
        let expandedHeader = `${sem.descriptor||''} ${race?capitalize(race):''} ${sem.who} who ${sem.what}`
        expandedHeader = expandedHeader.slice(0,1).toUpperCase() + expandedHeader.substr(1)

            

        let highestValue = 0
        let withRace = !race? '' : Object.keys(demopop)
            .filter((cty)=> {return cty!=='california'})
            .map((cty)=>{
                const pop = parseInt(((demopop[cty][race]/100) * demopop[cty].population).toFixed(0))
                if(pop > highestValue) highestValue = pop
                return {
                    id: cty,
                    label: countyLabels[cty],
                    value: pop,
                }
            })
            .sort((a,b)=>{
                return a.value>b.value? -1: a.value<b.value? 1 : 0
            })
        if(race){
            withRace = withRace.slice(0,distribute?this.props.entries:withRace.length) 
            .map((cty)=>{
                const val = indicators[indicator].counties[cty.id][race][year]
                const selected = cty.id===county
                return {
                    ...cty,
                    label: <LabelComponent selected = {selected} label = {cty.label} />,  
                    value: val,
                    fill: selected? 'var(--peach)'  : colorScale? colorScale(val): '',
                    trueValue: val + '%'

                }
            })
        }
        if(race && county && distribute){
            if(find(withRace, (o)=>{return o.id===county})){
                console.log('withRace bars already includes selected county, no need to replace last')
            }
            else{
                withRace[withRace.length-1] = {
                    label: <LabelComponent selected label = {countyLabels[county]} />,
                    value: indicators[indicator].counties[county][race][year],
                    fill: 'var(--peach)',
                }
            }
        }

        let expandDims, collapseDims
        if(this.props.hasRace){
            if(screen==='optimal'){
                expandDims = {width: 610, height: 515}
                collapseDims = {width: 610, height: 390}
                
            }
            else if(screen==='compact'){
                expandDims = {width: 480, height: 390}
                collapseDims = {width: 480, height: 280}
                
            }
        }
        else{ //no race, take up entirety of breakdown space
            if(screen==='optimal'){
                expandDims = {width: 610, height: 575}
                collapseDims = {width: 610, height: 575}
                
            }
            else if(screen==='compact'){
                expandDims = {width: 480, height: 450}
                collapseDims = {width: 480, height: 450}
                
            }
        }

        const modes = {
            collapsed: collapseDims,
            expanded: expandDims,
            sources: {width: 270, height: 50}
        }
        console.log(modes)
        return (
            <Wrapper offset = {this.props.sources}>

            <Graph
                expandable
                // withScroll = {!this.props.sources && this.props.expand? true : false}
                withScroll
                currentMode = {this.props.sources? 'sources' : this.props.expand? 'expanded' : 'collapsed'}
                modes = {modes}
                duration = {this.props.sources? .35 : .35}

                borderColor = {this.props.sources? 'var(--fainttext)':''}
                
                selected = {county}
                selectable
                beefyPadding
                header = {(<HeaderComponent 
                    sources = {this.props.sources}
                    race = {race} 
                    distribute = {distribute}
                    setOverviewSort = {this.setOverviewSort}
                    sortOverviewBy = {this.sortOverviewBy}
                />)}

                labelWidth = {this.sortOverviewBy==='pop'? 180 : 150}
                bars = {race? withRace : performance}
                average = {ind.counties.california[race||'totals'][year]}
                selectBar = {(id)=>{console.log(id); this.props.store.completeWorkflow('county',id)}}
                footer = {(
                    <FooterComponent
                        offset = {this.props.expand}
                        onClick = {this.props.toggleDistribute}
                        hide = {this.props.sources}
                    />
                )}
                fullHeight = {this.props.expand}
            />
            </Wrapper>
        )
    }
}

const Wrapper = styled.div`
    position: relative;
    z-index: 10;
    transform: translateY(${props=>props.offset? '-25px' : 0});
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    //this needs z-index adjustment to sit atop demo when it's in btn mode
`

const HeaderComponent = (props) => {
    return(
        <Header
            offset = {props.sources}
        >
            <BackArrow 
                img = 'chevleft' 
                sources = {props.sources} 
                color = 'normtext'
            />
            <HeaderTitle hasRace = {props.race} sources = {props.sources}>
            {!props.sources && props.race && props.race === 'other' && 'In counties with the most children of other races'}
            {!props.sources && props.race && props.race !== 'other' && `In counties with the most ${capitalize(props.race)} children`}
            {!props.sources && !props.race && props.distribute && 'County overview'}
            {!props.sources && !props.race && !props.distribute && 'All counties'}
            {props.sources && 'County overview'}
            </HeaderTitle>
            {!props.race &&
                <HeaderToggle
                    hide = {props.sources}
                    offset = {!props.distribute}
                    options = {[
                        {label: 'by %', value: 'pct'},
                        {label: 'by Child Population', value: 'pop'}
                    ]}
                    theme = "bw"
                    onClick = {props.setOverviewSort}
                    selected = {props.sortOverviewBy === 'pct'? 0 : 1}
                />
        }
        </Header>
    )
}
const FooterComponent = (props) => {
    return(
        <Footer 
            offset = {props.offset}
            hide = {props.hide}
        >
            <ExpandBox
                currentMode = {props.hide? 'sources' : !props.offset? 'expanded' : 'collapsed'}
                modes = {{
                    expanded: {width: 160, height: 33},
                    collapsed: {width: 112, height: 33},
                    sources: {width: 0, height: 33}
                }}
                borderColor = 'var(--fainttext)'
            >
                <ExpandButton 
                    onClick = {props.onClick} 
                    label = {(
                        <React.Fragment>
                            {!props.offset && 'See all counties'}
                            {props.offset && 'See less'}
                            <Sprite 
                                style = {{
                                    marginLeft: '9px',
                                    width: '18px',
                                    height: '18px'
                                }}
                                img = "chevsprite" 
                                color = "normtext" 
                                state = {props.offset? 'up' : 'down'} 
                            />
                        </React.Fragment>
                    )}
                    className = 'compact borderless' 
                />
            </ExpandBox>
        </Footer> 
    )
}
const ExpandButton = styled(Button)`
    margin-top: 1px;
    &:hover{
        .sprite-chevsprite{
            fill: var(--strokepeach);
        }
    }
`
const headerfooter = styled.div`
    display: inline-flex; align-items: center; 
    height: 3px;
    margin: 0 20px;
    /*background: var(--offwhitefg);*/
`
const Header = styled(headerfooter)`
&::before{
    /*content: '';*/
    position: absolute;
    width: 100%;
    height: 50px;
    /*border: 1px solid red;*/
    background: white;
}
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(${props=>props.offset?'25px':0});
`
const BackArrow = styled(Icon)`
    display: ${props => props.sources? 'block' : 'none'};
    width: 18px; height: 18px;
    /*border: 1px solid red;*/
    position: absolute;
    z-index: 5;
`
const HeaderTitle = styled.div`
    width: ${props => !props.sources && !props.hasRace? '130px' : 'auto'};
    position: relative;
    height: 2px;
    padding: 0 15px;
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    background: var(--offwhitefg);
    transition: transform .35s;
    transform: translateX(${props=>props.sources? '10px':0});
`
const HeaderToggle = styled(Toggle)`
    /*margin-left: 15px;*/
    position: relative;
    &::before{
        position: absolute;
        content: '';
        width: 15px;
        right: -15px;
        top: 0; bottom: 0; margin: auto;
        height: 2px;
        background-color: var(--offwhitefg);
    }
    transform: translateX(${props=>props.coverTitle? -125 : props.offset? -35 : 0}px);
    transition: opacity .35s, transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    opacity: ${props =>props.hide? 0 : 1};
`
const Footer = styled(headerfooter)`
    /*bottom: -1px; right: 182px;*/
    position: absolute;
    width: 192px;
    right: 0px;
    padding: 0 15px;
    opacity: ${props => props.hide? 0 : 1};
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .35s;
    transform: translateX(${props=>props.hide?'-100%': props.offset?'48px':0});
    &::before{
        position: absolute;
        content: '';
        width: 100%;
        left: 0;
        height: 3px;
        background: var(--offwhitefg);
        transform: scaleX(${props=>props.offset?0.75 : 1});
        transform-origin: 0 0;
        transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
`
const Prompt = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 10px;
    opacity: ${props => props.visible? 1 : 0};
`



const SelectedNum = styled.span`
    color: var(--peach);
    margin-right: 4px;
`
const SelectedCounty = styled.span`
    color: var(--strokepeach);
`


const LabelComponent = (props) => {
    return(
        <RowLabel selected = {props.selected}>
            <FaintLeft selected = {props.selected}>
                {props.left}
            </FaintLeft>
            {props.label}
            <FaintRight selected = {props.selected}>
                {props.right}
            </FaintRight>
        </RowLabel>    
    )
}
const RowLabel = styled.span`
    color: ${props => props.selected? 'var(--strokepeach)' : 'var(--normtext)'};
`
const Faint = styled.span`
    color: ${props => props.selected? 'var(--peach)' : 'var(--fainttext)'};
`
const FaintLeft = styled(Faint)`
    margin-right: 5px;
`
const FaintRight = styled(Faint)`
    margin-left: 5px;
`
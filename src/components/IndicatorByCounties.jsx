
import React, {Fragment} from 'react'
import {observable, action, autorun} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find, findIndex} from 'lodash'
import commaNumber from 'comma-number'
import IntersectionObserver from '@researchgate/react-intersection-observer'

import {counties} from '../assets/counties'
import countyLabels from '../assets/countyLabels'
import indicators from '../data/indicators'
import demopop from '../data/demographicsAndPopulation'
import semanticTitles from '../assets/semanticTitles'

import {capitalize} from '../utilities/toLowerCase'
import {truncateNum} from '../utilities/sigFig'
import media from '../utilities/media'

import ordinal from 'ordinal'

import Graph from './HorizontalBarGraph'
import Icon, {Sprite} from './generic/Icon'
import {Button,Toggle} from './generic'
import ExpandBox from './ExpandBox'


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

    // mobile-only: track header or footer visibility when in allcounties mode
    @observable mobileXmode = 'header'
    @observable animateFixedXFrom = ''
    @observable animateFooterXFrom = ''
    @action setMobileIntersect = (val, coords) =>{
        if(this.props.store.screen !== 'mobile') return
        const lastVal = this.mobileXmode
        console.log('mobile X is now', val)
        this.mobileXmode = val
        //scrolling down
        // if(lastVal === 'header' && val === 'fixed'){
        //     //build animation from headerX coords to fixedX coords 
        //     this.animateFixedXFrom = coords
        //     console.log('animate fixed x from', coords)

        // }
        // if(lastVal === 'fixed' && val === 'footer'){
        //     //build animation from diff of fixedX coords and footerX coords, to footerX coords
        //     // const fixedXCoords = this.
        //     // this.animateFooterXFrom = 
        // }
        // //going back up
        // if(lastVal === 'footer' && val === 'fixed'){

        // }
        // if(lastVal === 'fixed' && val === 'header'){

        // }
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
            if(!indicator) return
            this.calculatePerformance()
            this.generateDistribution()
        })
        // this.averageTweeners()
    }

    


    render(){

        const {county, race, year, indicator, completeWorkflow, colorScale, screen, setHover, hoveredCounty} = this.props.store
        let {performance} = this 
        const ind = indicators[indicator]
        const unstable = ind.categories.includes('unstable')

        const distribute = !this.props.expand

        let maxNumRows = !race? performance.length : 0

        const width = window.innerWidth - 50

        if(this.sortOverviewBy === 'pop'){
            performance = performance.sort((a,b)=>{
                if(Number(a.population) > Number(b.population)) return -1 
                else if(Number(b.population) > Number(a.population)) return 1
                else return 0
            }).slice(0,distribute?this.props.entries:performance.length)
            .map((e)=>{
                console.log(e)
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
        }).filter((e,i)=>{
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
            maxNumRows = withRace.length
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

        // let expandDims, collapseDims, noRaceExpandDims, noRaceCollapseDims
        let modes
        if(screen==='optimal'){
            modes = {
                optimalExpanded: {width: 610, height: 515},
                optimalCollapsed: {width: 610, height: 390},
                optimalNoRaceExpanded: {width: 610, height: 575},
                optimalNoRaceCollapsed: {width: 610, height: 575},
                optimalsources: {width: 370, height: 50}
            }
        }
        else if(screen==='compact'){
            modes = {
                compactExpanded: {width: 480, height: 390},
                compactCollapsed: {width: 480, height: 280},
                compactNoRaceExpanded: {width: 480, height: 450},
                compactNoRaceCollapsed: {width: 480, height: 450},
                compactsources: {width: 370, height: 50}
            }
        }
        else if(screen==='mobile'){
            modes = {
                mobileExpanded: {width:width, height: 100+(maxNumRows*23)},
                mobileCollapsed: {width:width, height: 285},
                mobileNoRaceExpanded: {width:width, height: 100+(maxNumRows*23)},
                mobileNoRaceCollapsed: {width:width, height: 360},
                mobilesources: {width:width, height: 50}
            }
        }

        console.log('indbycounties max:')
        console.log(maxNumRows)

        // const modes = {
        //     collapsed: collapseDims,
        //     expanded: expandDims,
        //     noraceexpanded: noRaceExpandDims,
        //     noracecollapsed: noRaceCollapseDims,
        //     sources: {width: 370, height: 50}
        // }
        console.log(modes)
        return (
            <React.Fragment>
            <Wrapper offset = {this.props.sources}>

            <Graph
                expandable
                withScroll = {screen!=='mobile'}
                noFade = {screen==='mobile'}

                hideScroll = {distribute || this.props.sources}
                currentMode = { 
                    this.props.sources? screen + 'sources' : 
                    !this.props.hasRace && this.props.expand? screen + 'NoRaceExpanded' :
                    !this.props.hasRace && !this.props.expand? screen + 'NoRaceCollapsed' :
                    this.props.expand? screen + 'Expanded' : 
                    screen + 'Collapsed'
                }
                modes = {modes}
                duration = {screen==='mobile'? 0 : this.props.sources? .5 : .35}

                onHoverRow = {screen!=='mobile'? (val)=>{setHover('county',val)} : ()=>{} }
                hovered = {screen==='mobile'? null : hoveredCounty}

                borderColor = {this.props.sources? 'var(--fainttext)':''}
                
                selected = {county}
                selectable
                beefyPadding
                header = {(
                    <HeaderComponent 
                        screen = {screen}
                        sources = {this.props.sources}
                        race = {race} 
                        distribute = {distribute}
                        setOverviewSort = {this.setOverviewSort}
                        sortOverviewBy = {this.sortOverviewBy}
                        setSourcesMode = {this.props.store.setSourcesMode}

                        //mobile intersect stuff
                        onExitView = {(tf)=>this.setMobileIntersect(tf?'header':'fixed')}
                        renderMobileX = {this.mobileXmode === 'header' && !distribute}
                        toggleDistribute = {this.props.toggleDistribute}
                    />
                )}

                hideGraph = {this.props.sources}

                labelWidth = {screen === 'mobile' && this.sortOverviewBy === 'pop'? 145 : screen === 'mobile'? 125 : this.sortOverviewBy==='pop'? 180 : 150}
                bars = {race? withRace : performance}
                average = {ind.counties.california[race||'totals'][year]}
                selectBar = {(id)=>{console.log(id); this.props.store.completeWorkflow('county',id)}}
                footer = {(
                    <FooterComponent
                        mobile = {screen==='mobile'}
                        offset = {this.props.expand}
                        onClick = {this.props.toggleDistribute}
                        hide = {this.props.sources}

                        onEnterView = {(tf)=>this.setMobileIntersect(tf?'footer' : 'fixed')}
                        renderMobileX = {this.mobileXmode === 'footer'}
                    />
                )}
                fullHeight = {this.props.expand}
            />

            </Wrapper>
            <FixedMobileX 
                visible = {this.mobileXmode === 'fixed' && !distribute}
                onClick = {this.props.toggleDistribute}
                // animateFrom = {}
            >
                <XIcon img = "x" color = "bordergrey" /> 
            </FixedMobileX>
            
            </React.Fragment>
        )
    }
}
const MobileX = styled.div`
    position: absolute;
    display: flex; align-items: center; justify-content: center;
    right: -45px;
    height: 35px;
    width: 35px;
    background: var(--offwhitefg);
    opacity: ${props => props.visible? 1 : 0};
    transition: transform .2s, opacity .125s;
`
const XIcon = styled(Icon)`
    width: 18px; height: 18px;
`
const FixedMobileX = styled(MobileX)`
    position: fixed;
    top: 90px; right: 18px;
    transform: scale(${props => props.visible? 1 : 0.6});

    z-index: 1000;
`

const Wrapper = styled.div`
    position: relative;
    z-index: 10;
    transform: translateY(${props=>props.offset? '-25px' : 0});
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    //this needs z-index adjustment to sit atop demo when it's in btn mode
`

@observer class HeaderComponent extends React.Component{
    constructor(props){
        super(props)
        if(props.screen === 'mobile'){
            this.mobileX = React.createRef()
        }
    }
    render(){
        const props = this.props
    return(
        <IntersectionObserver
            // make this a conditional wrapper for mobile only
            onChange = {props.screen === 'mobile'? (wat)=>{
                //this.mobileX.current.getBoundingClientRect()
                this.props.onExitView(wat.isIntersecting)
            }: ()=>{}}
            rootMargin = '-75px 0% 0% 0%'
        >
        <Header
            offset = {props.sources}
            buttonMode = {props.sources}
            onClick = {props.sources? ()=>{
                props.setSourcesMode(false)
            }:()=>{}}
        >

            <BackArrow 
                img = 'chevleft' 
                sources = {props.sources} 
                // color = 'normtext'
            />
            <HeaderTitle hasRace = {props.race} sources = {props.sources}>
                <FadeTitle show = {((props.sources && props.distribute) || (!props.race && props.distribute))}>
                    {props.screen !== 'mobile' && 'County overview'}
                    {props.screen==='mobile' && 'By counties'}
                </FadeTitle>
                <FadeTitle show = {((props.sources && !props.distribute) || (!props.race && !props.distribute))}>
                    All counties
                </FadeTitle>
                <FadeTitle show = {!props.sources && props.race} superLong>
                    {props.race === 'other' && props.screen !== 'mobile' && 'In counties with the most children of other races'}
                    {props.screen === 'mobile' && props.race === 'other' && 'By most children of other races'}
                    {!props.sources && props.race && props.race !== 'other' && props.screen!== 'mobile' && `In counties with the most ${capitalize(props.race)} children`}
                    {props.screen === 'mobile' && !props.sources && props.race && props.race !== 'other' && `Counties w/ most ${capitalize(props.race)} children`}
                </FadeTitle> 
            </HeaderTitle>
            <SourceString show = {props.sources}>
                / race breakdown
                <Minigraph img = "minigraph"  />
            </SourceString>
            {!props.race &&
                <HeaderToggle
                    hide = {props.sources}
                    offset = {!props.distribute}
                    options = {[
                        {label: props.screen==='mobile'? '%' : 'by %', value: 'pct'},
                        {label: props.screen === 'mobile'? 'pop.' :  'by Child Population', value: 'pop'}
                    ]}
                    theme = "bw"
                    onClick = {props.setOverviewSort}
                    selected = {props.sortOverviewBy === 'pct'? 0 : 1}
                />
            }
            {props.screen==='mobile' &&
                <MobileX 
                    ref = {this.mobileX}
                    // mode = {this.intersectsViewport? 'header' : 'fixed'} //header, fixed, footer

                    visible = {((props.sources && !props.distribute) || (!props.race && !props.distribute))}
                > 
                    <XIcon img = "x" color = "bordergrey" onClick = {this.props.toggleDistribute} /> 
                </MobileX>
            }
        </Header>
        </IntersectionObserver>
    )
}
}

//on mode change, get boundingclientrect and use it to build a keyframe transition...?




const SourceString = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    white-space: nowrap;
    left: 158px;
    z-index: 10;
    opacity: ${props=>props.show? 1 : 0};
    pointer-events: ${props => props.show? 'auto' : 'none'};
    transition: opacity .2s;
    transition-delay: ${props=>props.show? '.15s' : '0s'};
`
const Minigraph = styled(Icon)`
    width: 30px; height: 30px;
    margin-left: 10px;
`
class FooterComponent extends React.Component{
    render(){
    const props = this.props
    return(
        <IntersectionObserver
            onChange = {(wat)=>{
                if(props.mobile && props.offset){
                    if(wat.isIntersecting) props.onEnterView(true)
                    else if(props.renderMobileX) props.onEnterView(false)
                }
            }}
            rootMargin = '0px 0px -100px 0px'
        >
        <Footer 
            offset = {!props.mobile? props.offset : 0}
            hide = {props.hide}
        >
            <ExpandBox
                currentMode = {(props.mobile? 'mobile' : '')+(!props.offset? 'expanded' : 'collapsed')}
                modes = {{
                    expanded: {width: 160, height: 33},
                    mobileexpanded: {width: 100, height: 33},
                    collapsed: {width: 112, height: 33},
                    mobilecollapsed: {width: 112, height: 33},
                }}
                borderColor = 'var(--fainttext)'
            >
                <ExpandButton 
                    onClick = {props.onClick} 
                    label = {(
                        <React.Fragment>
                            {!props.offset && !props.mobile && 'See all counties'}
                            {!props.offset && props.mobile && 'See all'}
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
        </IntersectionObserver>
    )
    }
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
    @media ${media.mobile}{
        margin: 0 15px;
    }
    /*background: var(--offwhitefg);*/
`
const Header = styled(headerfooter)`
&::before{
    content: '';
    position: absolute;
    width: 369px;
    height: 48px; margin-top: 1px;
    left: -19px;
    pointer-events: ${props=>props.buttonMode? 'auto' : 'none'};
    background: white;
    opacity: ${props=>props.buttonMode? 1 : 0};
    transition: opacity .25s ${props =>props.buttonMode? '.25s' : 0};
}
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(${props=>props.offset?'25px':0});
    cursor: ${props => props.buttonMode? 'pointer' : 'auto'};
    fill: var(--normtext);
    ${props=>props.buttonMode?
        `
            &:hover{
                color: var(--strokepeach);
                fill: var(--strokepeach);
            }
        ` 
        : ''
    }
`
const BackArrow = styled(Icon)`
    width: 18px; height: 18px;
    opacity: ${props=>props.sources?1:0};
    transition: opacity .35s, transform .35s;
    transform: translateX(${props=>props.sources? 0 : 10}px);
    /*border: 1px solid red;*/
    position: absolute;
    z-index: 5;
`
const HeaderTitle = styled.div`
    width: ${props => props.sources || !props.hasRace? '130px' : '315px'};
    @media ${media.mobile}{
         width: ${props => props.sources || !props.hasRace? '90px' : '212px'};
    }
    position: relative;
    height: 10px;
    padding: 0 15px;
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    background: var(--offwhitefg);
    transition: transform .35s;
    transform: translateX(${props=>props.sources? '10px':0});
`
const FadeTitle = styled.span`
    position: absolute;
    left: 15px;
    opacity: ${props=>props.show? 1 : 0};
    transition: opacity .15s;
    transition-delay: ${props=>props.show?'.15s':'0s'};
    white-space: nowrap;
    @media ${media.mobile}{
        font-size: ${props => props.superLong? '14px' : '16px'};
        letter-spacing: ${props => props.superLong? '0.4' : '0.6'}px;
    }
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
    transform: translateX(${props=> props.offset? -35 : 0}px);
    @media ${media.mobile}{
        transform: translateX(${props=> props.offset? 0 : 0}px);
    }
    transition: opacity .35s, transform .35s cubic-bezier(0.215, 0.61, 0.355, 1);
    opacity: ${props =>props.hide? 0 : 1};
    transition-delay: ${props => props.hide? '0s' : '0.15s'};
    pointer-events: ${props=>props.hide?'none':'auto'};
    z-index: 15;
`
const Footer = styled(headerfooter)`
    /*bottom: -1px; right: 182px;*/
    position: absolute;
    width: 192px;
    @media ${media.mobile}{
        width: 130px;
    }
    right: 0px;
    padding: 0 15px;
    opacity: ${props => props.hide? 0 : 1};
    pointer-events: ${props => props.hide? 'none' : 'auto'};
    transition: transform .35s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .35s;
    transform: translateX(${props=>props.hide? '-75%' : props.offset?'48px':0});
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
        <RowLabel {...props}>
            <FaintLeft {...props}>
                {props.left}
            </FaintLeft>
            {props.label}
            <FaintRight {...props}>
                {props.right}
            </FaintRight>
        </RowLabel>    
    )
}
const RowLabel = styled.span`
    color: ${props => props.selected||props.hovered? 'var(--strokepeach)' : 'var(--normtext)'};
`
const Faint = styled.span`
    color: ${props => props.selected||props.hovered? 'var(--peach)' : 'var(--fainttext)'};
`
const FaintLeft = styled(Faint)`
    margin-right: 5px;
`
const FaintRight = styled(Faint)`
    margin-left: 5px;
`
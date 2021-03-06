import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import styled, {css} from 'styled-components'

import {isEqual, map, debounce} from 'lodash'
import chroma from 'chroma-js'
import FlipMove from 'react-flip-move'

import {Tooltip} from './generic/'

import demopop from '../data/demographicsAndPopulation'
import countyLabels from '../assets/countyLabels'
import indicators from '../data/indicators'
// import semanticTitles from '../assets/semanticTitles'
import {capitalize} from '../utilities/toLowerCase'
import media from '../utilities/media'

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
` 
const TheMap = styled.svg`
    position: absolute;
    right: 0;
    /*transition: transform .5s;*/
    /*transform-origin: 50% 50%;*/
`

const CountyStyle = css`
    cursor: pointer;
    stroke: ${props => props.highlighted?'var(--peach)': 'transparent'};
    stroke-width: ${props => props.selected? 3.5 : 3.5};
    @media ${media.mobile}{
        stroke-width: 2.25;
    }
`



const exemptPathIDs = ['svgMap', 'full', 'garbmask']

@observer class InteractiveMap extends React.Component{

    @observable targetCoords = {x: 0, y: 0}
    @observable defaultCoords = {x: 0, y: 0}
    @action updateCoords = (x, y, forDefault) => {
        if(!forDefault) this.targetCoords = {x: x, y: y}
        else this.defaultCoords = {x: x, y: y}
    }
    @observable defaultTooltip = null
        @action setDefaultTooltip = (val) => this.defaultTooltip = val

    componentDidUpdate(prevProps){

        if(!isEqual(this.props.colorStops, prevProps.colorStops) || this.props.colorInterpolation !== prevProps.colorInterpolation){
            console.log('color stop or colorinterp changed')
            this.updateColors()   
        }
        if(this.props.hoveredCounty !== prevProps.hoveredCounty){
            if(!this.props.hoveredCounty){
                this.toggleTooltip(false)
            }
            else if(this.props.hoveredCounty){
                const svgRect = document.getElementById('svgMap').getBoundingClientRect()
                this.toggleTooltip(true)
                const bbox = document.getElementById(this.props.hoveredCounty).getBoundingClientRect()
                const newX = (bbox.left + (bbox.width/2)) - svgRect.left
                const newY = (bbox.top) - svgRect.top
                this.updateCoords(newX, newY)
            }
        }
        else if(this.props.defaultHighlight && this.props.defaultHighlight !== prevProps.defaultHighlight){
                console.log('hello')
                // this.defaultTooltip = indicators[indicator].highlight
                this.setDefaultTooltip(this.props.defaultHighlight)
                const svgRect = document.getElementById('svgMap').getBoundingClientRect()
                const bbox = document.getElementById(this.props.defaultHighlight).getBoundingClientRect()
                const newX = (bbox.left + (bbox.width/2)) - svgRect.left
                const newY = (bbox.top) - svgRect.top

                this.updateCoords(newX, newY, true)
        }
        else if(!this.props.defaultHighlight){
            this.setDefaultTooltip(null)
        }
    }


    @observable tooltip = false
    @action toggleTooltip = (tf) => this.tooltip = tf

    handleClick(e, id){
        if(this.props.onSelect){ 
            console.log('made county selection from map:',id)
            if(exemptPathIDs.includes(id)){
                // this.props.clickedOutside()
                // ^ rendered unnecessary by click outside event listener for nav
            }
            else{
             this.props.onSelect('county', id)

             }
        }
        e.preventDefault()
         e.stopPropagation()
    }

    render(){
        const {store, colorStops, quantile, selected, hoveredCounty, ...domProps} = this.props
        const {indicator, colorScale, race, screen} = store

        const tooltipCty = hoveredCounty? hoveredCounty : this.defaultTooltip? this.defaultTooltip : ''

        let tipPopulation = tooltipCty? demopop[tooltipCty].population :  ''
        if(tipPopulation >= 1000000) tipPopulation = (tipPopulation/1000000).toFixed(1) + ' million'
        else if(tipPopulation >=1000) tipPopulation = (tipPopulation/1000).toFixed(1) + 'k'
        let tipData = this.props.data && tooltipCty? this.props.data[tooltipCty] : 'other'
        let noData = false

        let cty = countyLabels[tooltipCty]

        const semanticTitle = indicator? indicators[indicator].semantics : ''

        if(!tipData && tipData!==0){
            if(race){
                if(race==='other') `There's no data on ${semanticTitle.who} of other races in ${cty} for this indicator.`
                else tipData = `There's no data on ${capitalize(race)} ${semanticTitle.who} in ${cty} for this indicator.`
            }
            else tipData = `There's no data on ${cty} county for this indicator.`
            noData = true
        }
        else if(tipData === '*'){
            noData = true
            if(race){
                if(race==='other') tipData = `Indicator data on ${semanticTitle.who} of other races in ${cty} is too small or unstable to display.`
                else tipData = `Indicator data on ${capitalize(race)} ${semanticTitle.who} in ${cty} is too small or unstable to display.`
            }
            else tipData = `Indicator data on ${cty} is too small or unstable to display.`
        }
        else tipData += '%'
        
        return(
            <Wrapper 
                onClick = {(e)=>this.handleClick(e, store.county === e.target.id? null : e.target.id)}
            >
                {this.props.data && this.defaultTooltip && !this.tooltip && !selected && store.screen!=='mobile' &&
                    <Tooltip 
                        key = {this.defaultTooltip}
                        pos = {this.defaultCoords}
                        style = {{pointerEvents: 'none'}}
                    >
                        <Tip>
                            <div>
                                <h2>{cty}</h2>
                                <Subtip>{tipPopulation} children</Subtip>
                            </div>
                            {this.props.data &&
                            <div>
                                <Tipnum>{tipData}</Tipnum>
                            </div>
                            }
                        </Tip>
                    </Tooltip>
                }
                {this.tooltip && store.screen!=='mobile' &&
                    <Tooltip
                        key = {hoveredCounty}
                        pos = {this.targetCoords}
                        style = {{pointerEvents: 'none'}}
                    >
                    {!noData &&
                        <Tip>
                            <div>
                                <h2>{cty}</h2>
                                <Subtip>{tipPopulation} children</Subtip>
                            </div>
                            {this.props.data &&
                            <div>
                                <Tipnum>{tipData}</Tipnum>
                            </div>
                            }
                        </Tip>
                    }
                    {noData &&
                        <NoDataTip>
                            {tipData}
                        </NoDataTip>
                    }
                    </Tooltip>
                }
                <TheMap 
                    id = "svgMap"
                    viewBox = '5 14 510 615'
                    {...domProps}
                    version="1.1"

                    // zoomable = {this.props.zoomable}
                    // zoomOrigin = {this.zoomOrigin}
                    // zoomed = {this.props.zoom}

                >
                    {this.props.children.map((child,i)=>{
                        const InteractivePolygonOrPath = child.props.id === 'full'? SVGComponents.full : exemptPathIDs.includes(child.props.id)? SVGComponents.garb : SVGComponents['Interactive'+child.type.charAt(0).toUpperCase() + child.type.slice(1)]
                        const {data} = this.props
                        const { points, d, id, ...childProps } = child.props
                        const wire = !data && this.props.mode === 'offset'
                        const fill = wire? 'var(--offwhitefg)' : data[id]!=='' && data[id]!=='*'? store.colorScale(data[id]) : 'var(--inactivegrey)' // TODO

                        const foistProps = !exemptPathIDs.includes(id) && child.type !== 'polyline'? { //props that don't apply to full or outlinebox
                            style: {
                                fill: selected===id? 'var(--peach)' : fill,
                                transition: selected===id? 'fill 0.1s' : data? `fill ${0.1+i*0.02}s, stroke 0s` : 'fill .25s'
                            },
                            // 'data-tip': data[id]==='*'? `${countyLabels[id]} county's data set is too small or unstable.` : !data[id]? `${countyLabels[id]} has no data` : `${countyLabels[id]}: ${data[id]}%`,
                            selected: selected===id,
                            highlighted: this.highlighted===id || this.props.hoveredCounty===id || (!selected && !this.props.hoveredCounty && this.defaultTooltip === id),
                            // onClick: ()=> this.handleClick(id)
                        } : {}
                        
                        const hoverActions = screen!=='mobile' && this.props.onHoverCounty && !exemptPathIDs.includes(id)? {
                            onMouseEnter: ()=> this.props.onHoverCounty(id),
                            onMouseLeave: ()=> this.props.onHoverCounty(),
                        }: {}

                        return(
                            <InteractivePolygonOrPath
                                {...childProps}
                                {...foistProps}
                                id = {id}
                                key = {id}
                                points = {points}
                                d = {d}
                                wire = {wire}
                                offset = {this.props.mode === 'offset'}

                                onTransitionEnd = {i===this.props.children.length-1? ()=>{console.log('end of transitions')} : ()=>{}}
                                {...hoverActions}
                            />
                        )
                    })}
                </TheMap>
            </Wrapper>
        )
    }
}

InteractiveMap.defaultProps = {
    colorStops: ['#CDFCFE','#135F80',],
    colorInterpolation: 'hcl',
    quantile: false,
    clickedOutside: ()=>{console.log('clicked map container but no county')}
}

const Tip = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
`
const NoDataTip = styled.div`
    width: 200px;
    white-space: wrap;
    font-size: 13px;
    display: flex;
    justify-content: center;
`
const Subtip = styled.h3`
    margin-top: -3px;
`
const Tipnum = styled.h1`
    padding-left: 20px;
    color: ${props => props.faint? 'var(--fainttext)' : 'white'};
`


let SVGComponents = {
    InteractivePolygon: (props) => <CountyPolygon {...props} />,
    InteractivePath: (props) => <CountyPath {...props}  />,
    full: (props) => <FullState {...props} />,
    garb: (props) => <GarbMask {...props} />
}

const CountyPolygon = styled.polygon`${CountyStyle}`
const CountyPath = styled.path`${CountyStyle}`
const FullState = styled.polygon`
    opacity: ${props => props.wire? 1 : 0};
    transition: opacity ${props => props.wire? 1 : 0.25}s;
    fill: black;
    stroke: black;
    stroke-width: 2;
`
const GarbMask = styled.polygon`
    fill: var(--offwhitefg);
    transition: opacity .5s;
    @media ${media.smallphone}{
        transform: translate(-10px, 10px);
    }
`

export default class CaliforniaCountyMap extends React.Component{
    render(){
        return(
            <React.Fragment>
            <InteractiveMap
                {...this.props}
            >
            
            <polygon style = {{opacity: this.props.garbMask? 1 : 0}} 
                id = 'garbmask' 
                points="289.3,16 289.3,194 520,398.7 565,482 537,600 336,622 306,548 162,495 -19,127 -19,16 "
            />
            
            <polygon id = "full" points="505.2,481.5 496.9,475 490.7,459.8 483,450.4 483,443 434.6,395.8 331.5,298.4 246.6,221.5 
    246.6,221.4 231.5,208 231.5,207.9 226.8,199.7 226.7,199.7 226.5,184.5 226.6,184.5 226.7,176.6 226.6,176.5 226.7,159.4 
    226.8,159.3 226.8,67.6 226.8,16 20.2,16 22.3,24.6 19.5,30.4 25.8,36 29.4,49.8 24.3,58.3 28.2,60.9 24,72.8 27.2,79.3 25.7,85.2 
    13.2,113.3 15.5,126.4 29.4,141.9 29.4,141.9 40.1,154.6 43.8,170.1 41,183.2 47.3,201.5 46.2,210.5 53.4,218.7 53.4,218.7 
    53.4,218.7 53.5,218.8 53.5,218.8 59.8,224.2 66.3,233.9 73.1,238.1 77.2,246.9 82.8,255.9 79.4,264.5 81.1,268.2 88.2,266.4 
    102.1,276.3 106,275.7 104.7,269.7 106.8,266 103.9,264.2 106.8,258.8 106.7,258.7 108.7,253.3 114.6,253.2 114.6,253.3 
    115.6,255.4 116.2,255.4 118,260.2 129.3,256.2 133.9,260.4 137.9,260.9 145.3,259.5 145.4,259.4 151.3,259.1 146.6,260.7 
    142.1,264.4 125.5,262.7 114.2,265.6 110.7,269.2 113.6,271.9 117.9,282.5 127.6,296.2 127.4,296.4 124.6,297.7 124,298.8 
    123.9,298.9 112.3,289.9 111.8,283.7 112.3,283.7 109,277.3 104.3,278.3 103.9,283.8 104.2,293.9 109.2,304 108.5,311.3 
    113.5,321.1 116.3,321.8 116.3,321.8 127.7,330.4 133.7,329.7 137.1,333.9 137.8,339.9 131,346.2 128.9,349.5 132.9,367.2 
    142.3,375.2 149.2,386.4 157.9,396.6 158,396.8 163.5,406.8 169.3,409.2 176.9,418.8 182.1,420.4 180.7,428.7 185.3,434.7 
    193.7,437.5 193.1,443.3 193.2,443.4 191.8,448.9 194.6,452.5 195.1,460.8 192.8,468.2 205,478.4 213.1,477 225.6,477.4 
    240.4,481.6 250.6,482.2 258.6,487.4 264.1,497.4 276.8,501.5 283.4,504 295.7,501.7 301.1,510.3 300,516.8 305.8,520.4 
    316.3,518.5 340.9,539.3 349.4,548 354.8,563.7 354.9,575.8 360.4,584.9 412.7,579.9 412.7,580 478.8,574.4 488,572.1 491.1,563.5 
    488.3,556.6 479.5,553.3 480.5,542.6 478.6,535.4 483.3,533.6 483.2,533.4 483.5,533.4 488.3,526.7 489.7,518.4 487.8,505.2 
    492.4,496.5 492.5,496.5 506.9,486.2 "/>
<polygon id = "sierra" points="201.7,174.7 223.2,175.9 226.1,175.9 226.2,160 219.9,160.9 195.4,161.2 185.4,156.7 181.6,163.1 
    179.3,164.8 178.7,178.9 189.2,175.8 190.6,175.2 190.8,175.1 198.8,171 199.3,171.1 199.9,171.1 199.9,171.6 "/>
<polygon id = "sacramento" points="173,222.1 172.4,222.2 172.3,222.2 156,220.8 150.7,220.7 149.5,222.6 155.2,231.9 154.8,243.2 
    151.2,246.3 150.3,253.2 146.4,258.8 151,258.6 156,249.2 159.7,250.2 176.8,246.5 177,246.3 177.2,246.2 177.2,234.2 "/>
<polygon id = "santaBarbara" points="252.9,449.5 251.8,449.5 238.8,445.2 223.1,437.2 218,441.9 212.1,442.7 213.4,449.8 205.9,444.5 
    196.4,446.1 193.6,444.1 192.4,448.8 195.2,452.3 195.7,460.9 193.5,468 205.2,477.8 213,476.4 213.1,476.4 225.8,476.8 240.5,481 
    250.2,481.5 252.9,475 "/>
<polygon id = "calaveras" points="180,251.5 183.1,259.9 195.7,274.2 204.3,263.9 210.6,252.8 217.7,242.3 225,238.3 223.1,234.5 
    206,237.3 196.9,244.8 "/>
<polygon id = "ventura" points="289.9,490.8 291.3,484.4 279.8,455.9 262.5,454.5 260.9,450.7 254.1,449.6 254.1,475.2 251.4,481.9 
    259.1,486.9 264.5,496.9 276.3,500.7 276.6,498.1 284.4,490.8 "/>
<polygon id = "losAngeles" points="332.2,503.5 338.5,484.6 337.6,454.1 334.3,454 281.8,454.3 280.9,455.5 292.6,484.2 290.8,492 
    284.9,492 277.7,498.7 277.5,501.1 283.5,503.4 296,501.1 301.8,510.2 300.7,516.5 306,519.7 315.9,517.9 323.1,503.5 "/>
<polygon id = "sonoma" points="113.7,252.6 100.9,224.6 95.1,217.2 91.8,213.7 80,213.6 77.4,216.2 54.9,219.1 60.3,223.8 66.8,233.4 
    73.6,237.7 77.5,246.2 86.9,245.2 96.3,251.7 103.8,252.9 104.8,253.9 106.6,257.3 108.3,252.7 "/>
<polygon id = "kings" points="247.2,356.4 243,360.3 229.4,361.3 229.4,374 212.6,390 216.9,396.2 248.3,396.2 248.4,377.1 
    251.2,360.9 "/>
<polygon id = "sanDiego" points="358.5,534.3 358.4,534.3 346,530.1 341.6,539.2 349.7,547.8 355.2,563.8 355.4,575.7 360.6,584.4 
    412.1,579.4 413,534.6 "/>
<polygon id = "placer" points="215.3,201.9 226.1,199.3 225.9,185 196.2,185.1 188.1,190.4 180.4,197.4 178.1,202.2 173.4,203.1 
    167.5,203.1 165.8,202.4 159.7,204.7 157.3,208.7 156.6,219.7 172,221 176.7,208.6 192.1,203 199.5,208.4 205.8,201.5 "/>
<polygon id = "sanFrancisco" points="111.3,283.1 108.7,278 104.9,278.8 104.5,283.2 "/>
<polygon id = "marin" points="88.4,265.6 102.3,275.5 105.3,275.1 104.1,269.5 105.9,266.1 103.1,264.4 106.1,258.8 103.2,254.1 
    95.8,252.9 86.6,246.5 78.2,247.4 83.5,255.8 80.2,264.4 81.5,267.4 "/>
<polygon id = "mariposa" points="243.1,299.4 246.2,291.1 258.9,278.4 247.7,271.7 243.1,277.4 229.3,279.8 223.8,276.3 221.3,278.4 
    217.5,279.7 214.5,281.6 213.3,281 211.8,281.9 211.5,283.3 208.7,284.6 208.9,286.9 218.8,309 224.3,313.3 237.9,299.4 "/>
<polygon id = "lassen" points="226.2,68.2 163.8,68.2 164,113.6 176.7,113.5 177.7,127 185,128.9 190.1,121.6 199.6,123.6 
    210.8,134.3 217.2,136.2 222.3,145.7 220.5,159.6 226.2,158.8 "/>
<polygon id = "napa" points="127.5,245.2 125.9,233.9 121.1,223.3 117.1,214.2 112.9,213 109.7,222.5 102.3,224.7 115.2,253 
    116,254.7 119.5,254.8 121,245.2 "/>
<polygon id = "shasta" points="97.1,119.7 106.4,117.2 122.9,117.7 125.6,116 141.9,114.1 146.3,113.1 155.4,113.5 162.8,113.6 
    162.6,68.2 157.7,68.2 109.5,68.3 110.8,69.1 96.7,100.3 96.9,100.7 98.7,106.7 84.2,117.7 81.6,123.1 85.1,122 86,122.1 
    86.8,122.1 87.8,121.7 "/>
<polygon id = "monterey" points="133.7,366.8 143.1,374.8 150,386 158.5,395.9 215.4,396.2 211.3,390.4 210.4,389.5 207.9,386.8 
    203,384 195.2,378.4 195.1,374.3 193.9,369 192.6,368 192.3,367.9 193.3,369.6 193.8,372.8 192.5,373.4 191.3,373 186.5,368.9 
    185.3,367.8 182,368.2 178.6,369.3 176.8,368.7 176.5,365.6 167.2,355.1 163.7,355.2 162.2,347.1 155.9,343.6 155.9,343.3 
    155.6,343.2 155.4,342.1 156.8,341.3 156.7,341.1 148.1,332 137.8,334.4 138.5,340.2 131.8,346.4 129.9,349.5 "/>
<polygon id = "trinity" points="95.3,100.3 109.3,69.6 107,68 106.7,57.9 103.5,57.1 85.7,72.3 89.5,77.9 81.8,79.6 71.8,75 64.7,69.1 
    64.1,78.9 61,85.2 55.6,86.6 58.2,95.7 58.2,142.9 86.1,142.8 84.1,127.3 80.2,125.1 79.8,124.1 83.3,116.9 97.3,106.2 95.8,101.1 
    "/>
<polygon id = "mendocino" points="89.6,212.4 85.7,210.4 78.5,199.5 83.2,189.3 79.4,178.8 80.1,172.4 88.3,170.8 88.4,168.2 86,154.7 
    85,151.5 87.2,146 86.4,144 57,144.1 57,142.5 30.7,142.5 40.7,154.3 44.4,170 41.6,183.1 47.9,201.4 46.8,210.2 53.7,218.1 
    76.8,215.1 79.5,212.4 "/>
<polygon id = "inyo" points="403,396 430.3,396 433.3,395.3 330,297.8 285.9,297.9 285.4,304.2 291.1,309 294.6,316.5 301.4,320.5 
    305.7,331.7 305,336.9 305.6,340.2 310.9,355.6 318.3,364.7 317.8,371.6 323.8,392.3 322.7,396.2 339.8,395.8 "/>
<polygon id = "mono" points="267.9,280.5 273.9,289.5 285.5,296.7 328.7,296.6 246.9,222.6 245.6,227.7 248.4,238.1 244.6,245.2 
    245.3,251.6 248.8,255.7 257,258.7 259.6,266.3 265.2,270.8 262.5,280.1 265.9,280.1 "/>
<polygon id = "tuolumne" points="258.6,267 256.1,259.7 248.1,256.7 244.1,252.1 243.4,245.3 240.5,240.3 232.3,243.9 225.8,239.2 
    218.5,243.2 211.6,253.4 205.2,264.6 196.5,275.1 207.6,285.6 207.5,283.9 210.4,282.5 210.8,281.1 213.3,279.7 214.4,280.2 
    217,278.6 220.8,277.3 223.6,274.8 229.6,278.5 242.4,276.3 247.4,270.1 260.3,277.9 261.5,279.4 263.8,271.2 "/>
<polygon id = "solano" points="117,255.9 118.4,259.5 129.4,255.6 134.1,259.8 137.8,260.3 144.9,258.9 149.2,252.8 150,246.5 
    145.3,246.4 144.9,233.2 127.1,234.3 128.9,246.4 122.1,246.4 121,255.8 "/>
<polygon id = "sanBernardino" points="449.8,495.9 450.4,495.9 492.2,495.8 506.1,485.9 504.7,481.8 496.4,475.3 496.3,475.2 490.1,460.1 
    482.3,450.6 482.4,443.2 434.3,396.3 430.4,397.2 403,397.2 340.4,397.1 340.5,454.1 338.8,454.1 339.7,484.8 333.3,503.9 
    337.3,507.2 337.3,507.1 343.1,498.5 352.1,498.9 372.8,500.1 372.8,498.4 449.8,498.4 "/>
<polygon id = "contraCosta" points="125.6,263.4 114.5,266.2 111.5,269.2 113.7,271.3 119.2,270.3 119.9,271.2 122.4,274 133.3,281.2 
    151.9,275.5 150.8,260 146.9,261.4 142.3,265.1 "/>
<polygon id = "alpine" points="244.3,227.8 245.9,221.7 232.7,209.9 233.3,211.8 224,222.4 224,233.7 226.3,238.1 232.4,242.6 
    240.9,238.7 244,243.9 247.1,238 "/>
<polygon id = "elDorado" points="223,221.7 232,211.5 230.9,208.2 226.4,200.4 215.4,203.1 206.3,202.7 199.6,210 191.9,204.3 
    177.6,209.6 173.4,220.7 173.8,220.6 178.2,233.3 185,231.5 192.1,230.6 191.9,231.2 196.9,233.7 204.4,232.5 212.1,231 "/>
<polygon id = "yolo" points="118,213.2 122.2,222.8 126.8,233.1 146,231.9 146.5,245.2 150.6,245.3 153.6,242.6 154,232.2 
    148.1,222.7 149.7,220 149,218.1 146.6,220.2 138.9,209.1 115.4,209.1 113.5,211.9 "/>
<polygon id = "yuba" points="165.2,189.5 172.8,180 177.5,179.2 178,165.8 175.9,167.5 172.3,171.9 163.6,175.5 160.1,183.4 
    149.9,186.1 149.8,187.2 151.9,207.5 159,203.6 165.2,201.4 "/>
<polygon id = "sanBenito" points="197.4,355.8 182.6,341 171.9,335.3 168.5,328 156,326.7 153.3,330.5 151.6,331.7 149.6,331.9 
    157.8,340.6 158.2,341.6 157.3,342.4 156.9,342.6 157,342.8 163.3,346.3 164.7,354 167.7,353.9 177.7,365.1 177.9,367.8 178.6,368 
    181.8,367 185.8,366.6 187.2,368 192,372 192.4,372.1 192.5,372.1 192.1,369.9 189,364.7 193.3,367 194.4,367.9 197.7,364.8 "/>
<polygon id = "humboldt" points="63.5,68 59.3,55.6 46.3,55.7 46.2,50.4 29.7,50.4 25.2,58.1 28.9,60.7 24.6,72.8 27.8,79.2 26.2,85.4 
    13.8,113.4 16,126.1 29.7,141.3 57,141.3 57,95.8 54.2,85.8 60.2,84.1 63,78.5 "/>
<polygon id = "riverside" points="413.7,533.4 483,532.9 487.6,526.6 489,518.5 487.1,505.2 491.4,497 451,497.1 451,499.6 374,499.6 
    374,501.4 352,500.1 343.7,499.7 338.4,507.6 338.4,508.2 344.9,517.2 351.1,520.5 346.5,529.1 358.7,533.1 "/>
<polygon id = "kern" points="281.5,453.1 334.3,452.8 339.3,452.9 339.2,397.1 322,397.4 218.1,397.4 218.1,406.6 223.1,406.6 
    227.4,416.8 233,416.9 236.4,427.2 243.4,427.2 243.3,432.3 248.8,432 248.4,437.5 252.6,438.2 252.6,448.3 253.5,448.3 
    261.7,449.6 263.3,453.3 279.9,454.7 281.2,453.1 "/>
<polygon id = "colusa" points="115.4,207.9 138.7,207.9 139.2,202.3 133.3,192.9 135.2,185.1 135.9,180.8 96.5,180.9 95.1,184.6 
    100,190 107.2,190.4 109.3,196 109,196 109.3,200.6 112,203.8 "/>
<polygon id = "delNorte" points="21,16.5 22.9,24.6 20.2,30.2 26.3,35.6 29.9,49.2 47.4,49.2 47.5,54.5 51.4,54.4 50,44.1 51.9,23.1 
    52.5,22.3 57.6,16.5 "/>
<polygon id = "modoc" points="226.2,16.5 158.3,16.5 158.3,67 226.2,67 "/>
<polygon id = "fresno" points="304.4,331.8 300.4,321.3 293.7,317.4 290.1,309.7 284.2,304.7 284.7,297.7 273.6,290.7 261.5,302.8 
    257.8,315.4 248.8,316.9 248.3,321.6 241.6,325 235.9,334.8 208.8,338.5 204.9,333.6 200.8,323.5 183.8,340.5 198.5,355.3 
    199,365.3 195.1,368.8 196.3,374.2 196.4,377.7 203.6,383 208.7,385.9 211.8,389.1 228.2,373.5 228.2,360.2 242.5,359.1 
    246.8,355.1 252,349.7 259.4,349.9 259.4,344.7 274.7,344.9 274.9,339.9 304.3,339.7 303.8,336.9 "/>
<polygon id = "madera" points="247.2,320.8 247.7,315.8 256.8,314.3 260.5,302.2 272.7,289.9 267.2,281.6 265.7,281.3 261.4,281.3 
    259.8,279.2 247.2,291.7 243.9,300.6 238.4,300.6 224.7,314.7 221.6,315.7 213.2,316.5 201.7,322.7 205.9,333.1 209.3,337.2 
    235.1,333.6 240.8,324.1 "/>
<polygon id = "santaClara" points="167.9,326.7 166.6,323.2 167.7,317.1 167.4,316.6 165.2,315.3 159.8,316.9 158.1,307.1 159,306.2 
    155.3,296.7 137.9,296.6 134.6,298.1 127.6,297 125,298.2 122.9,301.8 123.3,305.3 124.1,306.9 124.1,307.2 124.6,307.6 
    130.7,314.7 136.8,318.1 138.9,318.7 142.4,321.3 143.4,321.6 145.2,324.9 145.3,325 146.9,326.5 147.2,326.6 151.4,330.3 
    152.5,329.6 155.5,325.4 "/>
<polygon id = "tehama" points="147.8,142.8 150.6,135.3 157.8,132.1 161.9,123 156,120.5 154.9,114.7 146.4,114.3 142.1,115.2 
    126,117.2 123.2,118.9 106.5,118.4 97.4,120.8 88.1,122.9 87,123.3 86,123.3 85.2,123.2 81.4,124.4 85.3,126.6 87.4,143.2 88.5,146 
    86.3,151.5 87.1,154 128.5,154 128.6,148.7 141.8,148.4 "/>
<polygon id = "sanJoaquin" points="153.1,292.2 156.6,295.2 168.1,283.6 169.9,283.1 170.9,282.5 172.8,281.1 174,280.1 176.5,279.4 
    176.9,279.7 182.2,280.1 182,260.3 178.7,251.4 177.5,247.5 177.3,247.6 159.6,251.5 156.6,250.6 152,259.3 153.1,275.9 "/>
<polygon id = "alameda" points="155.1,295.5 151.9,292.8 151.9,276.7 133.1,282.5 121.6,274.9 118.7,271.6 114.4,272.4 118.4,282.2 
    127.8,295.8 134.5,296.8 137.7,295.4 "/>
<polygon id = "nevada" points="223.2,177.1 201,175.9 198.9,172.2 191.3,176.3 189.6,176.9 178.2,180.3 173.4,181.1 166.4,189.9 
    166.4,201.4 167.7,201.9 173.3,201.9 177.2,201.1 179.5,196.6 187.3,189.5 195.9,183.9 225.9,183.8 226.1,177.1 "/>
<polygon id = "butte" points="162.7,174.6 171.5,170.9 174.7,167.1 157.9,148.5 160.4,135.5 158.1,133.3 151.6,136.2 148.8,143.5 
    142.3,149.6 129.8,149.8 129.7,154.4 134.8,160.7 132.4,170.3 138.9,170.2 137.8,177.8 137.2,180.4 136.5,184.6 149.2,185.1 
    159.3,182.4 "/>
<polygon id = "merced" points="213,315.3 221.4,314.5 223.1,313.9 217.8,309.7 208,287.9 180.7,301.4 181.5,304.5 168.9,317.3 
    167.8,323 169.4,327.2 172.8,334.4 182.9,339.8 200.7,321.9 "/>
<polygon id = "tulare" points="316.6,371.7 317,365.1 309.8,356.1 304.6,340.9 276,341.1 275.8,346.1 260.6,345.9 260.6,351.1 
    252.5,351 248,355.6 252.5,360.6 249.6,377.2 249.5,396.2 321.5,396.2 322.6,392.3 "/>
<polygon id = "stanislaus" points="207.3,286.9 195.1,275.4 195.1,275.3 183.2,261.8 183.4,281.4 176.4,280.8 176.3,280.7 174.6,281.2 
    173.5,282 171.6,283.5 170.2,284.3 168.7,284.6 156.8,296.7 156.6,296.8 160.4,306.5 159.4,307.5 160.8,315.4 165.3,314.1 
    168.3,315.7 168.5,316 180.1,304.2 179.3,300.7 "/>
<polygon id = "orange" points="349.5,521 344.1,518.1 337.4,508.9 332.4,504.7 323.8,504.7 317.1,518.3 340.7,538.3 345.1,529.1 "/>
<polygon id = "imperial" points="490.6,563.5 487.9,557 478.9,553.6 480,542.6 477.9,534.9 480,534.1 414.3,534.6 413.3,579.3 
    478.8,573.7 487.7,571.5 "/>
<polygon id = "sutter" points="157.6,205.8 150.8,209.4 148.6,187.2 148.7,186.2 136.2,185.8 134.6,192.7 140.4,202 139.9,208.4 
    146.8,218.4 149.5,216 150.7,219.5 155.4,219.6 156.1,208.3 "/>
<polygon id = "amador" points="222.8,233.4 222.8,223.4 212.7,232.1 204.7,233.7 196.7,235 190.8,232 185.2,232.7 178.4,234.5 
    178.4,246.6 179.7,250.4 196.4,243.7 205.5,236.2 "/>
<polygon id = "lake" points="114.4,208.6 108.2,201 107.8,195.3 106.3,191.6 99.5,191.2 93.7,184.9 95.5,180.2 95.6,168.7 
    89.6,168.7 89.5,171.8 81.2,173.4 80.6,178.7 84.5,189.4 79.9,199.4 86.5,209.5 92.6,212.7 93.3,213.5 96.1,216.4 101.7,223.6 
    108.8,221.5 112,211.9 "/>
<polygon id = "plumas" points="216.4,137.2 210.2,135.4 199,124.7 190.6,122.9 185.5,130.2 176.5,127.9 175.6,114.7 163.4,114.8 
    156.1,114.7 157.1,119.6 163.5,122.4 158.9,132.4 161.7,135.1 159.2,148.1 175.5,166.3 178.3,164 180.7,162.3 184.9,155.1 
    195.7,160 219.3,159.7 221.1,145.9 "/>
<polygon id = "sanMateo" points="122.9,307.7 122.9,307.2 122.1,305.6 121.7,301.5 123.1,299.1 111.7,290.2 111.2,284.3 104.5,284.4 
    104.6,293.9 109.7,304 109,311.2 113.8,320.6 115.8,321 115.6,313.5 120.3,311.7 123.3,308 "/>
<polygon id = "siskiyou" points="108.2,67.1 157.1,67 157.1,16.5 123.9,16.5 59.2,16.5 53.4,23 53.1,23.5 51.2,44.1 52.6,54.4 60.1,54.3 
    64.6,67.5 72.5,74 81.9,78.4 87.5,77.1 84.1,72.1 103.2,55.8 107.9,57 "/>
<polygon id = "santaCruz" points="146.6,327.7 146.3,327.5 144.7,326 144.5,326 144.3,325.7 142.6,322.6 141.8,322.3 138.2,319.7 
    136.2,319.2 129.5,315.5 129.5,315.2 124.1,308.9 121,312.7 116.8,314.3 117,321.5 127.9,329.8 134,329.1 137.4,333.3 148.2,330.8 
    149.9,330.6 "/>
<polygon id = "glenn" points="130.8,171.5 133.5,160.9 128.8,155.2 87.3,155.2 89.5,167.5 96.9,167.5 96.7,179.7 136.1,179.6 
    136.6,177.6 137.5,171.4 "/>
<polygon id = "sanLuisObispo" points="239.2,444 251.4,448.1 251.4,439.2 247.1,438.5 247.5,433.3 242.1,433.5 242.2,428.4 235.5,428.4 
    232.2,418.1 226.6,418 222.3,407.8 216.9,407.8 216.9,397.4 216.6,397.4 159.2,397.1 164.1,406.1 169.9,408.4 177.5,418 183,419.7 
    181.5,428.3 185.9,434 194.6,436.9 193.9,442.9 196.7,444.8 206.2,443.2 211.7,447.1 210.7,441.6 217.5,440.8 222.9,435.8 "/>



            </InteractiveMap>
            </React.Fragment>
        )
    }
}

CaliforniaCountyMap.defaultProps = {
    debug: true
}
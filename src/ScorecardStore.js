import {observable, action, computed} from 'mobx'
import chroma from 'chroma-js'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import demopop from './data/demographicsAndPopulation'

export default class AppStore{
    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable year = null
    @observable activeWorkflow = null

    @observable colorOptions = {
        scheme: 'OrRd',
        padLo: 0, padHi: 0,
        classes: 5,
        breakAlgorithm: 'e' //equidistant (also l or q)
    }


    @computed get colorScale(){
        const opts = this.colorOptions

        const allNums = this.indicator? Object.keys(indicators[this.indicator].counties).map((cty)=>{
            return indicators[this.indicator].counties[cty][this.race||'totals'][this.year]
        }).filter((o)=>{
            const inv = o==='' || o==='*'
            return inv?false : true
        }): [0,100]

        const classes = chroma.limits(allNums, opts.breakAlgorithm, opts.classes)

        return chroma.scale(opts.scheme)
            .domain([0,100])
            .padding([opts.padLo, opts.padHi])
            .classes(classes)
    } 

    @action setColor = (which,what) => this.colorOptions[which] = what
    @action setYearIndex = () => {
        const newYears = indicators[this.indicator].years
        if(!this.year && newYears.length>1) this.year = newYears.length-1
        else if(!this.year) this.year = 0
        else if(this.year === 1 && newYears.length===1) this.year = 0
        console.log(`year ${this.year} (${newYears[this.year]})`)
    }

    @action setWorkflow = (mode) => this.activeWorkflow = mode===this.activeWorkflow? '' : mode
    @action completeWorkflow = (which, value) => {

        if(which==='indicator' && this.race &&!indicators[value].categories.includes('hasRace')) this.race = null
        else if(which==='indicator' && this.county){
            const val = indicators[value].counties[this.county][this.race||'totals'][this.year]
            this.county = null
        }
        else if(which==='county' && this.indicator){
            const val = indicators[this.indicator].counties[value][this.race||'totals'][this.year]
            if(this.race && (!val || val==='*')){ 
                const holdOnToRace = this.race
                this.race = null
                console.log('unset race so the selection could go on')
                if(!this.checkInvalid('county',value)){
                    this.race = holdOnToRace
                    return
                }
            }
            else if(!this.race && (!val || val==='*')){
                console.log('this county has no data, stopping selection')
                return
            }
        }
        if(!this.checkInvalid()){ 
            console.log('something invalid, stopping selection')
            alert('oops! something bad happened.')
            return
        }

        this.activeWorkflow = null
        this[which] = value
        if(which==='indicator'){
            //ensure year validity when changing indicators
            this.setYearIndex()
            //set color scheme for indicator category
            const catColors = {welfare: 'PuRd', health: 'BuGn', education: 'Purples', earlyChildhood: 'PuBu'}
            const mainCategory = indicators[this.indicator].categories.filter((o)=>{return o!=='hasRace'})[0]
            this.setColor('scheme', catColors[mainCategory])
            //assign padding values 
            const allNums = Object.keys(indicators[this.indicator].counties).map((cty)=>{
                return indicators[this.indicator].counties[cty][this.race||'totals'][this.year]
            }).filter((o)=>{
                const inv = o==='' || o==='*'
                // if(inv) invalids++
                return inv?false : true
            })
            console.log(allNums)
            console.log(Math.min(...allNums) / 100)
            this.setColor('padLo',Math.min(...allNums)/100)
            this.setColor('padHi',1 - Math.max(...allNums)/100)
            console.log('set padding: ', this.padLo, this.padHi)
        }
        if(this.race && this.indicator && this.county && !indicators[this.indicator].counties[this.county][this.race][this.year]){
            //if race/indicator/county selected -> no race data, unset race
            // console.log('race not supported after selection, unsetting')
            // this.race = null

            //the result of this code is that it just looks unresponsive - lets grey the options in UniversalPicker
        }
        
    }

    checkInvalid = (which, value) => {
        const {indicator, county, race, year} = this
        const val = indicator? indicators[which==='indicator'?value:indicator].counties[which==='county'?value:county||'california'][which==='race'?value:race||'totals'][year]
            : demopop[county||'california'][race||'population']
        console.log(val)
        return val==='*' || !val? false : true
    }
    
}
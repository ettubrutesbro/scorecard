import {observable, action, computed} from 'mobx'

import chroma from 'chroma-js'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import countyLabels from './assets/countyLabels'
import demopop from './data/demographicsAndPopulation'
import {getMedia} from './utilities/media'

import {findIndex} from 'lodash'

export default class AppStore{
    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable year = null
    @observable activeWorkflow = null

    @observable colorOptions = {
        scheme: 'OrRd',
        padLo: 0, padHi: 0,
        classes: 4,
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

    @action setColorOption = (which,what) => this.colorOptions[which] = what
    @action setYearIndex = () => {
        const yrs = indicators[this.indicator].years
        if(!this.year && yrs.length>1) this.year = yrs.length-1
        else if(!this.year) this.year = 0
        else if(this.year === 1 && yrs.length===1) this.year = 0
        console.log(`year ${this.year} (${yrs[this.year]})`)
    }

    @action setWorkflow = (mode) => this.activeWorkflow = mode===this.activeWorkflow? '' : mode
    

    @action completeWorkflow = (which, value) => {
        if(which==='indicator'){
            const {county, race, year} = this
            const ind = indicators[value]
            if(race && !ind.categories.includes('hasRace')){
                if(county){//even without race, will this work with user's selected county?
                    const arr = ind.counties[county].totals

                    // const validYears = arr.filter((val)=>{return val >= 0})
                    // console.log(arr)
                    if(arr.filter((v)=>{return v>=0}).length>0){
                        //this county does have valid values
                        //check if current yearindex is ok
                        let validYear 
                        if(year && arr[year]>=0){
                            validYear = year
                            //no need to change year
                        }
                        else if(year && arr[year]!==0 && (!arr[year] || arr[year]==='*')){
                            //but not for the currently selected yearindex
                            //go to the last year that has a valid value
                            console.log('!hasRace, gonna unset race but need to switch the year, here are the values for totals for the picked ind in', county)
                            const revLastInd = arr.reverse().findIndex((v)=>{return v>=0}) //get last number
                            validYear = (arr.length-1)-revLastInd
                            // console.log(arr, revLastInd, latestValidYear)
                            // this.year = latestValidYear
                        }
                        //now we can sanity check race
                        // alert('sanity check: race (countys fine)')
                        this.setSanityCheck(value, 'This indicator doesn\'t have race data -- you can only view its data for all races, so continuing will deselect your currently selected race.')
                    }
                    else {
                        // alert('sanity check: even though !hasRace, both race and county wouldve broken the selection')
                        this.setSanityCheck(value, 'This indicator doesn\'t have data for your selected race or county, so picking it will deselect both.')
                    }
                }
                else{
                    this.setSanityCheck(value, 'This indicator doesn\'t have race data, so selecting it will unselect the race for which you\'re currently viewing data.')
                     // alert('sanity check: race (no county)')
                 }

                return false
            }
            else{
                const arr = ind.counties[county||'california'][race||'totals']
                //go to most recent non * / non '' year 
                const validYears = arr.filter((val)=>{
                    return val>=0
                })
                console.log('selected ind\'s value array:')
                console.log(arr)
                if(validYears.length===0){
                    if(county && race) alert('sanity check: both race and county')
                    else if(county) alert('sanity check: this county has no valid values for this ind')
                    else if(race) alert('sanity check: this race has no valid values in CA')

                    return false
                }
                else{
                    // const goToYear = findIndex((x)=>{return x>=0})
                    // this.year = goToYear
                }    
            }
            

        }




        if(which==='indicator' && this.race &&!indicators[value].categories.includes('hasRace')){
            //picked no-race indicator with a race already selected: unset
            //TODO: sanity check here
            // alert('sanity check for race unselect')
            this.race = null
        }
        else if(which==='indicator' && this.county){
            const val = indicators[value].counties[this.county][this.race||'totals'][this.year]

            if(!val || val==='*'){
                // alert(`${this.county} had no data for this indicator, so you're seeing statewide data now.`)
                // alert('sanity check for county unselect')
                this.notify('unselectCounty', countyLabels[this.county], 8000)
                this.county = null
            }
        }
        else if(which==='county' && this.indicator){
            console.log(this.indicator, value, this.race, this.year)
            const val = indicators[this.indicator].counties[value||'california'][this.race||'totals'][this.year]
            if(this.race && (!val || val==='*')){ 
                const holdOnToRace = this.race
                this.race = null
                console.log('unset race so the selection could go on')
                if(!this.checkValidity('county',value)){
                    this.race = holdOnToRace
                    return
                }
            }
            else if(!this.race && val!==0 && (!val || val==='*')){
                console.log('this county has no data, stopping selection')
                return
            }
        }
        else if(which==='race'){
            if(!this.checkValidity(which,value)){
                console.log('tried to pick race but it woludve resulted in invalid value: canceling')
                return
            }
        }
        if(which==='indicator'){
            if(indicators[value].years.length <= this.year){
                this.year = 0
            }
        }
        if(!this.checkValidity(which,value)){ 
            console.log('something invalid, stopping selection -- which and value were')
            console.log(which, value)
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
            this.setColorOption('scheme', catColors[mainCategory])
            //assign padding values 
            const allNums = Object.keys(indicators[this.indicator].counties).map((cty)=>{
                return indicators[this.indicator].counties[cty][this.race||'totals'][this.year]
            }).filter((o)=>{
                const inv = o==='' || o==='*'
                // if(inv) invalids++
                return inv?false : true
            })
            const lo = Math.min(...allNums)
            const hi = Math.max(...allNums)
            const range = hi - lo 

            // cases: small range, small range low % (too light), 
            let adjustLo = 0
            let adjustHi = 0

            if(range < 25){
                console.log('adjusting colors for small range')
                //small range
                if((100 - hi) > lo){
                    //small range low end (too light)
                    adjustLo = ((100-hi) / 2)/100
                    adjustHi = -(((100-hi) / 2)/100)
                    console.log('adjusting light', adjustLo, 'dark: ', adjustHi)
                }else{
                    adjustLo = -(lo/2)/100
                    // adjustHi = 0.1
                    //small range high end (too dark)
                }
            }
            else{ //if the range is normal, but some items are too faint, make adjustment
                if(lo<30){
                    adjustLo = 0.2
                    adjustHi = -(((100-hi)/3)/100) 
                }
            }
            console.log(range)
            this.setColorOption('padLo',(lo/100) + adjustLo)
            this.setColorOption('padHi',(1 - hi/100) + adjustHi)
            

            console.log('set padding: ', this.padLo, this.padHi)
        }
        if(this.race && this.indicator && this.county && !indicators[this.indicator].counties[this.county][this.race][this.year]){
            //if race/indicator/county selected -> no race data, unset race
            // console.log('race not supported after selection, unsetting')
            // this.race = null

            //the result of this code is that it just looks unresponsive - lets grey the options in UniversalPicker
        }
        return true
        
    }



    checkValidity = (which, value) => {
        const {indicator, county, race, year} = this
        console.log(which,value)
        console.log(indicator,county,race,year)
        const nullVal = !value
        const val = indicator? indicators[which==='indicator'?value:indicator].counties[which==='county'&&!nullVal?value:county||'california'][which==='race'&&!nullVal?value:race||'totals'][year]
            : demopop[county||'california'][race||'population']
        console.log(val)
        return val!==0 && (val==='*' || !val)? false : true
    }
    
    @observable notifications = {
        unselectCounty: null
    }
    @action notify = (which, what, time) => {
        this.notifications[which] = what
        if(time){
            setTimeout(()=>{this.notifications[which] = null}, time)
        }
    }

    @observable indicatorPageSize = 1
    @action setIndicatorPages = () => {
        const screen = getMedia()
        let pages = []
        if(screen==='optimal'){
            this.indicatorPageSize = 8
        }
        else if(screen==='compact'){
            this.indicatorPageSize = 9
        }
        const indKeys = Object.keys(indicators).filter((ind)=>{
            const cats = indicators[ind].categories
            return this.indicatorFilter === 'all'? true : cats.includes(this.indicatorFilter)
        })
        console.log('total inds:', indKeys.length)
        for(var i = 0; i<indKeys.length/this.indicatorPageSize; i++){
            pages.push(indKeys.slice(i*this.indicatorPageSize, (i+1)*this.indicatorPageSize))
        }

        this.indicatorPages = pages
        console.log(this.indicatorPages.toJS())
    }

    @observable indicatorPages = null
    @observable indicatorListPage = 0
    @observable indicatorFilter = 'all'
    @action setIndicatorFilter = (val) =>{
        console.log('setting indicator filter to ', val)
        this.indicatorListPage = 0
        this.indicatorFilter = val
        this.setIndicatorPages()
     }
    @action setIndicatorListPage = (val) => {
        console.log('setting indicator page to ',val)
        this.indicatorListPage = val
    }

    @observable sanityCheckIndicator = null
    @observable sanityCheckMessage = ''
    @observable sanityCheck = {
        indicator: null,
        message: '',
        action: ()=>{}
    }
    @action setSanityCheck = (targetInd, message, action) => {
        console.log('setting sanity check ind on', targetInd)
        // this.sanityCheckIndicator = targetInd
        this.sanityCheck.indicator = targetInd
        this.sanityCheck.message = message
        this.sanityCheck.action = action
    }
    @action clearSanityCheck = () => { this.sanityCheck.indicator = null}
}
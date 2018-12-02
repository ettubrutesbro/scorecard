import {observable, action, computed} from 'mobx'

import chroma from 'chroma-js'

import indicators from './data/indicators'
import {counties} from './assets/counties'
import countyLabels from './assets/countyLabels'
import semanticTitles from './assets/semanticTitles'
import demopop from './data/demographicsAndPopulation'
import {getMedia} from './utilities/media'
import {capitalize} from './utilities/toLowerCase'
import {pickBy, findIndex, debounce} from 'lodash'
import {isValid} from './utilities/isValid'

import stopwords from './utilities/stopwords'

const {detect} = require('detect-browser')
const browserInfo = detect()

export default class AppStore{
    browser = {
        name: browserInfo.name,
        version: Number(browserInfo.version.slice(0,2)),
        os: browserInfo.os
    }

    @observable screen = getMedia()

    @action resize = debounce(() => { 
        const size = getMedia()
        if(this.screen!==size){
            this.screen = size 
            window.location.reload()
        }
        else return

    }, 150)

    @observable init = true

    @observable indicator = null
    @observable county = null
    @observable race = null
    @observable year = null

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

        return chroma.scale(this.init? ['#f4f4f4','#bbbbbb'] : opts.scheme) 
            .domain([0,100])
            .padding([opts.padLo, opts.padHi])
            .classes(classes)
    } 

    @action setColorOption = (which,what) => this.colorOptions[which] = what
    @action setYearIndex = () => {
        const yrs = indicators[this.indicator].years
        //these facile checks work for setting yearIndex presuming there's data, but break on
        //complex selections wherein county/race may not have a value for this year, even if the ind
        // has data for this year generally
        let targetYear = this.year || 0
        if(!this.year && yrs.length>1) targetYear = yrs.length-1
        else if(!this.year) targetYear = 0
        else if(this.year === 1 && yrs.length===1) targetYear = 0

        //next, test targetYr's validity datawise

        if(isValid(indicators[this.indicator].counties[this.county||'california'][this.race||'totals'][targetYear])){
            console.log('final gauntlet: indicator selection passed year validity test')
            this.year = targetYear
        }
        else{
            console.log('year correction at setYearIndex')
            if(targetYear === 0) targetYear = 1
            else targetYear = 0
            this.year = targetYear
        }


        console.log(`year ${this.year} (${yrs[this.year]})`)
    }

    

    @action completeWorkflow = (which, value) => {

        const {county, race, year} = this
        console.log('set',which,'to',value)
        //INDICATOR SELECTION CHECKS
        if(which==='indicator'){
            if(!value){ //clearing value for reset
                this[which] = value
                return
            }
            const ind = indicators[value]
            console.log('attempting to select indicator')
            if(race && !ind.categories.includes('hasRace')){
                //even without race, will this work with user's selected county?
                if(county){
                    const arr = ind.counties[county].totals
                    //without any races, does this county have valid values in the indicator?
                    if(arr.filter((v)=>{return isValid(v)}).length>0){ 
                        //yes: sanity check just for race, we can keep the county
                        this.setSanityCheck(
                            'indicator',
                            value, 
                            `This indicator has no race data -- picking it will deselect your currently selected race (${capitalize(race)}).`,
                            ()=>{
                                this.completeWorkflow('race',null)
                                this.completeWorkflow('indicator',value)
                            }
                        )
                    }
                    else {
                        //no: sanity check for unselecting both race and county
                        this.setSanityCheck(
                            'indicator',
                            value, 
                            `This indicator has no data for your selected race (${capitalize(race)}) or county (${countyLabels[county]}), so picking it will deselect both.`,
                            ()=>{
                                this.completeWorkflow('race',null)
                                this.completeWorkflow('county',null)
                                this.completeWorkflow('indicator',value)
                            }
                        )
                    }
                }
                //user didn't have a county: we still need to sanity check race
                else{
                    this.setSanityCheck(
                        'indicator',
                        value, 
                        `This indicator has no race data -- picking it will deselect your currently selected race (${capitalize(race)}).`,
                        ()=>{
                            this.completeWorkflow('race',null)
                            this.completeWorkflow('indicator',value)
                        }
                    )
                 }
                return false
            } //end facile race w. !hasRace condition
            else{
                // the more complicated case: indicator has race, but does it for selected?
                const arr = ind.counties[county||'california'][race||'totals']
                if(arr.filter((val)=>{ return isValid(val)}).length>0){
                    //YES: indicator selection is valid, proceed
                    console.log('user\'s indicator selection is valid, proceed') 
                }
                else{
                    //no valid years for the user's selection combo
                    if(county && race){
                         //reset both race and county
                         this.setSanityCheck(
                            'indicator',
                            value, 
                            `This indicator has no data for your selected race (${capitalize(race)}) or county (${countyLabels[county]}), so picking it will deselect both.`,
                            ()=>{
                                this.completeWorkflow('race',null)
                                this.completeWorkflow('county',null)
                                this.completeWorkflow('indicator',value)
                            }
                        )
                     }
                    else if(county){
                        //reset county
                        this.setSanityCheck(
                            'indicator',
                            value, 
                            `This indicator has no data for ${countyLabels[county]} county, so picking it will revert your selection to all counties.`,
                            ()=>{
                                this.completeWorkflow('county',null)
                                this.completeWorkflow('indicator',value)
                                this.notify('unselectCounty', countyLabels[this.county], 8000)
                            }
                        )
                    }
                    else if(race){
                        //reset race
                        this.setSanityCheck(
                            'indicator',
                            value, 
                            `This indicator has no data for your selected race (${capitalize(race)}), so picking it will revert your selection to all races.`,
                            ()=>{
                                this.completeWorkflow('race',null)
                                this.completeWorkflow('indicator',value)
                            }
                        )
                    }

                    return false
                }
            }
        } // END INDICATOR CHECKS

        //COUNTY SELECTION CHECKS
        else if(which==='county'){
            console.log('county selection')
            if(this.indicator){
                const val = indicators[this.indicator].counties[value||'california'][this.race||'totals'][this.year]
                if(isValid(val)){
                    //valid: user can continue
                    console.log('user\'s selected county works with existing indicator/race/year')
                }    
                else{
                    //invalid: this combo of ind/county/race/year doesnt have a value
                    console.log('invalid county selection')
                    if(value){

                        const indCty = indicators[this.indicator].counties[value]
                        //user picked a county (not CA)
                        if(indCty.totals.filter((v)=>{return isValid(v)}).length>0){
                            //county contains values, at least
                            if(this.race){
                                //no need to check for hasRace: should have never gotten to this point...
                                //if user has race, does county have values for that?
                                if(indCty[this.race].filter((v)=>{return isValid(v)}).length > 0){
                                    //race does have values, just not your year
                                    const yrs = indicators[this.indicator].years
                                    const validYear = year ===0? 1 : 0
                                    this.setSanityCheck(
                                        'county',
                                        value,
                                        `This county doesn\'t have indicator data for your selected race in ${yrs[year]}, but you can view ${yrs[validYear]}.`,
                                        ()=>{
                                            this.completeWorkflow('year', validYear)
                                            this.completeWorkflow('county',value)
                                        }
                                    )
                                }
                                else{
                                    //race has no values: does totals have current year?
                                    if(isValid(indCty.totals[year])){
                                        //yes: sanity check race
                                        this.setSanityCheck(
                                            'county',
                                            value,
                                            'This county doesn\'t have indicator data for your selected race, so picking it will revert your selection to all races.',
                                            ()=>{
                                                this.completeWorkflow('race', null)
                                                this.completeWorkflow('county',value)
                                            }
                                        )
                                    }
                                    else{
                                        //no: sanity check race + year
                                        const yrs = indicators[this.indicator].years
                                        const validYear = year===0?1:0
                                        this.setSanityCheck(
                                            'county',
                                            value,
                                            `This county doesn\'t have indicator data for your selected race in ${yrs[year]}, but you can view its indicator data from ${yrs[validYear]} for all races.`,
                                            ()=>{
                                                this.completeWorkflow('race', null)
                                                this.completeWorkflow('year', validYear)
                                                this.completeWorkflow('county',value)
                                            }
                                        )
                                    }
                                }
                            } // end race check
                            else{
                                //county has values, but returned invalid: switch the year
                                const yrs = indicators[this.indicator].years
                                const validYear = year===0?1:0
                                this.setSanityCheck(
                                    'county',
                                    value,
                                     `This county doesn\'t have indicator data from ${yrs[year]}, but you can view it for ${yrs[validYear]}.`,
                                     ()=>{
                                        this.completeWorkflow('year',validYear)
                                        this.completeWorkflow('county',value)
                                     }
                                )
                            }
                        } 
                        else{
                            //county doesnt even have values, disallow selection
                            console.log('county contains no info for this indicator - disallowing entirely')
                            return false
                        }
                    } //end check if theres values
                    else{
                        //null value for county; user is returning to california
                        //but this is still in the invalid part of the conditional; how could there be no value?
                        console.log('california doesnt have data for this indicator with race and/or year...this shouldnt happen - inds should always have both years and all races at the california level.')
                        alert('Sorry, an error occurred with our data - please refresh the app.')
                    }
                    console.log('returning false')
                    return false
                } //end invalid values operations
            } //end county-indicator comaptibilyt check
        }// END COUNTY CHECK


        else if(which==='race' && this.indicator){
            // if(!this.checkValidity(which,value)){
            //     console.log('tried to pick race but it woludve resulted in invalid value: canceling')
            //     return
            // }
            if(!indicators[this.indicator].categories.includes('hasRace')){
                console.log('whyd this happen? tried to select race when indicator !hasRace...FOH')
                return false
            }
            const arr = indicators[this.indicator].counties[this.county||'california'][value||'totals']
            if(isValid(arr[this.year])) console.log('race selection valid')
            else{
                //invalid
                console.log('race selection invalid, determining....')
                if(arr.filter((v)=>{return isValid(v)}).length > 0){
                    const otherYear = this.year===0? 1 : 0
                    console.log('race selection can be sanity checked: year')
                    this.setSanityCheck('race',value,
                        `This indicator has no data for ${value!=='other'?capitalize(value):''} ${semanticTitles[this.indicator].who} ${value==='other'?'of other races':''} in ${this.county? countyLabels[this.county] : 'California'} for the year ${indicators[this.indicator].years[this.year]}, but you can view ${indicators[this.indicator].years[otherYear]}.`,
                        ()=>{
                            this.completeWorkflow('year',otherYear)
                            this.completeWorkflow('race', value)
                        }
                    )
                        
                    return false
                }
                    
                
                if(this.county && indicators[this.indicator].counties.california[value||'totals'].filter((v)=>{return isValid(v)}).length > 0){
                    console.log('race selection can be sanity checked: county')
                    this.setSanityCheck('race',value,
                        `This indicator doesn't have value for this race for the county you have selected, but you can continue without the county selection...`, 
                        ()=>{
                            this.completeWorkflow('county',null)
                            this.completeWorkflow('race',value)
                        }    
                    )
                    return false
                }

                console.log('got to the end of the invalid race selection check without another solution...uh oh')

                
            }
        }


        // if(which==='indicator'){
        //     if(indicators[value].years.length <= this.year){
        //         this.year = 0
        //     }
        // }


        this[which] = value

        let queryString = []
        if(this.indicator && !this.init) queryString.push(`ind=${this.indicator}`)
        if(this.county) queryString.push(`cty=${this.county}`)
        if(this.race) queryString.push(`race=${this.race}`)
        if((this.year===0 || this.year) && !this.init) queryString.push(`yr=${this.year}`)
        queryString = '?'+ queryString.join('&')

        window.history.replaceState({}, '', window.location.href.split('?')[0]+queryString)

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
                //small range
                if((100 - hi) > lo){
                    console.log('faint tight range')
                    //small range low end (too light)
                    adjustLo = ((100-hi) / 2)/100
                    adjustHi = -(((100-hi) / 2)/100)
                }else{
                    console.log('dark tight range')
                    adjustLo = -(lo/2)/100
                    // adjustHi = 0.1
                    //small range high end (too dark)
                }
            }
            else{ //if the range is normal, but some items are too faint, make adjustment
                if(lo<30){
                    console.log('faint normal range')
                    adjustLo = 0.2
                    adjustHi = -(((100-hi)/3)/100) 
                }
            }
            this.setColorOption('padLo',(lo/100) + adjustLo)
            this.setColorOption('padHi',(1 - hi/100) + adjustHi)
            
        }
        console.log('returning true!')
        return true
        
    }



    checkValidity = (which, value) => {
        const {indicator, county, race, year} = this
        
        if((which!=='indicator' && !indicator) || !value){
            //picking county and race without an indicator; this can basically only happen
            //from the init and we can probably just ignore it...
            return true
        }

        const ind = which==='indicator' && value? value : indicator 
        const cty = which === 'county' && value? value : county? county : 'california'
        const rce = which === 'race' && value? value: race? race : 'totals'

        console.log(ind, cty, rce, year)
        console.log(indicators[ind].counties[cty][rce])
        const val = indicators[ind].counties[cty][rce][year]
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
        const {screen} = this
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
        county: null, 
        race: null,
        year: null,
        message: '',
        action: ()=>{}
    }
    @action setSanityCheck = (which, target, message, action) => {
        console.log('setting sanity check on', which, target)
        this.sanityCheck[which] = target
        this.sanityCheck.message = message
        this.sanityCheck.action = action
    }
    @action clearSanityCheck = (which) => { 
        console.log('clearing sanity check for', which)
        this.sanityCheck[which] = null
    }

    @observable sourcesMode = false
    @action setSourcesMode = (tf) => this.sourcesMode = tf

    @observable hoveredCounty = ''
    @observable hoveredRace = ''
    @action setHover = (which , value, check) => {
        //dont complete race hover action if the race has no data
        if(which==='race' && value){
            const ind = indicators[this.indicator]
            const cty = this.county? this.county : 'california'
            if(!ind.categories.includes('hasRace')) return false
            if(ind.counties[cty][value][this.year] === '' || ind.counties[cty][value][this.year]==='*') return false
        }
        if(check) return true
        this['hovered'+capitalize(which)] = value
        console.log('hovered', which, ':', this['hovered'+capitalize(which)])
    }


    @action search = (str) => {        
        const searchWords = str.split(' ')
        let matches = []

        searchWords.forEach((word,i)=>{
            matches[i] = Object.keys(pickBy(indicators, (ind)=>{
                //does any indicator keyword contain the search word? 
                let matchOrPartial = false
                ind.keywords.some((keyword)=>{
                    if(keyword.startsWith(word)) matchOrPartial = true
                    return keyword.startsWith(word)
                })
                return matchOrPartial
            }))
        })
        let finalMatches = matches[0]
        if(matches.length > 1){
            for(let i = 1; i<matches.length; i++){
                finalMatches = finalMatches.filter((match)=>{
                    return matches[i].includes(match)
                })
            }
        }

        console.log(finalMatches)
        return finalMatches
    }
}
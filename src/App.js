import React, { Component } from 'react';
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import fs from 'fs'

import styles from './App.module.css'

import indicators from './data/indicators'

import {counties} from'./assets/counties'
import CaliforniaCountyMap from './components/InteractiveMap'



function formatJSONForScorecard(file, indicatorname, years, categories){
  console.log(indicatorname)
  let indicatorLocations = {}
  file.map((blob)=>{ // should be forEach
    // console.log(blob)
    // const newKeys = ['ranks', 'black', 'white', 'asian', 'latinx', 'other', 'totals']

    const sortedBlobKeys = {
      ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
      black: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('aa')}),
      white: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('white')}),
      asian: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('asian')}),
      latinx: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('latino')}),
      other: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('other')}),
      totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
    }

    // console.log(sortedBlobKeys)

    let newBlob = {}

    Object.keys(sortedBlobKeys).forEach((key)=>{
      newBlob[key] = []
      sortedBlobKeys[key].forEach((specifickey)=>{
        newBlob[key].push(blob[specifickey])
        // console.log(blob.Location ,specifickey, blob[specifickey])
      })
    })
    indicatorLocations[blob.Location] = newBlob
  })

  return {
    indicator: indicatorname,
    years: years,
    categories: categories,
    counties: indicatorLocations
  }

}

function IsJsonString(json)
{
    var str = json.toString();
     
    try
    {
        JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
     
    return true;
}





@observer class App extends Component {
  
  @observable input = ''
  @observable output = ''
  @observable flags = {
    multiyear: true,
    welfare: false,
    health: false,
    education: false,
    earlyChildhood: false
  }
  @observable categories = []
  @observable firstyear = ''
  @observable latestyear = ''
  @observable indicatorName = ''

    @action changeField = (v, field) => {
      this[field] = v.target.value
      console.log(this.indicatorName, this.firstyear, this.latestyear)
      this.userInput()
      // console.log(this.flags)
    }
    @action changeFlag = (flag) => {
      this.flags[flag] = !this.flags[flag]
      console.log(this.flags)


      this.categories = Object.keys(this.flags).filter((flag)=>{
        return flag !== 'multiyear' && this.flags[flag]
      })
      this.userInput()

      // console.log(flag, this.flags[flag])
    }

    @action userInput = (e) => { 
      if(e) this.input = e.target.value 
      const isJSON = IsJsonString(this.input) 
      console.log(isJSON)
      if(isJSON){
        const formattedInput = formatJSONForScorecard(
          JSON.parse(this.input), 
          this.indicatorName, 
          this.flags.multiyear? [this.firstyear, this.latestyear] : this.latestyear,
          this.categories.toJS()
        )
        console.log(formattedInput)
        this.output = JSON.stringify(formattedInput)
        // this.outputheight = this.outputregion.scrollHeight
        // console.log(this.outputheight)
      }
      else {
        this.output = 'your input isn\'t JSON! copy everything from csvtojson.com'
      }
      
    }

  render(){
    return(
      <div>
        <input 
          placeholder = "indicator name" 
          // value = {this.indicatorName} 
          onChange = {(e)=>{this.changeField(e,'indicatorName')}}
        />
        <div> 
          <input type = "checkbox" checked = {this.flags.multiyear} onChange = {()=>this.changeFlag('multiyear')}/>
          are there 2 years of data?
          {this.flags.multiyear && 
            <input placeholder = "older year" onChange = {(e)=>this.changeField(e, 'firstyear')} />
          }
          <input placeholder = "most recent year" onChange = {(e)=>this.changeField(e, 'latestyear')} />
        </div>
        check all categories that apply:
        <div> 
          <input type = "checkbox" checked = {this.flags.welfare} onChange = {()=>this.changeFlag('welfare')}/>
          welfare
        </div>
        <div> 
          <input type = "checkbox" checked = {this.flags.health} onChange = {()=>this.changeFlag('health')}/>
          health
        </div>
        <div> 
          <input type = "checkbox" checked = {this.flags.education} onChange = {()=>this.changeFlag('education')}/>
          education
        </div>

        <div> 
          <input type = "checkbox" checked = {this.flags.earlyChildhood} onChange = {()=>this.changeFlag('earlyChildhood')}/>
          early childhood
        </div>



        <h4> paste raw JSON from csvjson.com here </h4>
        <textarea 
          placeholder = "paste JSON here"
          ref = {(textarea)=>{this.inputregion = textarea}}
          style = {{
            border: '1px blue solid',
            padding: '25px',
            width: '100%',
            height: '100px'
          }}
          value = {this.input}
          onChange = {this.userInput}
        />
        <h4> output below - copy all (ctrl+a) and save as (indicatorname).json </h4>
        <textarea 
          ref = {(textarea)=>{this.outputregion = textarea}}
        style = {{
          border: '1px orange solid',
          padding: '25px',
          width: '100%',
          height: '1000px',
        }}
          value = {this.output}
        />

      </div>
    )
  }
}

export default App;

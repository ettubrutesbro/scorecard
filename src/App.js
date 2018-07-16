import React, { Component } from 'react';
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import fs from 'fs'

import styles from './App.module.css'

import indicators from './data/indicators'

import {counties} from'./assets/counties'
import CaliforniaCountyMap from './components/InteractiveMap'

import earlyprenatal from './data/health/EarlyPrenatalCare.json'

import {map} from 'lodash'

function formatJSONForScorecard(file, indicatorname, years){
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
    counties: indicatorLocations
  }

}



console.log(formatJSONForScorecard)

const wtf = (formatJSONForScorecard(earlyprenatal, 'EarlyPrenatalCare', [2015, 2016]))
console.log(indicators)

// fs.writeFileSync('./output.json', JSON.stringify(wtf, null, 2))


class Store{
  @observable mode = 'selectCounty' //splash, selectCounty, heatmap
  @observable selectionHover = null
  @observable highlightedCounty = null
  @observable selectedCounty = null

  @action countySelectHover = (ui) =>  this.selectionHover = ui
  @action countySelectUnhover = () => this.selectionHover = null
  @action onHoverCounty = (c) => this.highlightedCounty = c
  @action onUnhoverCounty = () => this.highlightedCounty = null
  @action onSelectCounty = (c) => this.selectedCounty = c
}

const store = new Store()
window.store = store

@observer class App extends Component {
  render() {
     const foistedProps = (element) => {
      return {
        onMouseEnter: ()=>store.countySelectHover(element),
        onMouseLeave: store.countySelectUnhover,
        enableHover: store.selectionHover === element,
        highlighted: store.highlightedCounty,
        selected: store.selectedCounty,
        onSelect: store.selectionHover === element? store.onSelectCounty: ()=>{},
        onHover: store.selectionHover === element? store.onHoverCounty: ()=>{},
        onUnhover: store.selectionHover === element? store.onUnhoverCounty : () => {}
      }
    }

    return (
      <div className="App">
        <div style = {{position: 'absolute'}}>
          {store.highlightedCounty}
          {store.selectedCounty}
        </div>
        <CaliforniaCountyMap 
          mode = "select"
          data = {indicators.noFoodInsecurity.year[0]}
          {...foistedProps('map')}
        />
      </div>
    );
  }
}

export default App;

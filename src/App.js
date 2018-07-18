import React, { Component } from 'react';
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import styles from './App.module.css'

import indicators from './data/indicators'

import CaliforniaCountyMap from './components/InteractiveMap'


console.log(indicators)


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
          data = {indicators.notFoodInsecure.year[0]}
          {...foistedProps('map')}
        />
      </div>
    );
  }
}

export default App;

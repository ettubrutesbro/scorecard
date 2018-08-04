import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scorecard from './Scorecard';
import registerServiceWorker from './registerServiceWorker';

import createBrowserHistory from 'history/createBrowserHistory'
import {observable, action} from 'mobx'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { Router } from 'react-router'

import indicators from './data/indicators'

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
class Store{
	@observable location = null
	@observable indicator = null
	@observable race = null
	@observable year = null //important: when indicator changes this needs to be set automatically

	@observable mapmode = '' // '', 'heat', 'county', 'countyheat'
	// @observable userPicking = 'start'

	@action change = (target, value) => {
		console.log('changing', target, 'to', value)
		this[target] = value	
		console.log(this[target])
		if(target === 'indicator'){
			if(!value) this.year = null
			else{
				const years = indicators[this.indicator].years
				if(years.length===1) this.year = years[0]
				else if(years.length===2) this.year = years[1]
				console.log('automatically set year to', this.year)
			}
		}
	}

	@action changedPickerMode = (newPickerMode) => {

	}

}

browserHistory.listen( (location) => {
	console.log(location)
})

const store = new Store()
window.store = store

const stores = {
	routing: routingStore,
	store: store
} 

const history = syncHistoryWithStore(browserHistory, routingStore)

ReactDOM.render(
	<Provider {...stores}>
		<Router history = {history}>
			<Scorecard />
		</Router>
	</Provider>, 
	document.getElementById('root')
)

registerServiceWorker()

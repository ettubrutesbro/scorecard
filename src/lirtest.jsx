
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import counties from 'data/counties'
import indicators from 'data/indicators'

export default class LIRTest extends React.Component{

	@observable location = null
	@observable indicator = null
	@observable race = null

	render(){
		return(
			<div>
				<div> Location {this.location} </div>
				<div> Indicator {this.indicator} </div>
				<div> Race {this.race} </div>

				<div> </div>
				<div> </div>
			</div>
		)
	}
}
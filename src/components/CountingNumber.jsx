import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import CountUp from 'react-countup'


export default class CountingNumber extends React.Component{
	
	@observable previousNumber = 0
	@action changeNumber = () => {
		this.previousNumber = this.props.number
	}


	componentWillUpdate(oldProps){
		if(this.props.number !== oldProps.number){
			this.changeNumber()
		}
	}

	render(){
		return(
			<CountUp
				start = {this.previousNumber}
				end = {this.props.number}
				separator = ','
			/>
		)
	}
}
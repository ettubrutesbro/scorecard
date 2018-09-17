import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import CountUp from 'react-countup'

import styles from './CountingNumber.module.css'

@observer
export default class CountingNumber extends React.Component{
	
	@observable previousNumber = 0
	@observable speed = 1.2
	@action changeNumber = () => {
		this.previousNumber = this.props.number
	}
	@action setSpeed = (newnum, old) => {
		const diff = Math.abs(newnum - old)
		console.log(diff)

		this.speed = (diff/100) * 2
		// if(this.speed < 0.2) this.speed = 0.01
		// else if(this.speed < 0.4) this.speed = 0.4
		if(this.speed > 2) this.speed = 2
	}

	componentWillUpdate(oldProps){
		if(this.props.number !== oldProps.number){
			this.setSpeed(this.props.number, oldProps.number)
			this.changeNumber()

		}
	}

	render(){
		return(
			<CountUp
				className = {this.props.relative? styles.relative : styles.absolute}
				start = {this.previousNumber}
				end = {this.props.number}
				separator = ','
				suffix = '%'
				duration = {this.speed}
				easingFn = {
					(t, b, c, d)=>{
						t /= d;
						t--;
						return c*(t*t*t + 1) + b
					}
				}
			/>
		)
	}
}

import React from 'react'
import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'


export default class UpdateWizard extends React.Component{
	@observable modifying = {
		// indicator: false,
		// demographics: false,
		// links: false,
		// copy: false
		type: 'indicator', //indicator, demographics, links, copy
		which: null //the specific indicator, link, demo field, copystring

	}
	@computed get title(){
		const {type, which} = this.modifying
		let titleString = ''
		if(type && !which){
			titleString = type==='indicator'? 'Choose an indicator.' 
				: type==='demographics'? 'Do you want to modify county demographic or statewide data?' 
				: type === 'links'? 'Modifying footer links' 
				: 'Modifying copy text'
		}

		return titleString
	}
	@action modify = (property) => {
		if(property = 'indicator'){

		}
		else{
			this.modifying[property] = !this.modifying[property]
		}
	}

	render(){
		return(
			<h1>{this.title}</h1>
		)
	}	
}

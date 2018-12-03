import React from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'


import combo from '../utilities/trungCombo'

@observer
export default class SearchInput extends React.Component{
	@observable searchstring = ''
	@action searchAction = combo((val) => {
		console.log('update with val')
	}, 300)

	render(){
		return(
			<div>
			<input
				onChange = {(e)=>this.searchAction(e.target.value)}
			/>
			</div>
		)
	}
}
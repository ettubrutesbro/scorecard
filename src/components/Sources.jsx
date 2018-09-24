import React from 'react'
// import {observable, action} from 'mobx'
// import {observer} from 'mobx-react'
import styled from 'styled-components'

import {find} from 'lodash'

import sources from '../data/sources'

export default class Sources extends React.Component{
	
	render(){
		const fullView = this.props.fullView
		const {indicator, race, year} = this.props.store
		const src = find(sources, (o)=>{return o.indicator === indicator})

		return(
			<SourcesPanel
				onClick = {this.props.onClick}
			>
				{!fullView &&
					<DefaultSourcesView onClick = {this.props.onClick}/>
				}
				{fullView &&
					<FullSourcesView src = {src} indicator = {indicator}/>
					// indicator.source, indicator.url,
					// indicator.project,
					// indicator.dateRetrieved,
					// indicator.projectURL

				}
			</SourcesPanel>
		)
	}
}

const DefaultSourcesView = (props) => {
	return(
		<div>
			Click to view sources and notes. 
		</div>
	)
}

const FullSourcesView = (props)=> {
	const {src,indicator} = props
	return(
		<div>
			{!src && `Error: no source for indicator (data typo likely) ${indicator} `}

			<SourceBlock>
				<h3>SOURCE</h3>
				<h1>{src.source}</h1>
				<a>{src.url}</a>
			</SourceBlock>

			{src.project && 
				<SourceBlock>
				<h3>project</h3>
				<h1>{src.project}</h1>
				<a>{src.projectURL}</a>
				</SourceBlock>
			}

			<SourceBlock>
				<h3>date retrieved</h3>
				<h1>{src.dateRetrieved}</h1>
			</SourceBlock>
		</div>
	)
}


const SourcesPanel = styled.div`
	
`

const SourceBlock = styled.div`
	margin-top: 15px;
	h3, a{
		font-size: 13px;
		font-weight: bold;
		letter-spacing: 0.1px;
	}
	h1{
		font-size: 16px;
		font-weight: normal;
		margin: 0;
	}
	h3{
		margin: 0;
		padding: 0;
		color: var(--fainttext);
		text-transform: uppercase;
	}
	a{
		color: var(--strokepeach);
	}

`

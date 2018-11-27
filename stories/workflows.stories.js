import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'

import IndicatorList from '../src/components/IndicatorList'
import CountyList from '../src/components/CountyList'

addDecorator(withKnobs)
storiesOf('Workflows',module)
.add('IndicatorList',()=>{
	return <IndicatorList 
		store = {{
			// county: 'sanLuisObispo'
		}}
	/>
})
.add('CountyList',()=>{
	return <CountyList 
		store = {{
			// county: 'sanLuisObispo'
		}}
	/>
})

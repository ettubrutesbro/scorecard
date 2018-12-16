
import React from 'react';
import styled from 'styled-components'
import { storiesOf, addDecorator } from '@storybook/react';
import {withViewport} from '@storybook/addon-viewport'
import {withKnobs, select, color, number, text} from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links';
import '../src/global.css'

import MobileScorecard from '../src/MobileScorecard'

addDecorator(withViewport('iphone6'))

storiesOf('Mobile version', module).add('MobileScorecard', ()=>{

	return(
		<MobileScorecard 
			store = {{
				indicator: 'earlyPrenatalCare'
			}}
		/>
	)
})
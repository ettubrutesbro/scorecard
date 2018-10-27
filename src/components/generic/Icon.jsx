import React from 'react'
import styled from 'styled-components'

const icons = {
	x: (<polygon points="17.9,3.8 16.2,2.1 10,8.2 3.8,2.1 2.1,3.8 8.2,10 2.1,16.2 3.8,17.9 10,11.8 16.2,17.9 17.9,16.2 
    11.8,10 "/>),

}

const IconSvg = styled.svg`

`

export const Icon = (props) => {
	return (
		<IconSvg
			className = {'icon-'+props.img} 
			style = {{
				fill: `var(--${props.color})`
			}}
		>
			{icons[props.img]}
		</IconSvg>
	)
}

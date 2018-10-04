import {createGlobalStyle} from 'styled-components'
import media from '../utilities/media'

const GlobalStyle = createGlobalStyle`
	.listitem{
		@media ${media.optimal}{
			font-size: 16px;
			letter-spacing: .7px;
		}
		@media ${media.compact}{
			font-size: 13px;
			letter-spacing: .5px;
		}
	}
`

export default GlobalStyle
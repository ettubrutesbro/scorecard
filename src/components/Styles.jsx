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

	.title{
	    font-size: 24px;
	    letter-spacing: .92px;
	    font-weight: 400;
	    @media ${media.optimal}{
			font-size: 24px;
		}
	    @media ${media.compact}{
	    	font-size: 20px;
	    }
	}

`

export default GlobalStyle
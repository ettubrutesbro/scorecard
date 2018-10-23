import {createGlobalStyle} from 'styled-components'
import media from '../utilities/media'

const GlobalStyle = createGlobalStyle`

    body{
        &::before{
            position: absolute;
            top: 0;
            content: '';
            width: 100%;
            background: var(--offwhitebg);
            @media ${media.optimal}{
                height: 90px;
            }
            @media ${media.compact}{
                height: 75px;
            }
            z-index: 3;

        }
        &::after{
            position: absolute;
            content: '';
            width: 100%;
            background: var(--offwhitebg);
            @media ${media.optimal}{
                top: 960px;
                height: 75px;
            }
            @media ${media.compact}{
                top: 740px;
                height: 75px;
            }
            z-index: 0;

        }
    }

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
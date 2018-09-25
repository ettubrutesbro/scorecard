import {css} from 'styled-components'
import media from '../utilities/media'

const floatingCorner = css`
    border-radius: 12px;
    background-color: var(--offwhitefg);
    box-shadow: var(--shadow);
`

const flushHard = css`
    border: 2px solid #d7d7d7;
    /*padding: 20px;*/
    /*background-color: var(--offwhitefg);*/
`


export {floatingCorner, flushHard}
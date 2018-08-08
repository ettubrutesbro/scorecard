import React from 'react'
import styled, {keyframes} from 'styled-components'

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'

const ContextBox = styled.div`
    padding: 0 30px 30px 30px;
`

export default class Context extends React.Component{
    render(){
        const {indicator, county, race} = this.props.store
        return(
            <ContextBox>
                {county && 'county demographic data'}
            </ContextBox>
        )    
    }
}
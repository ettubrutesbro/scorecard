import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'

import Icon from './components/generic/Icon'

import IndicatorByCounties from '../src/components/IndicatorByCounties'
import IndicatorByRaces from '../src/components/IndicatorByRaces'
import Readout from '../src/components/Readout'

@observer
export default class MobileScorecard extends React.Component{
    componentDidMount(){

    }
    render(){
        const {store} = this.props
        return(
            <div>
                <NavBar store = {store}/>
                <Content>
                    <Readout store = {store} />
                    <Tables>
                    <IndicatorByCounties
                        entries = {9}
                        store = {store}
                    />
                    <IndicatorByRaces
                        store = {store}
                        expand = {true}
                        mobile = {true}
                    />
                    </Tables>
                </Content>
            </div>
        )
    }
}

const NavBar = (props) => {
    return(
        <SemiFixedBar>
            <SearchIcon img = "searchzoom" color = 'white'/>
                    Refine or restart your search...
        </SemiFixedBar>
    )
}
const SearchIcon = styled(Icon)`
    width: 15px; height: 15px;
`
const SemiFixedBar = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: 55px;
    background: var(--offwhitebg);
    padding: 10px;
    color: white;
    display: flex; align-items: center;
    z-index: 2;
`
const Content = styled.div`
    position: absolute;
    top: 0;
    height: 100vh;
    width: 100%;
    background: var(--offwhitefg);
    z-index: 1;
    margin-top: 55px;
    padding: 10px 20px;
`
const Tables = styled.div`
    margin-top: 25px;
`
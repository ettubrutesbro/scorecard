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

    @observable 

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
                <SectionChooser>
                    <BreakdownBtn />
                    <DemoBtn />
                    <SourcesBtn />
                </SectionChooser>
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
    margin-right: 10px;
`
const SemiFixedBar = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: 55px;
    background: var(--offwhitebg);
    padding: 0 20px;
    color: white;
    display: flex; align-items: center;
    z-index: 2;
    font-size: 14px;
`
const Content = styled.div`
    position: absolute;
    top: 0;
    /*height: 100vh;*/
    width: 100%;
    overflow: hidden;
    background: var(--offwhitefg);
    z-index: 1;
    margin-top: 55px;
    padding: 10px 20px 80px 20px;
    margin-bottom: 67px;
`
const Tables = styled.div`
    position: relative;
    margin-top: 25px;
    height: 495px;
`
const SectionChooser = styled.div`
    position: fixed;
    height: 67px;
    border-top: 1px solid var(--fainttext);
    background: white;
    width: 100%;
    bottom: 0;
    z-index: 1;
`
const SectionBtn = styled.div`
    
`
const BreakdownBtn = styled(SectionBtn)`
    
`
const DemoBtn = styled(SectionBtn)`
    
`
const SourcesBtn = styled(SectionBtn)`
    
`
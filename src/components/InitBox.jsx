import React from 'react'
import styled from 'styled-components'
import {Button} from './generic'
import media from '../utilities/media'

const Box = styled.div`
    margin-top: -100px;
    position: absolute;
    /*width: 500px;*/
    /*top: 50px;*/
    /*left: 500px;*/
    line-height: 170%;
    /*border: 2px solid var(--bordergrey);*/
    /*padding: 35px;*/
    z-index: 12;
    h1{ font-size: 24px;
        margin-bottom: 60px;
        font-weight: medium;
     }
     p{
        margin-bottom: 20px;
        letter-spacing: .4px;
     }
    @media ${media.optimal}{
        width: 60%; 
        padding: 0 100px;
    }
    @media ${media.compact}{
        width: 60%;
        padding: 0 50px;
    }
`

export default class InitBox extends React.Component{
    componentDidMount(){
        console.log('init box: ', this.props.store.browser)
    }

    render(){
        return(
            <Box>
                <h1>
                    2018-19 California County Scorecard of Children’s Well-Being
                </h1>
                <p>
                The 2018-19 California Scorecard of Children’s Well-Being provides a comprehensive snapshot of how children are faring in each of the 58 counties, over time, and by race and ethnicity.
                </p>
                <p>
                    Data that has been suppressed due to small sample size or large margin of error, or data that is unavailable is in grey.
                </p>

                <Start>
                    <CompatibilityNote> 
                        This tool supports Chrome (65 and newer), Safari (10+), and Firefox (54+).
                    </CompatibilityNote>
                    <StartButton
                        className = 'negative'
                        label = {
                            <BtnLabel>
                                Get started
                                <Icon />
                            </BtnLabel>
                            }
                        onClick = {this.props.closeSplash}
                    />
                </Start>
                
            </Box>
        )
    }
}
const Start = styled.div`

    margin-top: 45px;
    /*display: flex;*/
    align-items: center;
`
const CompatibilityNote = styled.div`
    font-size: 13px;
    /*margin-right: 15px;*/
    margin-bottom: 18px;
    color: var(--fainttext);
`
const StartButton = styled(Button)`
    white-space: nowrap;
    font-size: 18px;
    letter-spacing: 1px;
    padding: 14px 20px 14px 30px;
`

const BtnLabel = styled.div`
    display: inline-flex;
    align-items: center;
`
const arrow = require('../assets/getstarted.svg')
const Icon = styled.div`
    width: 30px;
    margin-left: 10px;
    background-size: cover;
    height: 30px;
    background-image: url(${arrow});
    &:hover{
        background-position: 100% center;
    }
`
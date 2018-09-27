import React from 'react'
import styled from 'styled-components'

import media from '../utilities/media'

const Box = styled.div`
    position: absolute;
    /*width: 500px;*/
    /*top: 50px;*/
    /*left: 500px;*/
    line-height: 170%;
    /*border: 2px solid var(--bordergrey);*/
    /*padding: 35px;*/
    z-index: 12;
    h1{ font-size: 24px;
        margin-bottom: 40px;
        font-weight: normal;
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
const Button = styled.div`
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-top: 25px;
    /*border: 1px solid var(--strokepeach);*/
    background: black;
    color: white;
    @media ${media.optimal}{
        font-size: 24px;
        letter-spacing: .6px;
        padding: 15px 35px;
    }
    @media ${media.compact}{
        letter-spacing: .4px;
        padding: 10px 25px;     
    }
`

export default class InitBox extends React.Component{
    render(){
        return(
            <Box>
                <h1>
                    2018 California Scorecard of Children’s Well-being
                </h1>
                <p>
                An interactive, online report, the 2018-19 California County Scorecard of Children’s Well-Being delivers a current and comprehensive picture of children’s circumstances in every one of California’s 58 counties.</p>
                <p>
                Numbers and percentages are rounded to the nearest whole number. Some data has been suppressed due to small sample size or large margin of error. Some data is unavailable.
                </p>
                <Button
                    onClick = {this.props.closeSplash}
                >
                    Get Started > 
                </Button>
            </Box>
        )
    }
}
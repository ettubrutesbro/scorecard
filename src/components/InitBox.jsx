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
// const Button = styled.div`
//     cursor: pointer;
//     display: inline-flex;
//     align-items: center;
//     margin-top: 25px;
//     /*border: 1px solid var(--strokepeach);*/
//     background: black;
//     color: white;
//     @media ${media.optimal}{
//         font-size: 24px;
//         letter-spacing: .6px;
//         padding: 15px 35px;
//     }
//     @media ${media.compact}{
//         letter-spacing: .4px;
//         padding: 10px 25px;     
//     }
// `

export default class InitBox extends React.Component{
    render(){
        return(
            <Box>
                <h1>
                    2018 California Scorecard of Children’s Well-being
                </h1>
                <p>
                The 2018-19 California Scorecard of Children’s Well-Being provides a comprehensive snapshot of how children are faring in each of the 58 counties, over time, and by race and ethnicity.
                </p>
                <p>
Data that has been suppressed due to small sample size, large margin of error, or which is otherwise unavailable is colored grey.
                </p>
                <StartButton
                    className = 'negative'
                    label = 'Get Started >'
                    onClick = {this.props.closeSplash}
                />
                
            </Box>
        )
    }
}

const StartButton = styled(Button)`
    margin-top: 25px;
`
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {Button} from './generic'
import media from '../utilities/media'
import {capitalize} from '../utilities/toLowerCase'

import browserCompatibility from '../data/browserCompatibility'

const Box = styled.div`
    @media ${media.optimal}{
        margin-top: -100px;   
    }
    @media ${media.compact}{
        margin-top: -75px;
    }
    position: absolute;

 /*   display: flex;
    flex-direction: column;
    align-items: flex-end;*/
    /*width: 500px;*/
    /*top: 50px;*/
    /*left: 500px;*/
    line-height: 170%;
    /*border: 2px solid var(--bordergrey);*/
    /*padding: 35px;*/
    z-index: 12;
    h1{ font-size: 24px;
        @media ${media.optimal}{
            margin-bottom: 60px;   
        }
        @media ${media.compact}{
            margin-bottom: 35px;
        }
        font-weight: medium;
     }
     p{
        margin-bottom: 20px;
        letter-spacing: .4px;
        @media ${media.compact}{
            padding-left: 50px;
        }
     }
    @media ${media.optimal}{
        width: 60%; 
        padding: 0 100px;
    }
    @media ${media.compact}{
        width: 60%;
        padding-right: 30px;
        /*padding: 0 50px;*/
    }
`

@observer
export default class InitBox extends React.Component{
    @observable browserBlock = null
    @action blockUserBrowser = (why) => this.browserBlock = why

    componentDidMount(){
        const {store} = this.props
        const browserName = store.browser.name
        const ver = store.browser.version
        if(!Object.keys(browserCompatibility).includes(browserName)){
            this.blockUserBrowser('browser')
        }else{
            if(ver >= browserCompatibility[browserName]){
                //it's fine
            }else{
                this.blockUserBrowser('version')
            }
        }
    }

    render(){
        const {store} = this.props
        console.log(capitalize('chrome'))
        console.log(capitalize('fux'))
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
                    {!this.browserBlock &&
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
                    }
                    {this.browserBlock &&
                        <BlockUser>
                            <BlockContext>
                            {this.browserBlock === 'version' &&
                                `Sorry, this application doesn't support your version (${store.browser.version}) of ${store.browser.name === 'ie'? 'Internet Explorer' : capitalize(store.browser.name)}. Please upgrade to version ${browserCompatibility[store.browser.name]} or greater.`
                            }
                            {this.browserBlock === 'browser' &&
                                `Sorry, this application doesn't support ${store.browser.name === 'ie'? 'Internet Explorer' : 'your browser'} - please visit us using a recent version of Google Chrome, Mozilla Firefox, or Safari!`
                            }
                            </BlockContext>
                            <BlockAction>
                                <Button
                                    className = 'negative'
                                    label = {
                                        <BtnLabel>
                                            Back to Children Now
                                        </BtnLabel>
                                        }
                                    onClick = {()=>{
                                        window.open('https://childrennow.org')
                                    }}
                                />
                            </BlockAction>
               

                        </BlockUser>
                    }
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
            @media ${media.compact}{
            padding-left: 50px;
        }
`
const StartButton = styled(Button)`
    white-space: nowrap;
    font-size: 18px;
    letter-spacing: 1px;
    padding: 14px 20px 14px 30px;
    @media ${media.compact}{
            margin-left: 50px;
        }
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

const BlockUser = styled.div`
            @media ${media.compact}{
            padding-left: 50px;
        }

`
const BlockContext = styled.p`
    margin-top: -5px;
        padding: 25px 35px;
    background: var(--faintpeach);
    border: 1px solid var(--strokepeach);
    color: var(--normtext);
`
const BlockAction = styled.div`
    display: flex;
    justify-content: flex-end;
`

const CNButton = styled(StartButton)`
    padding: 14px 30px 14px 30px;
`
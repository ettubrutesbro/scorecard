import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import {Button} from './generic'
import media from '../utilities/media'
import {capitalize} from '../utilities/toLowerCase'

import browserCompatibility from '../data/browserCompatibility'
import copy from './InitCopy'

const Box = styled.div`

    @media ${media.optimal}{
        margin-top: -100px;   
    }
    @media ${media.compact}{
        margin-top: -75px;
    }
    position: absolute;
    left: 15px;
    line-height: 170%;
    z-index: 2;
    h1{ 
        font-size: 24px;
        @media ${media.optimal}{
            margin-bottom: 60px;   
        }
        @media ${media.compact}{
            margin-bottom: 35px;
        }
        font-weight: medium;
        opacity: ${props=>props.show?1:0};
        transition: opacity .35s;
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
        width: 57%;
        padding-right: 30px;
        /*padding: 0 50px;*/
    }
    transform: translateX(${props=>props.show?0:'20%'});
    pointer-events: ${props => props.show? 'auto' : 'none'};
    transition: transform .35s;
`

const FirstPara = styled.p`
    transform: translateX(${props=>props.show?0:25}px);
    opacity: ${props=>props.show? 1 : 0};
    transition: transform .35s, opacity .35s;
`
const SecondPara = styled.p`
    transform: translateX(${props=>props.show?0:50}px);
    opacity: ${props=>props.show? 1 : 0};
    transition: transform .35s, opacity .35s;
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
        const {store, show} = this.props
        return store.screen!=='mobile'?(
            <Box show = {show}>
                <h1> {copy.title}</h1>
                <FirstPara show = {show}> {copy.firstpara} </FirstPara>
                <SecondPara show = {show}> {copy.secondpara} </SecondPara>

                <Start show = {show}>
                    <CompatibilityNote show = {show}>{copy.compatibility}</CompatibilityNote>
                    {!this.browserBlock &&
                    <StartButton
                        show = {show}
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
        ):(
            <MobileVer>
                <article>
                    <h1>{copy.title}</h1>
                    <p>{copy.firstpara}</p>
                    <p>{copy.secondpara}</p>
                    <aside>{copy.compatibility}</aside>
                    <MobileStartButton 
                        className = {'negative'}
                        label = 'Get started'
                    />
                </article>

            </MobileVer>
        )
    }
}

const MobileVer = styled.div`
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    article {
        position: relative;
        border: 1px solid var(--bordergrey);
        padding: 30px 20px 45px 20px;
        font-size: 14px; letter-spacing: 0.5px;
        h1{
            font-size: 16px;
            top: 0; left: 0;
            position: absolute;
            transform: translateY(-50%);
            margin: 0 15px;
            padding: 0 15px;
            background: var(--offwhitefg);
        }
        aside{
            // display: block;
            // text-align: left;
            // width: 100%;
            font-size: 12px;
            color: var(--fainttext);
        }
        &::before{
            content: '';
            position: absolute;
            bottom: -1px;
            right: 15px;
            width: 150px;
            height: 1px;
            background: var(--offwhitefg);
            margin-top: 1;
        }
    }
`
const MobileStartButton = styled(Button)`
    position: absolute; bottom: 0;
    right: 30px;
    transform: translateY(50%);
    z-index: 2;

`

const Start = styled.div`
    opacity: ${props => props.show? 1 : 0};
    transition: opacity .35s;
    margin-top: 45px;
    /*display: flex;*/
    align-items: center;
`
const CompatibilityNote = styled.div`
    font-size: 13px;
    /*margin-right: 15px;*/
    margin-bottom: 18px;
    color: var(--fainttext, grey);
    transform: translateX(${props=>props.show?0:125}px);
    transition: transform .35s;
`
const StartButton = styled(Button)`
    white-space: nowrap;
    font-size: 18px;
    letter-spacing: 1px;
    padding: 14px 20px 14px 30px;
    transform: translateX(${props=>props.show?0:250}px);
    transition: transform .35s;
    &:hover{
        figure{
            background-position: 100% center;
        }
    }
`

const BtnLabel = styled.div`
    display: inline-flex;
    align-items: center;
`
const arrow = require('../assets/getstarted.svg')
const Icon = styled.figure`
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
`
const BlockContext = styled.p`
    margin-top: -5px;
        padding: 25px 35px;
    background: var(--faintpeach);
    border: 1px solid var(--strokepeach, red);
    color: var(--normtext, black);
`
const BlockAction = styled.div`
    display: flex;
    justify-content: flex-end;
`

const CNButton = styled(StartButton)`
    padding: 14px 30px 14px 30px;
`
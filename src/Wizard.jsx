
import React from 'react'
import styled from 'styled-components'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import flows from './assets/wizardcopy'

@observer
export default class Wizard extends React.Component {
    
    @observable step = 'init' 
    @observable value = ''
    @observable lineage = ['init']

    @action edit = (step, value, index) => {
        console.log(this.step, 'goto' , step)

        this.step = step
        if(value) this.value = value

        if(index===0){
            //clicked first entry, clears lineage
            this.lineage = ['init']
        }
        else if(!index && !this.lineage.includes(step)){
            //forward movement: push soon-to-be-former step to the array
            this.lineage.push(step) 
        } else {
            this.lineage[index] = step
            this.lineage.length = (index+1)
        }

        console.log(this.lineage.toJS())


    }
    render(){
        return(
            <div>
            <Nav>
                {this.lineage.length === 2 && '< '}
                {this.lineage.map((step, i, lineage)=>{
                    return i < lineage.length - 1 ? <span onClick = {()=>{
                        this.edit(step, this.value, i)
                    }}> 
                        {i>0 && '> '}
                        {flows[step].dynamicShorthand && flows[step].dynamicShorthand(this.value)}
                        {!flows[step].dynamicShorthand && flows[step].shorthand}
                        
                    </span>: ''
                })}
            </Nav>
            <h1>{flows[this.step].title}</h1>
            <OptionList>
            {flows[this.step].options.map((option)=>{
                return(
                    <Option onClick = {()=>this.edit(option.goTo, option.value || '')}>
                        <h3>{option.label}</h3>
                        <p>{option.context}</p>
                    </Option>
                )
            })}
            </OptionList>
            </div>
        )
    }
}   

const OptionList = styled.ul`
    list-style-type: none;
`
const Option = styled.li`
    display: flex;
    align-items: center;
    border: 1px solid black;
    padding: 15px;
    h3{ margin-right: 15px; }
`
const Nav = styled.h3`
    span:not(:first-of-type){
        margin-left: 15px;
    }

`


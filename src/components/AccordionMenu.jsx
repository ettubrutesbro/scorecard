import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import FlipMove from 'react-flip-move'

import styles from './AccordionMenu.module.css'

import Button, {ButtonGroup} from './Button'

import counties from '../data/counties'

@observer
export default class AccordionMenu extends React.Component{

    @observable expanded = null
    @action expand = (section) => {
        if(this.expanded === section){
            this.expanded = null
            return
        }
        this.expanded = section
    }
    render(){
        return(
            <div className = {styles.accordionMenu}>
                <FlipMove>
                    <div className = {[styles.countyGroup, styles.group].join(' ')}>
                        <div className = {styles.groupTitle}> By county </div>
                        <div className = {styles.searchContainer}> 
                            <input /> 
                        </div> 
                        <div onClick = {()=> {this.expand('counties')}}> 
                            {this.expanded !== 'counties' && 'See list' }
                            {this.expanded === 'counties' && 'Hide list' }
                        </div>
                    </div>
                    {this.expanded === 'counties' && 
                        <div className = {styles.countyList}>
                            {counties.map((county)=>{
                                return <div className = {styles.county}> {county.label} </div>
                            })
                            }
                        </div>
                    }
                    <div className = {[styles.category, styles.group].join(' ')}>
                        By category
                        <div className = {styles.categories}>
                            <ButtonGroup 
                                options = {[
                                    {name: 'Health'},
                                    {name: 'Education'},
                                    {name: 'Welfare'},
                                ]}
                            />
                        </div>
                    </div>
                    


                    <div className = {[styles.ageRaceGroup, styles.group].join(' ')}>
                        By age / race group
                        <ButtonGroup 
                            multiLine = {true}
                            options = {[
                                {name: 'American Indian'},
                                {name: 'Asian'},
                                {name: 'Black'},
                                {name: 'Latinx'},
                                {name: 'Pacific Islander'},
                                {name: 'White'},
                            ]}
                        />
                    </div>
                </FlipMove>
            </div>
        )
    }
}
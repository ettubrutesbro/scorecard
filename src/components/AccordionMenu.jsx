import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { map } from 'lodash'

import FlipMove from 'react-flip-move'

import styles from './AccordionMenu.module.css'

import Button, { ButtonGroup } from './Button'

import counties from '../data/counties'

@observer
export default class AccordionMenu extends React.Component {
    @observable expanded = null
    @observable filters = {
        indicatorCategories: [],
        ageRaceGroup: []
    }
        @action addFilter = (filter, filterType) => {
            const target = this.filters[filterType]
            if(target.includes(filter)){
                target.splice(target.indexOf(filter),1)
                if(filterType === 'indicatorCategories' && target.length === 0) this.expand('categories')
            }
            else{
                target.push(filter)
                if(filterType === 'indicatorCategories' && target.length === 1) this.expand('categories')
            }
        }
    @observable filterCategories = []
    @action expand = section => {
        if (this.expanded === section) {
            this.expanded = null
            return
        }
        this.expanded = section
    }
    render() {
        return (
            <div className={styles.accordionMenu}>
                <FlipMove
                    duration = {500}
                    staggerDurationBy = {-50}
                    // staggerDelayBy = {10}
                    enterAnimation = {{
                        from: {opacity: -.5, transform: 'translateX(125px)'},
                        to: {opacity: 1, transform: 'translateY(0)'},
                    }}
                    leaveAnimation = {{
                        from: {opacity: 1, transform: 'translateY(0)'},
                        to: {opacity: -.5, transform: 'translateX(-125px)'},
                    }}
                >
                    <div
                        className={[styles.countyGroup, styles.group].join(' ')}
                    >
                        <div className={styles.groupTitle}> By county </div>
                        <div className={styles.searchContainer}>
                            <input />
                        </div>
                        <div
                            onClick={() => {
                                this.expand('counties')
                            }}
                        >
                            {this.expanded !== 'counties' && 'See list'}
                            {this.expanded === 'counties' && 'Hide list'}
                        </div>
                    </div>
                    {this.expanded === 'counties' && (
                        <div className={styles.countyList}>
                            {counties.map(county => {
                                return (
                                    <div className={styles.county}>
                                        {' '}
                                        {county.label}{' '}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className={[styles.category, styles.group].join(' ')}>
                        By category
                        <div className={styles.categories}>
                            <ButtonGroup
                                options={[
                                    {
                                        name: 'Health',
                                        optionClass: this.filters.indicatorCategories.includes('health')? styles.selectedCategory: '',
                                        onClick: () => {this.addFilter('health','indicatorCategories')},
                                    },
                                    {
                                        name: 'Education',
                                        optionClass: this.filters.indicatorCategories.includes('education')? styles.selectedCategory: '',
                                        onClick: () => {this.addFilter('education','indicatorCategories')},
                                    },
                                    {
                                        name: 'Welfare',
                                        optionClass: this.filters.indicatorCategories.includes('welfare')? styles.selectedCategory: '',
                                        onClick: () => {this.addFilter('welfare','indicatorCategories')},
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    {this.expanded === 'categories' && (
                        <div className={styles.indicators}>
                            <ul className = {styles.list}>
                            {map(this.props.indicators, ind => {
                                return <li> {ind.name} </li>
                            })}
                            </ul>
                        </div>
                    )}

                    <div
                        className={[styles.ageRaceGroup, styles.group].join(
                            ' '
                        )}
                    >
                        By age / race group
                        <ButtonGroup
                            multiLine={true}
                            optionClass = {styles.ageRaceOption}
                            options={[
                                { 
                                    name: 'American Indian', 
                                    optionClass: this.filters.ageRaceGroup.includes('americanindian')? styles.selected : '',
                                    onClick: ()=>{this.addFilter('americanindian','ageRaceGroup')}
                                },
                                { 
                                    name: 'Asian', 
                                    optionClass: this.filters.ageRaceGroup.includes('asian')? styles.selected : '',
                                    onClick: ()=>{this.addFilter('asian','ageRaceGroup')}
                                },
                                { 
                                    name: 'Black', 
                                    optionClass: this.filters.ageRaceGroup.includes('black')? styles.selected : '',
                                    onClick: ()=>{this.addFilter('black','ageRaceGroup')}
                                },
                                { 
                                    name: 'Latinx', 
                                    optionClass: this.filters.ageRaceGroup.includes('latinx')? styles.selected : '',
                                    onClick: ()=>{this.addFilter('latinx','ageRaceGroup')}
                                },
                                { 
                                    name: 'Pacific Islander', 
                                    optionClass: this.filters.ageRaceGroup.includes('pacificislander')? styles.selected : '',
                                    onClick: ()=>{this.addFilter('pacificislander','ageRaceGroup')}
                                },
                                { 
                                    name: 'White', 
                                    optionClass: this.filters.ageRaceGroup.includes('white')? styles.selected : '',
                                    onClick: ()=>{this.addFilter('white','ageRaceGroup')}
                                },
                            ]}
                        />
                    </div>
                </FlipMove>
            </div>
        )
    }
}

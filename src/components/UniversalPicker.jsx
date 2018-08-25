import React from 'react'
import styled from 'styled-components'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

import { findIndex } from 'lodash'

import Toggle from './Toggle'

import indicators from '../data/indicators'
import { counties } from '../assets/counties'
import semanticTitles from '../assets/semanticTitles'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 480px;
`
const Row = styled.div`
    input {
        flex-grow: 1;
        height: 100%;
        padding: 10px;
    }
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Results = styled.div`
    margin: 10px;
    padding: 20px;
    flex-grow: 1;
    border: 1px solid black;
`
const Btn = styled.div`
    background: black;
    color: white;
    padding: 10px;
`
const Button = props => {
    return <Btn onClick={props.onClick}> {props.label} </Btn>
}

@observer
export default class UniversalPicker extends React.Component {
    @observable searchCounties = null
    @observable searchIndicators = null
    @action
    setSearchString = (which, value) => {
        this['search' + which] = value
    }
    render() {
        const { store } = this.props
        const { county, indicator, year, race } = store

        const ind = indicators[indicator]

        const flatIndicatorList = Object.keys(indicators)
        const flatCountyList = counties.map(county => {
            return county.label.toLowerCase()
        })

        const raceOptions =
            !indicator ||
            (indicator && ind.categories.includes('hasRace'))
                ? [
                        { label: 'All', value: null },
                        {
                            label: 'Asian',
                            value: 'asian',
                            disabled:
                                indicator &&
                                county &&
                                (ind.counties[county].asian[year]==='' ||
                                ind.counties[county].asian[year]==='*')
                        },
                        {
                            label: 'Black',
                            value: 'black',
                            disabled:
                                indicator &&
                                county &&
                                (ind.counties[county].black[year]==='' ||
                                ind.counties[county].black[year]==='*')
                        },
                        {
                            label: 'Latinx',
                            value: 'latinx',
                            disabled:
                                indicator &&
                                county &&
                                (ind.counties[county].latinx[year]==='' ||
                                ind.counties[county].latinx[year]==='*')
                        },
                        {
                            label: 'White',
                            value: 'white',
                            disabled:
                                indicator &&
                                county &&
                                (ind.counties[county].white[year]==='' ||
                                ind.counties[county].white[year]==='*')
                        },
                  ]
                : ''

        return (
            <Wrapper>
                <Row>
                    Indicator:
                    <Button
                        label="See all indicators"
                        onClick={() => {
                            store.setWorkflow('indicator')
                        }}
                    />
                </Row>
                {/*this.searchIndicators && (
                    <Results>
                        {flatIndicatorList
                            .filter(ind => {
                                return ind
                                    .toLowerCase()
                                    .includes(
                                        this.searchIndicators.toLowerCase()
                                    )
                            })
                            .map(item => {
                                return <div>{semanticTitles[item].label}</div>
                            })
                            .slice(0, 10)}
                    </Results>
                )*/}
                <Row>
                    County: 
                    <Button
                        label="See county list"
                        onClick={() => {
                            store.setWorkflow('county')
                        }}
                    />
                </Row>
                {/*this.searchCounties && (
                    <Results>
                        {flatCountyList
                            .filter(county => {
                                return county.includes(
                                    this.searchCounties.toLowerCase()
                                )
                            })
                            .map(item => {
                                return <div>{item}</div>
                            })
                            .slice(0, 10)}
                    </Results>
                )*/}
                {(!indicator ||
                    ind.categories.includes('hasRace')) && (
                    <Row>
                        Race:
                        <Toggle
                            options={raceOptions}
                            onClick={value =>
                                store.completeWorkflow('race', value)
                            }
                            selected={
                                !race
                                    ? 0
                                    : findIndex(raceOptions, o => {
                                            return o.value === race
                                      })
                            }
                        />
                    </Row>
                )}
                {indicator &&
                    ind.years.length > 1 && (
                        <Row>
                            Year:
                            <Toggle
                                options={ind.years.map(
                                    (yr, i) => {
                                        const disabled = county? ind.counties[county][race||'totals'][i]==='' || ind.counties[county][race||'totals'][i]==='*' : false
                                        return { 
                                            label: yr, 
                                            value: i, 
                                            disabled: disabled
                                        }
                                    }
                                )}
                                selected={year}
                                onClick={value =>
                                    store.completeWorkflow('year', value)
                                }
                            />
                        </Row>
                    )}
            </Wrapper>
        )
    }
}

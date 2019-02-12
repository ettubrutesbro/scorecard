import React from 'react';
import styled from 'styled-components'

import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

import {camelLower} from './utilities/toLowerCase.js'


const request=require('request')
const csv = require('csvtojson')
const jsonFormat = require('json-pretty-html').default

const HtmlToReactParser = require('html-to-react').Parser

function rawJSONtoAppJSON(input, hasRace, indicatorname, years, categories){
  let indicatorLocations = {}
  input.map((blob)=>{ 

    let sortedBlobKeys = {}

    if(hasRace) {
      sortedBlobKeys = {
        ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
        black: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('aa')}),
        white: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('white')}),
        asian: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('asian')}),
        latinx: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('latino')}),
        other: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('other')}),
        totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
      }
    }
    else{
      sortedBlobKeys = {
        ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
        totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
      }
    }

    // console.log(sortedBlobKeys)

    let newBlob = {}

    Object.keys(sortedBlobKeys).forEach((key)=>{
      newBlob[key] = []
      sortedBlobKeys[key].forEach((specifickey)=>{
        newBlob[key].push(blob[specifickey])
        // console.log(blob.Location ,specifickey, blob[specifickey])
      })
    })
    indicatorLocations[camelLower(blob.Location)] = newBlob
  })

  return {
    indicator: camelLower(indicatorname),
    semantics: {},
    years: years,
    keywords: [],
    categories: categories,
    counties: indicatorLocations
  }
}



const JSONBlob = styled.div`
  width: 200px;
  height: 300px;
  border: 1px solid black;
`

@observer
export default class App extends React.Component {
  @observable invalidLink = false
  @action queryCSV = (string) => {
    const link = request(string, function(error,response,body){
      if(error || response.statusCode === 404){
        this.invalidLink = true
        console.log('error or 404')
      }

      else this.invalidLink = false
      console.log(response)

    })

    if(this.invalidLink) return
    csv().fromStream(link)
      .then((jsonObj)=>{
        // this.setOutput(jsonObj)
        const appJSON = rawJSONtoAppJSON(jsonObj, false, 'UpToDateImmunizations', [2017,2018], ['health'] )
        this.setOutput(jsonFormat(appJSON))
        // this.setOutput(JSON.stringify(jsonFormat.plain(jsonObj)))
      })
  }
  @observable output = (<JSONBlob />)
  @action setOutput = (val) => {
    var htmlToReactParser = new HtmlToReactParser();
    var reactElement = htmlToReactParser.parse(val);
    // var reactHtml = ReactDOMServer.renderToStaticMarkup(reactElement);
    this.output = (reactElement)

  }
  render() {
    return (
      <div>
        <h3> Please paste a link to a Google sheets CSV below: </h3>
        <CSVPasteArea 
          onChange = {(e)=>{
            this.queryCSV(e.target.value)
          }}
        />
        <h3> Resultant JSON </h3>

        <OutputArea 

        />

        {this.output}


      </div>
    );
  }
}

const CSVPasteArea = styled.input`
  padding: .75rem;
  border: 1px solid black;
  font-size: 16px;
  width: 600px;
`
const OutputArea = styled.textarea`
  padding: .75rem; 
  font-size: 16px;
  width: 100%;
  height: 600px;
`


function formatJSONForScorecard(input, hasRace, indicatorname, years, categories){
  console.log(indicatorname)
  let indicatorLocations = {}
  input.map((blob)=>{ // should be forEach
    // console.log(blob)
    // const newKeys = ['ranks', 'black', 'white', 'asian', 'latinx', 'other', 'totals']

    let sortedBlobKeys = {}

    if(hasRace) {
      sortedBlobKeys = {
        ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
        black: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('aa')}),
        white: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('white')}),
        asian: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('asian')}),
        latinx: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('latino')}),
        other: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('other')}),
        totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
      }
    }
    else{
      sortedBlobKeys = {
        ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
        totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
      }
    }

    // console.log(sortedBlobKeys)

    let newBlob = {}

    Object.keys(sortedBlobKeys).forEach((key)=>{
      newBlob[key] = []
      sortedBlobKeys[key].forEach((specifickey)=>{
        newBlob[key].push(blob[specifickey])
        // console.log(blob.Location ,specifickey, blob[specifickey])
      })
    })
    indicatorLocations[camelLower(blob.Location)] = newBlob
  })

  return {
    indicator: camelLower(indicatorname),
    years: years,
    categories: categories,
    counties: indicatorLocations
  }

}
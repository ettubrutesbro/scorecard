// import react
import * as React from 'react';
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
// be sure to import d3 - run npm install --save d3 first!
import * as d3 from 'd3';
// also import topojson so we work with topologically clean geographic files
// this will improve performance and reduce load time
// npm install --save topojson
import * as topojson from 'topojson-client'
// also import lodash
import * as _ from 'lodash';
// and import a custom component called State
// we'll get to this a bit later

const url = require('./assets/us-atlas.json')

console.log(d3.geoAlbers)

@observer
export default class Map extends React.Component {

  @observable mapData = ''

  @action setData = (data) => {
    this.mapData = data
  }
  
  componentDidMount() {
    // send off a request for the topojson data
    console.log('mounted')
    console.log(d3.json)

    d3.json(url, (error, us) => {
        if(error) console.log('error!!!!!')
        console.log(us)
        this.setData(us)
    });
  }
  
  // let's define a method for rendering paths for each state
  generateStatePaths = (geoPath, data) => {
    const generate = () => {
      let states = _.map(data, (feature, i) => {
        
        // generate the SVG path from the geometry
        let path = geoPath(feature);
        return <State path={path} key={i} />;
      })
      return states;
    }
    
    let statePaths = generate();
    return statePaths;
  }
  
  render() {
    
    // create a geographic path renderer
    let geoPath = d3.geoPath();
    let data = this.mapData // or, the reference to the data in the reducer, whichever you are using
    
    // call the generateStatePaths method
    let statePaths = this.generateStatePaths(geoPath, url);
    console.log(statePaths)
    return (
        <svg id='map-container'>
            <g id='states-container'>
                {statePaths}
            </g>
        </svg>
    ); 
  }
}


const State = (props) => {
  
  return <path className='states' d={props.path} fill="#6C7680"
  stroke="#FFFFFF" strokeWidth={0.25} />;
};
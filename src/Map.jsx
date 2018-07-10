import React from 'react'

import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography
} from 'react-simple-maps'

import * as topojson from 'topojson-client'

const calcounty = require('./assets/caCountiesTopoSimple.json')
const usa = require('./assets/us-atlas.json')

console.log(usa.objects.states)
console.log(calcounty.objects.subunits)

const combinedGeo = (topojson.mergeArcs(usa, [calcounty.objects.subunits,usa.objects.states]))

// const combinedGeo = calcounty.objects.subunits.concat(usa.objects.subunits)

console.log(combinedGeo)


export default class Map extends React.Component{

    render(){
      return(
      <div
        style = {{border: '1px solid black'}}
      >
        <ComposableMap
          projection = "mercator"
          // projectionConfig = {{scale: 2000}}
        >
          <ZoomableGroup zoom = {1} center = {[-119,37.55]}>
          <Geographies 
              // geography={calcounty}
              // geography={usa.objects}
          >
            {(geographies, projection) => geographies.map(geography => (
              <Geography
                key={ geography.id }
                geography={ geography }
                projection={ projection }
                onClick = {(g,e)=>{console.log(g)}}
                />
            ))}
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
    }
}
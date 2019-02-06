// const fs = require('fs')

import indicators from '../data/indicators.mjs'
import semanticTitles from '../assets/semanticTitles.mjs'

import jsonFile from 'jsonFile'

Object.keys(indicators).forEach((ind)=>{
	const {indicator, ...indObj} = indicators[ind]
	const semanticTitle = semanticTitles[ind]

	const mergedObj = {
		indicator: indicator,
		semantics: {...semanticTitle},
		...indObj,
	}

	const file = `./newData/${indicator}.json`
	console.log(file)
	jsonFile.writeFile(file, mergedObj, (error)=>{console.log(error)})
})

// require("../data/indicators")
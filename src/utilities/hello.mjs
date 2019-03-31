// const fs = require('fs')



import indicators from '../data/indicators.mjs'
import semanticTitles from '../assets/semanticTitles.mjs'

// import jsonFile from 'jsonFile'
import json2csv from 'json2csv'
// console.log(json2csv)


Object.keys(indicators).forEach((ind, i)=>{
	const indicator = indicators[ind]
	console.log(indicator.indicator)
	const foo = Object.values(indicator.counties).map((cty,it)=>{
		//location, rank (yr1), totals(yr1), all races(yr1)....yr2

		const propertiesMappedByYear = [].concat(...indicator.years.map((yr,ind)=>{
			if(indicator.categories.includes('hasRace')){
				return [cty.ranks[ind], cty.totals[ind], cty.asian[ind], cty.black[ind], cty.latinx[ind], cty.white[ind]]
			}
			else return [cty.ranks[ind], cty.totals[ind]]
		}))

		return [
			Object.keys(indicator.counties)[it], //location
			...propertiesMappedByYear

		]
	})

	console.log(foo)

	if(i===0){
		// console.log(indicator)
		// console.log(json2csv.parse({indicator}))
	}
	// const {indicator, ...indObj} = indicators[ind]
	// const semanticTitle = semanticTitles[ind]

	// const mergedObj = {
	// 	indicator: indicator,
	// 	semantics: {...semanticTitle},
	// 	...indObj,
	// }

	// const file = `./${indicator}.csv`
	// console.log(file)
	// jsonFile.writeFile(file, mergedObj, (error)=>{console.log(error)})
})

function formatJSONForScorecard(file, label){
	let indicatorLocations = {}
	file.map((locationblob)=>{ // should be forEach
		console.log(blob)
		let ranks = Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank') })
		console.log(ranks)
		ranks = ranks.map((rank)=>{
			return blob[rank]!==undefined && blob[rank]!==""? blob[rank] : false
		})
		indicatorLocations[blob.location] = {
			rank: ranks 
		}
	})

	return {
		indicator: label || 'Early Prenatal Care',
		counties: indicatorLocations
	}

}

export default formatJSONForScorecard
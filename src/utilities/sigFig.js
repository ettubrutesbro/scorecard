import commaNumber from 'comma-number'

export default function sigFig(number){
	if(number>=1000000){
		return (number / 1000000).toPrecision(2) + ' million'
	}
	else if(number>=1000){
		return commaNumber((number / 1000).toPrecision(3) * 1000)
	}
	else return number
	// else console.log('sigFig didnt know what to do with' , number)
}

export function rawSigFig(number){
		if(number>=1000000){
			return (number / 1000000).toPrecision(2) * 1000000
		}
		else if(number>=1000){
			return (number / 1000).toPrecision(3) * 1000
		}
		else return number
}
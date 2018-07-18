// import * as welfare from './welfare/index.js'
// import * as education from './education/'

import notFoodInsecure from './NotFoodInsecure.json'
import earlyPrenatalCare from './EarlyPrenatalCare.json'
import registeredToVote from './RegisteredToVote.json'

const indicators = {

	notFoodInsecure: notFoodInsecure,
	earlyPrenatalCare: earlyPrenatalCare,	
	registeredToVote: registeredToVote,

    // //welfare
    // welfareMock: welfare.welfareMock,
    // noFoodInsecurity: welfare.noFoodInsecurity,
    // //education
    // edumacation: education.edumacation,

}
console.log(indicators)
export default indicators
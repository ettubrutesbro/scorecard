// import * as welfare from './welfare/index.js'
// import * as education from './education/'

import notFoodInsecure from './NotFoodInsecure.json'
import earlyPrenatalCare from './EarlyPrenatalCare.json'
import registeredToVote from './RegisteredToVote.json'
import upToDateVaccinations from './UpToDateVaccinations.json'
import lowIncomeDental from './LowIncomeDental.json'
import collegeCareerReady from './CollegeCareerReady.json'

const indicators = {

    notFoodInsecure: notFoodInsecure,
    earlyPrenatalCare: earlyPrenatalCare,   
    registeredToVote: registeredToVote,
    upToDateVaccinations: upToDateVaccinations,
    lowIncomeDental: lowIncomeDental,
    collegeCareerReady: collegeCareerReady,

    // //welfare
    // welfareMock: welfare.welfareMock,
    // noFoodInsecurity: welfare.noFoodInsecurity,
    // //education
    // edumacation: education.edumacation,

}
console.log(indicators)
export default indicators
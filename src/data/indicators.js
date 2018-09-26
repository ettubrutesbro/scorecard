// import * as welfare from './welfare/index.js'
// import * as education from './education/'

import notFoodInsecure from './NotFoodInsecure.json'
import earlyPrenatalCare from './EarlyPrenatalCare.json'
import registeredToVote from './RegisteredToVote.json'
import upToDateVaccinations from './UpToDateVaccinations.json'
import lowIncomeDental from './LowIncomeDental.json'
import collegeCareerReady from './CollegeCareerReady.json'
import allegations from './Allegations.json'
// import availableSlot from './AvailableSlot.json'
// import breastFeeding from './BreastFeeding.json'
import childCareSlots from './ChildCareSlots.json'
import collegeLevelMath from './CollegeLevelMath.json'
import englishLearners from './EnglishLearners.json'
import enrolled34 from './Enrolled34.json'

const indicators = {

    notFoodInsecure: notFoodInsecure,
    earlyPrenatalCare: earlyPrenatalCare,   
    registeredToVote: registeredToVote,
    upToDateVaccinations: upToDateVaccinations,
    lowIncomeDental: lowIncomeDental,
    collegeCareerReady: collegeCareerReady,



    //final batch?
    collegeLevelMath: collegeLevelMath,
    englishLearners: englishLearners,
    enrolled34: enrolled34,
    // availableSlot: availableSlot,
    allegations: allegations,
    // breastFeeding: breastFeeding,
    childCareSlots: childCareSlots,

    // //welfare
    // welfareMock: welfare.welfareMock,
    // noFoodInsecurity: welfare.noFoodInsecurity,
    // //education
    // edumacation: education.edumacation,

}
console.log(indicators)
export default indicators
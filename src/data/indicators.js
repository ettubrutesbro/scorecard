// import * as welfare from './welfare/index.js'
// import * as education from './education/'

import notFoodInsecure from './NotFoodInsecure.json'
import earlyPrenatalCare from './EarlyPrenatalCare.json'
import registeredToVote from './RegisteredToVote.json'
import upToDateVaccinations from './UpToDateVaccinations.json'
import lowIncomeDental from './LowIncomeDental.json'
import collegeCareerReady from './CollegeCareerReady.json'
import allegations from './Allegations.json'


//formatting issues
// import availableSlot from './AvailableSlot.json'
// import breastFeeding from './BreastFeeding.json'

//year rank discrepancy
// import collegeLevelMath from './CollegeLevelMath.json'

// black/AA issue
// import FamilyLike from './FamilyLike.json'

import childCareSlots from './ChildCareSlots.json'
import englishLearners from './EnglishLearners.json'
import enrolled34 from './Enrolled34.json'
import FosterYouthGraduation from './FosterYouthGraduation.json'
import FRPMSchoolYear from './FRPMSchoolYear.json'
import FRPMSummer from './FRPMSummer.json'
import FYTimelyDental from './FYTimelyDental.json'
import FYTimelyMedical from './FYTimelyMedical.json'

const indicators = {

    notFoodInsecure: notFoodInsecure,
    earlyPrenatalCare: earlyPrenatalCare,   
    registeredToVote: registeredToVote,
    upToDateVaccinations: upToDateVaccinations,
    lowIncomeDental: lowIncomeDental,
    collegeCareerReady: collegeCareerReady,


    //final batch:

    //non-working
    // collegeLevelMath: collegeLevelMath,
    // availableSlot: availableSlot,
    // breastFeeding: breastFeeding,
    // FamilyLike: FamilyLike,

    //working: 
    englishLearners: englishLearners,
    enrolled34: enrolled34,
    allegations: allegations,
    childCareSlots: childCareSlots,
    FosterYouthGraduation: FosterYouthGraduation,
    FRPMSchoolYear: FRPMSchoolYear,
    FRPMSummer: FRPMSummer,
    FYTimelyDental: FYTimelyDental,
    FYTimelyMedical: FYTimelyMedical,


}
console.log(indicators)
export default indicators
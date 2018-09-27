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
import breastFeeding from './breastFeeding.json'
import MathStandards8 from './mathStandards8.json'

//year rank discrepancy
import collegeLevelMath from './collegeLevelMath.json'

// black/AA issue
import FamilyLike from './familyLike.json'

//asterisked numbers and no ranks
import ReadToEveryday from './readToEveryday.json'


//provisionally working:
import childCareSlots from './ChildCareSlots.json'
import englishLearners from './EnglishLearners.json'
import enrolled34 from './Enrolled34.json'
import FosterYouthGraduation from './FosterYouthGraduation.json'
import FRPMSchoolYear from './FRPMSchoolYear.json'
import FRPMSummer from './FRPMSummer.json'
import FYTimelyDental from './FYTimelyDental.json'
import FYTimelyMedical from './FYTimelyMedical.json'

import Graduation from './Graduation.json'
import HealthInsurance from './HealthInsurance.json'
import NotAbsent from './NotAbsent.json'
import NotLowBirthWeight from './NotLowBirthWeight.json'
import NotObese from './NotObese.json'
import Permanency from './Permanency.json'
import PlacementStability from './PlacementStability.json'
import ReadingStandards from './ReadingStandards.json'
import Suspension from './Suspension.json'

const indicators = {




    //non-working
    // MathStandards8: MathStandards8,

    //working: 

    allegations: allegations,
    breastFeeding: breastFeeding,
    childCareSlots: childCareSlots,
    collegeCareerReady: collegeCareerReady,
    collegeLevelMath: collegeLevelMath,
    earlyPrenatalCare: earlyPrenatalCare,   
    englishLearners: englishLearners,
    enrolled34: enrolled34,
    FamilyLike: FamilyLike,
    FosterYouthGraduation: FosterYouthGraduation,
    FRPMSchoolYear: FRPMSchoolYear,
    FRPMSummer: FRPMSummer,
    FYTimelyDental: FYTimelyDental,
    FYTimelyMedical: FYTimelyMedical,
    Graduation: Graduation,
    HealthInsurance: HealthInsurance,
    lowIncomeDental: lowIncomeDental,
    NotAbsent: NotAbsent,
    notFoodInsecure: notFoodInsecure,
    NotLowBirthWeight: NotLowBirthWeight,
    NotObese: NotObese,
    Permanency: Permanency,
    PlacementStability: PlacementStability,
    ReadingStandards: ReadingStandards,
    ReadToEveryday: ReadToEveryday,
    registeredToVote: registeredToVote,
    Suspension: Suspension,
    upToDateVaccinations: upToDateVaccinations,


}
console.log(indicators)
export default indicators
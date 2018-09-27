// import * as welfare from './welfare/index.js'
// import * as education from './education/'

import notFoodInsecure from './indicators/NotFoodInsecure.json'
import earlyPrenatalCare from './indicators/EarlyPrenatalCare.json'
import registeredToVote from './indicators/RegisteredToVote.json'
import upToDateVaccinations from './indicators/UpToDateVaccinations.json'
import lowIncomeDental from './indicators/LowIncomeDental.json'
import collegeCareerReady from './indicators/CollegeCareerReady.json'
import allegations from './indicators/Allegations.json'


//formatting issues
import breastFeeding from './indicators/BreastFeeding.json'
import MathStandards8 from './indicators/MathStandards8.json'

//year rank discrepancy
import collegeLevelMath from './indicators/CollegeLevelMath.json'

// black/AA issue
import FamilyLike from './indicators/FamilyLike.json'

//asterisked numbers and no ranks
import ReadToEveryday from './indicators/ReadToEveryday.json'


//provisionally working:
import childCareSlots from './indicators/ChildCareSlots.json'
import englishLearners from './indicators/EnglishLearners.json'
import enrolled34 from './indicators/Enrolled34.json'
import FosterYouthGraduation from './indicators/FosterYouthGraduation.json'
import FRPMSchoolYear from './indicators/FRPMSchoolYear.json'
import FRPMSummer from './indicators/FRPMSummer.json'
import FYTimelyDental from './indicators/FYTimelyDental.json'
import FYTimelyMedical from './indicators/FYTimelyMedical.json'

import Graduation from './indicators/Graduation.json'
import HealthInsurance from './indicators/HealthInsurance.json'
import NotAbsent from './indicators/NotAbsent.json'
import NotLowBirthWeight from './indicators/NotLowBirthWeight.json'
import NotObese from './indicators/NotObese.json'
import Permanency from './indicators/Permanency.json'
import PlacementStability from './indicators/PlacementStability.json'
import ReadingStandards from './indicators/ReadingStandards.json'
import Suspension from './indicators/Suspension.json'

const indicators = {
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
    MathStandards8: MathStandards8,
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
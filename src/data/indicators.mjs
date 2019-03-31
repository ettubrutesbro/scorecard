// import * as welfare from './welfare/index.js'
// import * as education from './education/'

import notFoodInsecure from './indicators/notFoodInsecure.json'
import earlyPrenatalCare from './indicators/earlyPrenatalCare.json'
import registeredToVote from './indicators/registeredToVote.json'
import upToDateImmunizations from './indicators/upToDateImmunizations.json'
import lowIncomeDental from './indicators/lowIncomeDental.json'
import collegeCareerReady from './indicators/collegeCareerReady.json'
import allegations from './indicators/allegations.json'


//formatting issues
import breastFeeding from './indicators/breastFeeding.json'
import MathStandards8 from './indicators/mathStandards8.json'

//year rank discrepancy
import collegeLevelMath from './indicators/collegeLevelMath.json'

// black/AA issue
import FamilyLike from './indicators/familyLike.json'

//asterisked numbers and no ranks
import ReadToEveryday from './indicators/readToEveryday.json'


//provisionally working:
import childCareSlots from './indicators/childCareSlots.json'
import englishLearners from './indicators/englishLearners.json'
import enrolled34 from './indicators/enrolled34.json'
import FosterYouthGraduation from './indicators/fosterYouthGraduation.json'
import FRPMSchoolYear from './indicators/fRPMSchoolYear.json'
import FRPMSummer from './indicators/fRPMSummer.json'
import FYTimelyDental from './indicators/fYTimelyDental.json'
import FYTimelyMedical from './indicators/fYTimelyMedical.json'

import Graduation from './indicators/graduation.json'
import HealthInsurance from './indicators/healthInsurance.json'
import NotAbsent from './indicators/notAbsent.json'
import NotLowBirthWeight from './indicators/notLowBirthWeight.json'
import NotObese from './indicators/notObese.json'
import Permanency from './indicators/permanency.json'
import PlacementStability from './indicators/placementStability.json'
import ReadingStandards from './indicators/readingStandards.json'
import Suspension from './indicators/suspension.json'

import connected from './indicators/connected'
import difference from './indicators/difference'

const indicators = {
    // allegations: allegations,
    earlyPrenatalCare: earlyPrenatalCare,   
    breastFeeding: breastFeeding,
    notLowBirthWeight: NotLowBirthWeight,
    lowIncomeDental: lowIncomeDental,
    upToDateImmunizations: upToDateImmunizations,
    healthInsurance: HealthInsurance,
    notFoodInsecure: notFoodInsecure,
    notObese: NotObese,
    readToEveryday: ReadToEveryday,
    childCareSlots: childCareSlots,
    enrolled34: enrolled34,
    readingStandards: ReadingStandards,
    mathStandards8: MathStandards8,
    englishLearners: englishLearners,
    suspension: Suspension,
    notAbsent: NotAbsent,
    connected: connected,
    difference: difference,
    FRPMSchoolYear: FRPMSchoolYear,
    FRPMSummer: FRPMSummer,
    graduation: Graduation,
    collegeCareerReady: collegeCareerReady,
    collegeLevelMath: collegeLevelMath,
    registeredToVote: registeredToVote,
    permanency: Permanency,
    placementStability: PlacementStability,
    familyLike: FamilyLike,
    FYTimelyDental: FYTimelyDental,
    FYTimelyMedical: FYTimelyMedical,
    fosterYouthGraduation: FosterYouthGraduation,
}

export const featuredInds = [
    'collegeLevelMath',
    'earlyPrenatalCare',
    'permanency',
    'upToDateImmunizations',
    'FYTimelyDental'
]

console.log(indicators)
export default indicators
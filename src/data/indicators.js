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

const indicators = {
    allegations: allegations,
    breastFeeding: breastFeeding,
    childCareSlots: childCareSlots,
    collegeCareerReady: collegeCareerReady,
    collegeLevelMath: collegeLevelMath,
    earlyPrenatalCare: earlyPrenatalCare,   
    englishLearners: englishLearners,
    enrolled34: enrolled34,
    familyLike: FamilyLike,
    fosterYouthGraduation: FosterYouthGraduation,
    FRPMSchoolYear: FRPMSchoolYear,
    FRPMSummer: FRPMSummer,
    FYTimelyDental: FYTimelyDental,
    FYTimelyMedical: FYTimelyMedical,
    graduation: Graduation,
    healthInsurance: HealthInsurance,
    lowIncomeDental: lowIncomeDental,
    mathStandards8: MathStandards8,
    notAbsent: NotAbsent,
    notFoodInsecure: notFoodInsecure,
    notLowBirthWeight: NotLowBirthWeight,
    notObese: NotObese,
    permanency: Permanency,
    placementStability: PlacementStability,
    readingStandards: ReadingStandards,
    readToEveryday: ReadToEveryday,
    registeredToVote: registeredToVote,
    suspension: Suspension,
    upToDateImmunizations: upToDateImmunizations,


}
console.log(indicators)
export default indicators
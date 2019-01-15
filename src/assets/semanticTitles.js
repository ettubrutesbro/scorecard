const semanticTitles = {

    'earlyPrenatalCare': {
        descriptor: 'pregnant',
        who: 'women',
        what: 'received prenatal care beginning the first trimester',
        label: 'Pregnant women who received prenatal care beginning the first trimester',
        shorthand: 'Early prenatal care'
    },
    'notFoodInsecure': {
        who: 'children',
        what: 'were not food insecure',
        label: 'Children who were not food insecure',
        shorthand: 'Not food insecure'
    },
    'registeredToVote': {
        who: '18-25-year-olds',
        shortWho: '18-25 y/o\'s',
        what: 'were registered to vote',
        label: '18-25-year-olds registered to vote',
        shorthand: 'Young adult voter registration'
    },
    'collegeCareerReady': {
        who: 'students',
        what: 'were college- or career-ready',
        label: 'Students who were college- or career-ready',
        shorthand: 'College / career readiness'
    },
    'lowIncomeDental': {
        descriptor: 'Low-income',
        who: 'children',
        shortWho: '0-5 y/o\'s',
        what: ', ages birth-5, had visited a dentist in the last year',
        label: 'Children, ages birth-5, of low-income families, who had visited a dentist in the last year',
        shorthand: 'Low-income families\' dental visits'
    },
    'upToDateImmunizations': {
        who: 'Kindergarteners',
        what: 'had up-to-date immunizations',
        label: 'Kindergarteners with up-to-date immunizations',
        shorthand: 'Up-to-date immunizations'
    },

    'connected':{
        who: 'students',
        what: 'reported feeling connected to their school',
        label: 'Students who reported feeling connected to their school',
        shorthand: 'Feeling connected to school'
    },
    'difference':{
        who: 'students',
        what: 'reported feeling like they did things at school that made a difference',
        label: 'Students who reported feeling like they do things at school that make a difference',
        shorthand: 'Feeling school makes a difference'
    },
    'breastFeeding': {
        who: 'newborns',
        what: 'were exclusively breastfed while in the hospital',
        label: 'Newborns who were exclusively breastfed while in the hospital',
        shorthand: 'Newborns breastfed in hospital'
    },
    'childCareSlots': {
        who: 'children',
        what: 'with parents in the labor force for whom a licensed child care slot was available',
        label: 'Children with parents in the labor force for whom a licensed child care slot was available',
        shorthand: 'Child care slots for working parents'
    },
    'collegeLevelMath': {
        who: 'students',
        what: 'were ready or conditionally ready for college-level math courses',
        label: 'Students who were ready or conditionally ready for college-level math courses',
        shorthand: 'College math readiness'
    },
    'englishLearners': {
        who: 'English language learners',
        shortWho: 'ELL students',
        what: 'gained proficiency in English',
        label: 'English Language Learners who gained proficiency in English',
        shorthand: 'English language learner proficiency'
    },
    'enrolled34': {
        who: '3- and 4-year-olds',
        shortWho: '3-4 y/o\'s',
        what: 'enrolled in preschool or transitional kindergarten',
        label: '3- and 4-year-olds enrolled in preschool or transitional kindergarten',
        shorthand: 'Preschool/transitional kindergarten'
    },
    'familyLike': {
        who: 'adolescents in the child welfare system',
        shortWho: 'adolescents',
        what: 'were placed in family-like settings',
        label: 'Adolescents in the child welfare system who were placed in family-like settings',
        shorthand: 'Adolescents placed in family-like settings'
    },
    'fosterYouthGraduation': {
        who: 'youth in foster care',
        what: 'graduated high school on time',
        label: 'Youth in foster care who graduated high school on time',
        shorthand: 'Graduating youth in foster care'
    },
    'FRPMSchoolYear': {
        descriptor: 'eligible',
        who: 'students',
        what: 'received free or reduced-price meals during the school year',
        label: 'Eligible students who received free or reduced-price meals during the school year',
        shorthand: 'Free/reduced $ meals, school year'
    },
    'FRPMSummer': {
        descriptor: 'eligible',
        who: 'students',
        what: 'received free or reduced-price meals during the summer',
        label: 'Eligible students who received free or reduced-price meals during the summer',
        shorthand: 'Free/reduced $ meals, summer'
    },
    'FYTimelyDental': {
        who: 'children',
        shortWho: 'children',
        what: 'in the child welfare system had a timely dental exam',
        label: 'Children in the child welfare system who had a timely dental exam',
        shorthand: 'Dental exams in child welfare'
    },
    'FYTimelyMedical': {
        who: 'children',
        shortWho: 'children',
        what: 'in the child welfare system had a timely medical exam',
        label: 'Children in the child welfare system who had a timely medical exam',
        shorthand: 'Medical exams in child welfare'
    },
    'graduation': {
        who: '12th-graders',
        what: 'graduated high school on time',
        label: '12th-graders who graduated high school on time',
        shorthand: 'On-time high school graduation'
    },
    'healthInsurance': {
        who: 'children',
        what: 'had health insurance',
        label: 'Children who had health insurance',
        shorthand: 'Children\'s health insurance' 
    },
    'mathStandards8': {
        who: '8th-graders',
        what: 'met or exceeded grade-level standards in math',
        label: '8th-graders who met or exceeded grade-level standards in math',
        shorthand: '8th grade math standards'
    },
    'notAbsent': {
        who: 'students',
        what: 'were not chronically absent from school',
        label: 'Students who were not chronically absent from school',
        shorthand: 'Chronic absence from school'
    },
    'notLowBirthWeight': {
        who: 'newborns',
        what: 'were not low birthweight',
        label: 'Newborns who were not low birthweight',
        shorthand: 'Not low birthweight'
    },
    'notObese': {
        who: '7th-graders',
        what: 'were not overweight or obese',
        label: '7th-graders who were not overweight or obese',
        shorthand: '7th grade overweight / obesity'
    },
    'permanency': {
        who: 'children',
        shortWho: 'children',
        what: 'in the child welfare system exited to permanency within one year',
        label: 'Children in the child welfare system who exited to permanency within one year',
        shorthand: 'Child welfare exits to permanency'
    },
    'placementStability': {
        who: 'children',
        shortWho: 'children',
        what: 'in the child welfare system had been in one placement after 24 months in care',
        label: 'Children in the child welfare system who had been in one placement after 24 months in care',
        shorthand: 'Child welfare placement stability'
    },
    'readingStandards': {
        who: '3rd-graders',
        what: 'read near or above grade-level standards',
        label: '3rd-graders who read near or above grade-level standards',
        shorthand: '3rd-grade reading standards'
    },
    'readToEveryday': {
        who: 'children',
        shortWho: 'children',
        what: ', ages birth-5, were read to everyday by an adult',
        label: 'Children, ages birth-5, who were read to everyday by an adult',
        shorthand: 'Children read to everyday'
    },
    'suspension': {
        who: 'student suspensions',
        shortWho: 'students',
        what: 'were not due to "defiance/disruption"',
        label: 'Student suspensions not due to "defiance/disruption"',
        shorthand: 'Suspensions not due to defiance/disruption'
    },
    'foo': {
        who: 'bar',
        what: 'bar',
        label: 'bar',
        shorthand: 'bar'
    },
}

export default semanticTitles


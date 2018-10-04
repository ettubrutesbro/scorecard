const semanticTitles = {
    // 'EarlyPrenatalCare': 'of pregnant women get early prenatal care',
    // 'NotFoodInsecure': ' of children don\'t have to deal with food insecurity',
    // 'RegisteredToVote': ' of people are registered to vote..?'

    'earlyPrenatalCare': {
        descriptor: 'pregnant',
        who: 'women',
        what: 'got early prenatal care',
        label: 'Pregnant women who get early prenatal care',
        shorthand: 'Early prenatal care'
    },
    'notFoodInsecure': {
        who: 'children',
        what: 'didn\'t have to deal with food insecurity',
        label: 'Children that don\'t face food insecurity',
        shorthand: 'Food insecurity'
    },
    'registeredToVote': {
        who: 'youths, ages 18-25,',
        what: 'were registered to vote',
        label: 'People who\'re registered to vote',
        shorthand: 'Voter registration'
    },
    'collegeCareerReady': {
        who: 'students',
        what: 'were college or career ready',
        label: 'Students who are college or career ready',
        shorthand: 'College / career readiness'
    },
    'lowIncomeDental': {
        descriptor: 'Low-income',
        who: 'children, ages 0-5,',
        what: 'had visited a dentist within the last year',
        label: 'Low-income children, age 0-5, who saw a dentist in the last year',
        shorthand: 'Dental visits for low-income children'
    },
    'upToDateImmunizations': {
        who: 'Kindergarteners',
        what: 'were up-to-date on their vaccines',
        label: 'Kindergarteners with up-to-date vaccines',
        shorthand: 'Kindergartener vaccination'
    },
    'allegations': {
        who: 'children, ages birth-18,',
        what: 'had not reportedly suffered abuse/neglect within 12 months',
        label: 'Children, ages birth-18, with no report of abuse or neglect in a 12 month time period',
        shorthand: 'Abuse and neglect'
    },
    'breastFeeding': {
        who: 'newborns',
        what: 'were exclusively breastfed while in the hospital',
        label: 'Newborns exclusively breastfed while in the hospital',
        shorthand: 'Breastfeeding in-hospital'
    },
    'childCareSlots': {
        who: 'children with parents in the labor force',
        what: 'had a licensed child care slot available',
        label: 'Children with parents in the labor force for whom a licensed child care slot is available',
        shorthand: 'Child care availability'
    },
    'collegeLevelMath': {
        who: 'students',
        what: 'were ready or conditionally ready for college-level math courses',
        label: 'Students who are ready or conditionally ready for college-level math courses',
        shorthand: 'College math readiness'
    },
    'englishLearners': {
        who: 'English-language-learning students',
        what: 'gained proficiency in English',
        label: 'English Language Learner students who gain proficiency in English',
        shorthand: 'English learner proficiency'
    },
    'enrolled34': {
        who: '3- and 4-year-olds',
        what: 'enrolled in preschool or transitional kindergarten',
        label: '3- and 4-year-olds enrolled in preschool or transitional kindergarten',
        shorthand: 'Preschool and kindergarten enrollment'
    },
    'familyLike': {
        who: 'adolescents in the child welfare system',
        what: 'were placed in family-like settings',
        label: 'Adolescents in the child welfare system who are placed in family-like settings',
        shorthand: 'Family-like settings for adolescents'
    },
    'fosterYouthGraduation': {
        who: 'foster youth',
        what: 'graduated high school on time',
        label: 'Foster youth who graduate high school on time',
        shorthand: 'Foster youth HS graduation'
    },
    'FRPMSchoolYear': {
        descriptor: 'eligible',
        who: 'students',
        what: 'received free and reduced price meals during the school year',
        label: 'Eligible students who receive free and reduced price meals during the school year',
        shorthand: 'School Year: Free/Discounted Meals'
    },
    'FRPMSummer': {
        descriptor: 'eligible',
        who: 'students',
        what: 'recieved free and reduced price meals during the summer',
        label: 'Eligible students who receive free and reduced price meals during the summer',
        shorthand: 'Summer: Free/Discounted Meals'
    },
    'FYTimelyDental': {
        who: 'children in the child welfare system',
        what: 'had a timely dental exam',
        label: 'Timely dental exams for children in the child welfare system',
        shorthand: 'Dental exams in child welfare'
    },
    'FYTimelyMedical': {
        who: 'children in the child welfare system',
        what: 'had a timely medical exam',
        label: 'Timely medical exams for children in the child welfare system',
        shorthand: 'Medical exams in child welfare'
    },
    'graduation': {
        who: '12th-graders',
        what: 'graduated high school on time',
        label: '12th-graders who graduated high school on time',
        shorthand: 'Timely high school graduation'
    },
    'healthInsurance': {
        who: 'children',
        what: 'had health insurance',
        label: 'Children with health insurance',
        shorthand: 'Children\'s health insurance' 
    },
    'mathStandards8': {
        who: '8th-graders',
        what: 'met or exceeded grade-level standards in math',
        label: '8th-graders who meet or exceed grade-level standards in math',
        shorthand: '8th grade math excellence'
    },
    'notAbsent': {
        who: 'students',
        what: 'were not chronically absent from school',
        label: 'Students who are not chronically absent from school',
        shorthand: 'Student chronic absence'
    },
    'notLowBirthWeight': {
        who: 'newborns',
        what: 'were not low birthweight',
        label: 'Newborns who are not low birthweight',
        shorthand: 'Newborn birthweight'
    },
    'notObese': {
        who: '7th-graders',
        what: 'were not overweight or obese',
        label: '7th graders who are not overweight or obese',
        shorthand: 'Obesity in 7th graders'
    },
    'permanency': {
        who: 'children in the child welfare system',
        what: 'exited to permanency within one year',
        label: 'Children in the child welfare system who exit to permanency within one year',
        shorthand: 'Permanency in child welfare'
    },
    'placementStability': {
        who: 'children in the child welfare system',
        what: 'had been in one placement after 24 months in care',
        label: 'Children in the child welfare system who have been in one placement after 24 months in care',
        shorthand: 'Placement stability in child welfare'
    },
    'readingStandards': {
        who: '3rd-graders',
        what: 'read near or above grade-level standards',
        label: '3rd-graders who read near or above grade-level standards',
        shorthand: '3rd grade reading standards'
    },
    'readToEveryday': {
        who: 'children, ages birth-5',
        what: 'were read to everyday by an adult',
        label: 'Children, ages birth-5, who are read to everyday by an adult',
        shorthand: 'Daily reading to children'
    },
    'suspension': {
        who: 'student suspensions',
        what: 'were not due to "defiance or disruption"',
        label: 'Student suspensions not due to "defiance/disruption"',
        shorthand: 'Suspensions for defiance/disruption'
    },
    'foo': {
        who: 'bar',
        what: 'bar',
        label: 'bar',
        shorthand: 'bar'
    },
}

export default semanticTitles
const semanticTitles = {

    'earlyPrenatalCare': {
        descriptor: 'pregnant',
        who: 'women',
        what: 'received prenatal care beginning the first trimester',
        label: 'Pregnant women who received prenatal care beginning the first trimester',
        shorthand: 'Prenatal Care'
    },
    'notFoodInsecure': {
        who: 'children',
        what: 'were not food insecure',
        label: 'Children who were not food insecure',
        shorthand: 'Not Food Insecure'
    },
    'registeredToVote': {
        who: '18-25-year-olds',
        shortWho: '18-25 y/o\'s',
        what: 'were registered to vote',
        label: '18-25-year-olds registered to vote',
        shorthand: 'Young Adult Voter Registration'
    },
    'collegeCareerReady': {
        who: 'students',
        what: 'were college- or career-ready',
        label: 'Students who were college- or career-ready',
        shorthand: 'College / career readiness'
    },
    'lowIncomeDental': {
        descriptor: 'Low-income',
        who: 'children, ages 0-5,',
        shortWho: '0-5 y/o\'s',
        what: 'had visited a dentist in the last year',
        label: 'Children, birth-5, of low-income families who had visited a dentist in the last year',
        shorthand: 'Children Dental Visits'
    },
    'upToDateImmunizations': {
        who: 'Kindergarteners',
        what: 'had up-to-date immunizations',
        label: 'Kindergarteners with up-to-date immunizations',
        shorthand: 'Up-to-Date Immunizations'
    },

    'connected':{
        who: 'students',
        what: 'reported feeling connected to their school',
        label: 'Students who reported feeling connected to their school',
        shorthand: 'Connection to School'
    },
    'difference':{
        who: 'students',
        what: 'reported feeling like they did things at school that made a difference',
        label: 'Students who reported feeling like they do things at school that make a difference',
        shorthand: 'Making a Difference at School'
    },
    'breastFeeding': {
        who: 'newborns',
        what: 'were exclusively breastfed while in the hospital',
        label: 'Newborns who were exclusively breastfed while in the hospital',
        shorthand: 'Newborns Breastfed in Hospital'
    },
    'childCareSlots': {
        who: 'children',
        what: 'with parents in the labor force for whom a licensed child care slot was available',
        label: 'Children with parents in the labor force for whom a licensed child care slot was available',
        shorthand: 'Child Care Slots'
    },
    'collegeLevelMath': {
        who: 'students',
        what: 'were ready or conditionally ready for college-level math courses',
        label: 'Students who were ready or conditionally ready for college-level math courses',
        shorthand: 'College Math Readiness'
    },
    'englishLearners': {
        who: 'English language learners',
        shortWho: 'ELL students',
        what: 'gained proficiency in English',
        label: 'English Language Learners who gained proficiency in English',
        shorthand: 'English Language Learner Proficiency'
    },
    'enrolled34': {
        who: '3- and 4-year-olds',
        shortWho: '3-4 y/o\'s',
        what: 'enrolled in preschool or transitional kindergarten',
        label: '3- and 4-year-olds enrolled in preschool or transitional kindergarten',
        shorthand: 'Preschool/Transitional Kindergarten'
    },
    'familyLike': {
        who: 'adolescents in the child welfare system',
        shortWho: 'adolescents',
        what: 'were placed in family-like settings',
        label: 'Adolescents in the child welfare system who were placed in family-like settings',
        shorthand: 'Adolescents Placed in Family-Like Settings'
    },
    'fosterYouthGraduation': {
        who: 'youth in foster care',
        what: 'graduated high school on time',
        label: 'Youth in foster care who graduated high school on time',
        shorthand: 'Youth in Foster Care Graduation'
    },
    'FRPMSchoolYear': {
        descriptor: 'eligible',
        who: 'students',
        what: 'received free or reduced-price meals during the school year',
        label: 'Eligible students who received free or reduced-price meals during the school year',
        shorthand: 'School-Year Free/Reduced-Price Meals'
    },
    'FRPMSummer': {
        descriptor: 'eligible',
        who: 'students',
        what: 'received free or reduced-price meals during the summer',
        label: 'Eligible students who received free or reduced-price meals during the summer',
        shorthand: 'Summer Free/Reduced-Price Meals'
    },
    'FYTimelyDental': {
        who: 'children in the child welfare system',
        shortWho: 'children',
        what: 'had a timely dental exam',
        label: 'Children in the child welfare system who had a timely dental exam',
        shorthand: 'Dental Exam for Children in Child Welfare'
    },
    'FYTimelyMedical': {
        who: 'children in the child welfare system',
        shortWho: 'children',
        what: 'had a timely medical exam',
        label: 'Children in the child welfare system who had a timely medical exam',
        shorthand: 'Medical Exam for Children in Child Welfare'
    },
    'graduation': {
        who: '12th-graders',
        what: 'graduated high school on time',
        label: '12th-graders who graduated high school on time',
        shorthand: 'On-Time High School Graduation'
    },
    'healthInsurance': {
        who: 'children',
        what: 'had health insurance',
        label: 'Children who had health insurance',
        shorthand: 'Children\'s Health Insurance' 
    },
    'mathStandards8': {
        who: '8th-graders',
        what: 'met or exceeded grade-level standards in math',
        label: '8th-graders who met or exceeded grade-level standards in math',
        shorthand: '8th Grade Math Standards'
    },
    'notAbsent': {
        who: 'students',
        what: 'were not chronically absent from school',
        label: 'Students who were not chronically absent from school',
        shorthand: 'Chronic Absence'
    },
    'notLowBirthWeight': {
        who: 'newborns',
        what: 'were not low birthweight',
        label: 'Newborns who were not low birthweight',
        shorthand: 'Not Low Birthweight'
    },
    'notObese': {
        who: '7th-graders',
        what: 'were not overweight or obese',
        label: '7th-graders who were not overweight or obese',
        shorthand: 'Not Overweight/Obese'
    },
    'permanency': {
        who: 'children in the child welfare system',
        shortWho: 'children',
        what: 'exited to permanency within one year',
        label: 'Children in the child welfare system who exited to permanency within one year',
        shorthand: 'Child Welfare Permanency'
    },
    'placementStability': {
        who: 'children in the child welfare system',
        shortWho: 'children',
        what: 'had been in one placement after 24 months in care',
        label: 'Children in the child welfare system who had been in one placement after 24 months in care',
        shorthand: 'Child Welfare Placement Stability'
    },
    'readingStandards': {
        who: '3rd-graders',
        what: 'read near or above grade-level standards',
        label: '3rd-graders who read near or above grade-level standards',
        shorthand: '3rd-Grade Reading Standards'
    },
    'readToEveryday': {
        who: 'children, ages birth-5',
        shortWho: 'children',
        what: 'were read to everyday by an adult',
        label: 'Children, ages birth-5, who were read to everyday by an adult',
        shorthand: 'Children Read to Everyday'
    },
    'suspension': {
        who: 'student suspensions',
        shortWho: 'students',
        what: 'were not due to "defiance/disruption"',
        label: 'Student suspensions not due to "defiance/disruption"',
        shorthand: 'Suspensions Not Defiance/Disruption'
    },
    'foo': {
        who: 'bar',
        what: 'bar',
        label: 'bar',
        shorthand: 'bar'
    },
}

export default semanticTitles


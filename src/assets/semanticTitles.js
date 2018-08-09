const semanticTitles = {
    // 'EarlyPrenatalCare': 'of pregnant women get early prenatal care',
    // 'NotFoodInsecure': ' of children don\'t have to deal with food insecurity',
    // 'RegisteredToVote': ' of people are registered to vote..?'

    'earlyPrenatalCare': {
        descriptor: 'pregnant',
        who: 'women',

        what: 'got early prenatal care',
        label: 'Pregnant women who get early prenatal care'
    },
    'notFoodInsecure': {
        who: 'children',
        what: 'didn\'t have to deal with food insecurity',
        label: 'Children that don\'t face food insecurity'
    },
    'registeredToVote': {
        who: 'youths, ages 18-25,',
        what: 'were registered to vote',
        label: 'People who\'re registered to vote'
    },
    'collegeCareerReady': {
        who: 'students',
        what: 'were college or career ready',
        label: 'Students who are college or career ready'
    },
    'lowIncomeDental': {
        descriptor: 'Low-income',
        who: 'children, ages 0-5,',
        what: 'had visited a dentist within the last year',
        label: 'Children, ages 0-5, who are low-income and have visited a dentist in the last year'
    },
    'upToDateVaccinations': {
        who: 'Kindergarteners',
        what: 'were up-to-date on their vaccines',
        label: 'Kindergarteners with up-to-date vaccines'
    }
}

export default semanticTitles
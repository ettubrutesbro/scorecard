import indicators from '../data/indicators'

const flows = {
        init: {
            title: 'What would you like to modify in the Scorecard?',
            shorthand: 'Choose data to edit',
            options: [
                {goTo: 'indicator', label: 'an Indicator', context: 'Data, copy, or sources/notes pertaining to a particular indicator.'},
                {goTo: 'demographics', label: 'Demographic data', context: 'Population counts or race percentages for California or any county.'},
                {goTo: 'sources', label: 'Sources and notes (batch)', context: 'Sources/notes, across multiple or all indicators.'},
                {goTo: 'links', label: 'Footer links', context: 'Link URLs in the Scorecard footer linking to Children Now\'s web pages, and the feedback email address.'},
            ]
        },
        indicator: {
            title: 'Pick an indicator.',
            shorthand: 'Indicators', 
            options: Object.keys(indicators).map((indicator)=>{
                const ind = indicators[indicator]
                return {
                    goTo: 'indicatorOptions', 
                    value: ind.indicator, 
                    label: ind.semantics.label,
                    context: ind.years.join(',')
                }
            })
            // ui: (<IndicatorList 

            // />),
        },
            indicatorOptions: {
                title: 'What would you like to change about this indicator?',
                dynamicShorthand: (value)=>{ return indicators[value].semantics.shorthand },
                options: [
                    {goTo: 'indicatorData', label: 'Data', context: 'Percentage numbers, categories, or years.'},
                    {goTo: 'indicatorSemantics', label: 'Language', context: 'Any labels or copy that refer to or describe indicators.'},
                    {goTo: 'indicatorSources', label: 'Sources / notes', context: 'Citations, links, and notes for this indicator.'},
                ]
            },
                indicatorData: {
                    title: 'How do you want to edit this indicator\'s data?',
                    shorthand: 'Change Data',
                    options: [
                        {goTo: 'indicatorLine', label: 'Go to Line', context: 'Pick a specific value to edit, and it\'ll be shown to you in the code for you to change (with instructions). Best for small, specific changes.'},
                        {goTo: 'indicatorSheet', label: 'From a Google Sheet', context: 'Use a Google Sheets link to generate a new indicator data file, which you\'ll replace the current file with. Best for making changes across multiple counties or for a race all at once.'}
                    ]
                },
                    indicatorLine: {
                        title: 'What values do you want to change?',
                        shorthand: 'foo',
                        options: [
                            {goTo: 'indicatorLinePct', label: 'Percentages', context: "This indicator's percentages for state, counties, and races."},
                            {goTo: 'indicatorLineCats', label: 'Categories', context: 'What categories this indicator falls into.'},
                            {goTo: 'indicatorLineYrs', label: 'Years', context: 'The year number(s) for indicator data. You can\'t add or remove years, just relabel them.'},
                        ]
                        // percentage, categories, years?
                    },

        demographics: {
            title: 'How do you want to edit the demographic data?',
            shorthand: 'Demographics',
            options: [
                {goTo: 'demographicsLine', label: 'by Line', context: 'Go to a specific county\'s (or CA) demographics and edit the data one value at a time.'},
                {goTo: 'demographicsBatch', label: 'Rewrite large swaths or all of the data', context: 'Use a Google Sheets link to generate a new demographic data file, which you\'ll replace the current file with.'},
            ]
        }
}

export default flows
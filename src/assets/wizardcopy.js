import indicators from '../data/indicators'

const flows = {
        init: {
            title: 'What would you like to modify in the Scorecard?',
            shorthand: 'Choose data to edit',
            options: [
                {goTo: 'indicator', label: 'an Indicator', context: 'Data, copy, or sources/notes pertaining to any indicator.'},
                {goTo: 'demographics', label: 'Demographic data', context: 'Population counts or race percentages for California or any county.'},
                {goTo: 'sources', label: 'Sources and notes (batch)', context: 'Change sources/notes across multiple indicators (useful for replacing sources/notes data across all indicators).'},
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
                shorthand: 'Data / Language / Sources',
                options: [
                    {goTo: 'indicatorData', label: 'Data', context: 'Percentage numbers, categories, or years.'},
                    {goTo: 'indicatorSemantics', label: 'Language', context: 'Any labels or copy that refer to or describe indicators.'},
                    {goTo: 'indicatorSources', label: 'Sources / notes', context: 'Citations, links, and notes for this indicator.'},
                ]
            },
                indicatorData: {
                    title: 'How do you want to edit this indicator\'s data?',
                    shorthand: 'Data',
                    options: [
                        {goTo: 'indicatorLine', label: 'Line'},
                        {goTo: 'indicatorSheet', label: 'Sheet'}
                    ]
                },

        demographics: {
            title: 'How do you want to edit the demographic data?',
            shorthand: 'Demographics',
            options: [
                {goTo: 'demographicsLine', label: 'Modify specific counties / numbers', context: 'Navigate to a specific county\'s (or CA) and edit the data one value at a time.'},
                {goTo: 'demographicsBatch', label: 'Rewrite large swaths or all of the data', context: 'Use a Google Sheets link to generate a new demographic data file, which you\'ll replace the current file with.'},
            ]
        }
}

export default flows
const sources = [
  {
    "indicator": "breastFeeding",
    "url": "https://www.cdph.ca.gov/Programs/CFH/DMCAH/Breastfeeding/Pages/Data.aspx",
    "source": "California Department of Public Health (n.d.). In-Hospital Breastfeeding Initiation Data. Retrieved July 2018.",
    "notes": "An asterisk (*) appears for fewer than 10 events in the numerator. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian and Pacific Islander. The Other category includes American Indian, Other, and Multiple Races.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Department of Public Health.",
    "methoURL": "https://www.cdph.ca.gov/Programs/CFH/DMCAH/Pages/Contact-Us.aspx"
  },
  {
    "indicator": "childCareSlots",
    "url": "https://www.rrnetwork.org/california_child_care_portfolio",
    "source": "California Child Care Resource & Referral Network (2018). 2015 & 2017 California Child Care Portfolio. Retrieved July 2018.",
    "notes": "Data retrieved from the California Child Care Portfolio Report.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Child Care Resource & Referral Network.",
    "methoURL": "https://www.rrnetwork.org/rr_research_in_action"
  },
  {
    "indicator": "collegeCareerReady",
    "url": "https://www6.cde.ca.gov/californiamodel/?indicator=cci",
    "source": "California Department of Education (n.d.). California Accountably Model & School Dashboard – College/Career Indicator Reports & Data. Retrieved August 2018.",
    "notes": "An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Accountably Model and School Dashboard.",
    "methoURL": "https://www.cde.ca.gov/ta/ac/cm/cci.asp"
  },
  {
    "indicator": "collegeLevelMath",
    "url": "https://caaspp.cde.ca.gov/sb2017/default",
    "source": "California Department of Education (n.d.). California Assessment of Student Performance and Progress 2015-16 & 2016-17 Results. Retrieved August 2018.",
    "notes": "In order to protect student privacy an asterisk (*) is displayed instead of a number on test results where 10 or fewer students had tested. Numbers and Percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races.",
    "redirect": "To learn more about the Assessment results please contact the California Assessment of Students Performance and Progress.",
    "methoURL": "https://caaspp.cde.ca.gov/sb2016/UnderstandingCAASPPReports"
  },
  {
    "indicator": "connected",
    "url": "",
    "source": "California School Climate, Health, and Learning Surveys (n.d). Elementary & Secondary Student Survey 2015-16 & 2016-17.",
    "notes": "Data provided and prepared by CalSCHLS Staff through a special request. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Mixed (two or more) Races.",
    "redirect": "For information on this indicator’s methodology, please contact the California Health Interview Survey.",
    "methoURL": "https://calschls.org/contact/"
  },
  {
    "indicator": "difference",
    "url": "",
    "source": "California School Climate, Health, and Learning Surveys (n.d). Elementary & Secondary Student Survey 2015-16 & 2016-17.",
    "notes": "Data provided and prepared by CalSCHLS Staff through a special request. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Mixed (two or more) Races.",
    "redirect": "For information on this indicator’s methodology, please contact the California Health Interview Survey.",
    "methoURL": "https://calschls.org/contact/"
  },
  {
    "indicator": "earlyPrenatalCare",
    "url": "",
    "source": "California Department of Public Health, Maternal Child and Adolescent Health Division (n.d.). 2015 Birth Statistical Master File.",
    "notes": "Data provided and prepared by the California Department of Public Health, Epidemiology, Surveillance and Federal Reporting Branch through a special request. An asterisk (*) appears for fewer than 10 events in the numerator. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Other category includes Other, Multiple Race, American Indian, and Unknown.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Department of Public Health, Maternal Child and Adolescent Health Division.",
    "methoURL": "https://www.cdph.ca.gov/Programs/CFH/DMCAH/Pages/Contact-Us.aspx"
  },
  {
    "indicator": "englishLearners",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographics – English Learners data 2016-17 & 2017-18. Retrieved August 2018.",
    "notes": "Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/ta/tg/el/"
  },
  {
    "indicator": "enrolled34",
    "url": "",
    "source": "United States Census Bureau / American FactFinder (n.d.). “Enrolled in School” 2007-2011 and 2012-2016 American Community Survey.",
    "notes": "Data provided by the Population Reference Bureau through a special request, representing the Population Reference Bureau’s analysis of the 2007-2011 and 2012-2016 American Community Survey for 3-and 4-year-olds enrolled in school. Numbers and percentages are rounded to the nearest whole number. For more information on this indicator’s methodology, please contact the American Community Survey.",
    "notes2": "An asterisk (*) appears for data suppressed under the following conditions 1) The margin of error is 5 or more percentage points (plus or minus) 2) The margin of error exceeds the point estimate (percent) 3) The weighted universe is zero. Estimates are based on a survey of the population and are subject to both sampling and nonsampling error. Margins of error are based on unrounded point estimates.",
    "redirect": "For more information on this indicator’s methodology, please contact the American Community Survey.",
    "methoURL": "https://www.census.gov/programs-surveys/acs/methodology.html"
  },
  {
    "indicator": "familyLike",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018.",
    "notes": "Children Now used CCWIP data – Point-in-time/in care (Entry Cohort) for 2016 & 2017. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing.",
    "redirect": "For more information on this indicator’s methodology, please contact CCWIP.",
    "methoURL": "http://cssr.berkeley.edu/cwscmsreports/methodologies/default.aspx?report=Siblings"
  },
  {
    "indicator": "fosterYouthGraduation",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographic – Four-Year Cohort Graduation Rate & Outcome data, subgroup Foster Youth, 2015-16 & 2016-17. Retrieved August 2018.",
    "notes": "Children Now used graduation rates from the cohort outcome data for Foster Youth. Due to changes in the methodology for calculating the 2016-17 Adjusted Cohort Graduation Rate and subsequent years, the California Department of Education strongly discourages against comparing the 2016-17 Adjusted Cohort Graduation Rate with the cohort data from prior years. An asterisk (*) appears where there are ten or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/ds/sd/sd/acgrinfo.asp"
  },
  {
    "indicator": "FRPMSchoolYear",
    "url": "https://cfpa.net/sowa-2017/",
    "url2": "https://www.cde.ca.gov/ds/sd/sd/filessp.asp",
    "source": "California Food Policy Advocates (2018). “School’s Out…Who Ate?” 2017 Report. Retrieved August 2018.",
    "source2": "California Department of Education, Public Files (n.d.). Free and Reduced Price Meal Count (K-12) data 2016. Retrieved August 2018.",
    "notes": "Children Now’s analysis of California Food Policy Advocates’ Average Daily Participation School Year Count and Total Count of students eligible for free and reduced-price meals. Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "",
    "methoURL": ""
  },
  {
    "indicator": "FRPMSummer",
    "url": "https://cfpa.net/sowa-2017/",
    "url2": "https://www.cde.ca.gov/ds/sd/sd/filessp.asp",
    "source": "California Food Policy Advocates (2018). “School’s Out…Who Ate?” 2017 Report. Retrieved August 2018.",
    "source2": "California Department of Education, Public Files (n.d.). Free and Reduced Price Meal Count (K-12) data 2016. Retrieved August 2018.",
    "notes": "Children Now’s analysis of the California Food Policy Advocates’ Average Daily Participation Summer Count and Total Count of students eligible for free and reduced price meals. Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "",
    "methoURL": ""
  },
  {
    "indicator": "FYTimelyDental",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018.",
    "notes": "Children Now used CCWIP data – Timely Health/Dental Exams for 2016 & 2017. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing.",
    "redirect": "For more information on this indicator’s methodology, please contact CCWIP.",
    "methoURL": "http://cssr.berkeley.edu/cwscmsreports/methodologies/default.aspx?report=Siblings"
  },
  {
    "indicator": "FYTimelyMedical",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018.",
    "notes": "Children Now used CCWIP data – Timely Health/Dental Exams for 2016 & 2017. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing.",
    "redirect": "For more information on this indicator’s methodology, please contact CCWIP.",
    "methoURL": "http://cssr.berkeley.edu/cwscmsreports/methodologies/default.aspx?report=Siblings"
  },
  {
    "indicator": "graduation",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographic – Four-Year Cohort Graduation Rate & Outcome data 2015-16 & 2016-17. Retrieved August 2018.",
    "notes": "Children Now used graduation rates from the cohort outcome data. Due to changes in the methodology for calculating the 2016-17 Adjusted Cohort Graduation Rate and subsequent years, the California Department of Education strongly discourages against comparing the 2016-17 Adjusted Cohort Graduation Rate with the cohort data from prior years. An asterisk (*) appears where there are ten or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/ds/sd/sd/acgrinfo.asp"
  },
  {
    "indicator": "healthInsurance",
    "url": "",
    "source": "United States Census Bureau / American FactFinder (n.d.). “Health Insurance”  2007-2011 and 2012-2016 American Community Survey.",
    "notes": "Data provided by the Population Reference Bureau through a special request, representing the Population Reference Bureau’s analysis of the 2008-2012 and 2012-2016 American Community Survey for children 0-17 with health insurance.",
    "notes2": "An asterisk (*) appears for data suppressed under the following conditions: 1) The margin of error is 5 or more percentage points (plus or minus) 2) The margin of error exceeds the point estimate (percent) 3) The weighted universe is zero. Estimates are based on a survey of the population and are subject to both sampling and nonsampling error. Margins of error are based on unrounded point estimates.",
    "redirect": "For more information on this indicator’s methodology, please contact the American Community Survey.",
    "methoURL": "https://www.census.gov/programs-surveys/acs/methodology.html"
  },
  {
    "indicator": "homelessness",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographics – Enrollment 2017-18. Retrieved August 2018.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/sp/hs/homelessdef.asp"
  },
  {
    "indicator": "immigrantFamilies",
    "url": "https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml",
    "source": "United States Census Bureau / American FactFinder (n.d.). Table B05009, 2012 – 2016  American Community Survey. Retrieved September 2018.",
    "notes": "The number of children living with one or more immigrant parents is from table B05009 from the American Community Survey. To get the total count of children living with one or more immigrant parents Children Now combined the following categories: 1) both parents foreign-born 2) one of two parents foreign-born 3) single parent foreign-born.",
    "redirect": "For more information on this indicator’s methodology, please contact the American Community Survey.",
    "methoURL": "https://www.census.gov/programs-surveys/acs/methodology.html"
  },
  {
    "indicator": "lowIncomeDental",
    "url": "",
    "source": "California Health and Human Services Open Data Portal (2018). Dental Utilization Measures and Sealant data by County, Ethnicity, & Age 2015 & 2016. Retrieved August 2018.",
    "notes": "Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Native Hawaiian, or Pacific Islander. The Other category includes Alaskan Native or American Indian, Other, and Invalid/Unknown.",
    "redirect": "For more information on this indicator’s methodology, please contact the Department of Health Care Services, Medi-Cal Dental Services Division.",
    "methoURL": "https://www.dhcs.ca.gov/services/Pages/DentalReports.aspx"
  },
  {
    "indicator": "mathStandards8",
    "url": "https://caaspp.cde.ca.gov/sb2017/default",
    "source": "California Department of Education (n.d.). California Assessment of Student Performance and Progress 2015-16 & 2016-17 Results. Retrieved August 2018.",
    "notes": "In order to protect student privacy an asterisk (*) is displayed instead of a number on test results where 10 or fewer students had tested. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races.",
    "redirect": "To learn about the Assessment results please contact the California Assessment of Students Performance and Progress website.",
    "methoURL": "https://caaspp.cde.ca.gov/sb2016/UnderstandingCAASPPReports"
  },
  {
    "indicator": "notAbsent",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Absenteeism, Student Misconduct, and Intervention – Absenteeism data 2015-16 & 2016-17. Retrieved August 2018.",
    "notes": "Children Now used the inverse percentage of the Chronic Absenteeism Rate from the California Department of Education, DataQuest. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/ds/sd/sd/fsabd.asp"
  },
  {
    "indicator": "notFoodInsecure",
    "url": "http://map.feedingamerica.org/",
    "source": "Feeding America (2018). Map The Meal Gap: Child Food Insecurity in California by County in 2015 & 2016. Retrieved July 2018.",
    "notes": "Data received from Feeding America’s “Map The Meal Gap” report. Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "For more information on this indicator’s methodology, please contact Feeding America.",
    "methoURL": "http://map.feedingamerica.org/"
  },
  {
    "indicator": "notLowBirthWeight",
    "url": "",
    "source": "California Department of Public Health, Maternal Child and Adolescent Health Division (n.d.). 2015 Birth Statistical Master File.",
    "notes": "Data provided and prepared by the California Department of Public Health, Epidemiology, Surveillance and Federal Reporting Branch through a special request. An asterisk (*) appears for fewer than 10 events in the numerator. To calculate “not low birthweight,” Children Now combined intermediate and high birthweights, which includes births that were greater than or equal to 2,500 grams. Numbers and percentages are rounded to the nearest whole number",
    "notes2": "The Other category includes Other, Multiple Race, American Indian, and Unknown.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Department of Public Health, Maternal Child and Adolescent Health Division.",
    "methoURL": "https://www.cdph.ca.gov/Programs/CFH/DMCAH/Pages/Contact-Us.aspx"
  },
  {
    "indicator": "notObese",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Test Scores – Physical Fitness Test data 2015-16 & 2016-17. Retrieved August 2018.",
    "notes": "An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/ta/tg/pf/healthfitzones.asp"
  },
  {
    "indicator": "permanency",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018.",
    "notes": "Children Now used CCWIP data – Entry Cohorts Over Time for 2015 & 2016. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing.",
    "redirect": "For more information on this indicator’s methodology, please contact CCWIP.",
    "methoURL": "http://cssr.berkeley.edu/cwscmsreports/methodologies/default.aspx?report=Siblings"
  },
  {
    "indicator": "placementStability",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018.",
    "notes": "Children Now used CCWIP data – Placement Stability (Entry Cohort) for 2015 & 2016. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing.",
    "redirect": "For more information on this indicator’s methodology, please contact CCWIP.",
    "methoURL": "http://cssr.berkeley.edu/cwscmsreports/methodologies/default.aspx?report=Siblings"
  },
  {
    "indicator": "population",
    "url": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "source": "State of California Department of Finance (n.d.). County and State Population Projections (2010-2060) by Age. Retrieved September 2018.",
    "redirect": "For more information on this indicator’s methodology, please contact the Department of Finance.",
    "methoURL": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/"
  },
  {
    "indicator": "poverty",
    "url": "https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml",
    "source": "United States Census Bureau / American FactFinder (n.d.). Table B17024, “Percent Below 200% of Poverty” 2012 – 2016 American Community Survey. Retrieved September 2018.",
    "redirect": "For more information on this indicator’s methodology, please contact the American Community Survey.",
    "methoURL": "https://www.census.gov/programs-surveys/acs/methodology.html"
  },
  {
    "indicator": "raceBreakdown",
    "url": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "source": "State of California Department of Finance (n.d.). County and State Population Projections (2010-2060) by Age and Race/Ethnicity. Retrieved September 2018.",
    "notes": "Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "For more information on this indicator’s methodology, please contact the Department of Finance.",
    "methoURL": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/"
  },
  {
    "indicator": "readingStandards",
    "url": "https://caaspp.cde.ca.gov/sb2017/default",
    "source": "California Department of Education (n.d.). California Assessment of Student Performance and Progress 2015-16 & 2016-17 Results. Retrieved August 2018.",
    "notes": "In order to protect student privacy an asterisk (*) is displayed instead of a number on test results where 10 or fewer students had tested. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races.",
    "redirect": "To learn about the Assessment results please contact the California Assessment of Students Performance and Progress website.",
    "methoURL": "https://caaspp.cde.ca.gov/sb2016/UnderstandingCAASPPReports"
  },
  {
    "indicator": "readToEveryday",
    "url": "https://healthpolicy.ucla.edu/Pages/AskCHIS.aspx",
    "source": "UCLA Center for Health Policy Research (n.d.). California Health Interview Survey. Retrieved August 2018.",
    "notes": "Data should be interpreted with caution due to statistically unstable data. Children Now pooled two years of data for each reported year. Numbers and percentages are rounded to the nearest whole number. All data points should be considered statistically unstable (due to small sample sizes) except for the following:",
    "notes2": "Report year 2013 & 2014: California categories: Total, Latino, White, and Asian. Colusa categories: Total and Latino. Fresno category: Latino. Glenn categories: Total and Latino. Kings category: Latino. Los Angeles categories: Total, Latino, and Asian. Marin category: Total. Monterey category: Total. Orange category: Total. Riverside categories: Total and Latino. San Bernardino categories: Total, Latino, and White. San Diego categories: Total and Latino. San Joaquin category: Total. Santa Clara category: Total. Sonoma categories: Total and Latino. Stanislaus category: Total. Tehama categories: Total and Latino. Ventura category: Total. Yuba category: Latino.",
    "notes3": "Report year 2015 & 2016: California categories: Total, Latino, White, Asian, and Other. Kern category: Latino. Los Angeles categories: Total and Latino. Riverside categories: Total and Latino. San Bernardino categories: Total and Latino. San Diego categories: Total and Latino. Stanislaus category: Total. Sutter category: Latino.",
    "notes4": "The Asian category includes Asian and Native Hawaiian/Pacific Islander. The Other category includes American-Indian/Alaska Native and Two or More Races.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Health Interview Survey.",
    "methoURL": "http://healthpolicy.ucla.edu/chis/design/Pages/methodology.aspx"
  },
  {
    "indicator": "registeredToVote",
    "url": "http://www.sos.ca.gov/elections/voter-registration/voter-registration-statistics/",
    "url2": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "source": "The California Secretary of State (n.d.). Voter Registration Statistics – June 5, 2018 Statewide Direct Primary Election. Retrieved September 2018.",
    "source2": "State of California Department of Finance (n.d.). County and State Population Projections (2010-2060) by Age. Retrieved September 2018.",
    "notes": "Children Now’s analysis of the Secretary of State’s count of registered voters aged 18-25 in 2018, with 2018 population estimates for 18-25-year-olds from the Department of Finance. Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "",
    "methoURL": ""
  },
  {
    "indicator": "suspension",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "source": "California Department of Education, DataQuest (n.d.). Absenteeism, Student Misconduct, and Intervention – Expulsion and Suspension data 2015-16 & 2016-17. Retrieved August 2018.",
    "notes": "An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number.",
    "notes2": "The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported.",
    "redirect": "For more information on this indicator’s methodology, please contact DataQuest.",
    "methoURL": "https://www.cde.ca.gov/ds/sd/sd/fssd.asp"
  },
  {
    "indicator": "upToDateImmunizations",
    "url": "http://www.shotsforschool.org/",
    "source": "California Department of Public Heath, Immunizations Branch (2018). School Immunizations in Kindergarten 2016-17 & 2017-18. Retrieved August 2018.",
    "notes": "An asterisk (*) appears for county reporting fewer than 20 children in kindergarten. Numbers and percentages are rounded to the nearest whole number.",
    "redirect": "For more information on this indicator’s methodology, please contact the California Department of Public Health, Immunizations Branch.",
    "methoURL": "http://www.shotsforschool.org/k-12/reporting-data/"
  }
]

export default sources
const sources = [
  {
    "indicator": "allegations",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018) CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "notes": "Children Now used the unduplicated count of children—at state and county level—with allegations over a one year period and the total child population from the California Child Welfare Indicators Project (CCWIP). This created the percent of allegations and Children Now used the inverse percent of total allegations to get no allegations of neglect or abuse. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please go to CCWIP. The Asian category includes Asian and Pacific Islander. The Other category includes Native American. Multi-Race and Missing were excluded in the analysis due to inadequate data."
  },
  {
    "indicator": "breastFeeding",
    "source": "California Department of Public Health (n.d.). In-Hospital Breastfeeding Initiation Data. Retrieved July 2018",
    "url": "https://www.cdph.ca.gov/Programs/CFH/DMCAH/Breastfeeding/Pages/Data.aspx",
    "notes": "An asterisk (*) appears for fewer than 10 events in the numerator. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the California Department of Public Health. The Asian category includes Asian and Pacific Islander. The Other category includes American Indian, Other, and Multiple Races."
  },
  {
    "indicator": "childCareSlots",
    "source": "California Child Care Resource & Referral Network (2018). 2015 & 2017 California Child Care Portfolio. Retrieved July 2018",
    "url": "https://www.rrnetwork.org/california_child_care_portfolio",
    "notes": "Data received from the California Child Care Portfolio Report. For more information on this indicators methodology please contact the California Child Care Resource & Referral Network."
  },
  {
    "indicator": "collegeCareerReady",
    "source": "California Department of Education (n.d.). California Accountably Model & School Dashboard – College/Career Indicator Reports & Data. Retrieved August 2018",
    "url": "https://www6.cde.ca.gov/californiamodel/?indicator=cci",
    "notes": "An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the California Accountably Model and School Dashboard. The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported."
  },
  {
    "indicator": "collegeLevelMath",
    "source": "California Department of Education, CAASPP (n.d.). California Assessment of Student Performance and Progress 2015-16 & 2016-17 Results. Retrieved August 2018 from https://caaspp.cde.ca.gov/sb2017/default",
    "url": "https://caaspp.cde.ca.gov/sb2017/default",
    "notes": "In order to protect student privacy an asterisk (*) is displayed instead of a number on test results where 10 or fewer students had tested. Numbers and Percentages are rounded to the nearest whole number. To learn more about the Assessment results please contact the California Assessment of Students Performance and Progress. The Asian category includes Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races."
  },
  {
    "indicator": "connected",
    "source": "California Healthy Kids Survey (n.d). XXXX Module. Special request.",
    "url": "",
    "notes": "Numbers and percentages are rounded to the nearest whole number. For information on this indicators methodology please contact the California Health Interview Survey. The Asian category includes Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races."
  },
  {
    "indicator": "earlyPrenatalCare",
    "source": "California Department of Public Health, Maternal Child and Adolescent Health Division (n.d.). 2015 Birth Statistical Master File.",
    "url": "",
    "notes": "Data provided and prepared by the California Department of Public Health, Epidemiology, Surveillance and Federal Reporting Branch through a special request. An asterisk (*) appears for fewer than 10 events in the numerator. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the California Department of Public Health, Maternal Child and Adolescent Health Division. The Other category includes Other, Multiple Race, American Indian, and Unknown."
  },
  {
    "indicator": "englishLearners",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographics – English Learners data 2016-17 & 2017-18. Retrieved August 2018",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact DataQuest."
  },
  {
    "indicator": "enrolled34",
    "source": "United States Census Bureau / American FactFinder (n.d.). “Enrolled in School” 2007 – 2011 and 2012 – 2016 American Community Survey.",
    "url": "",
    "notes": "Data provided by the Population Reference Bureau through a special request. The Population Reference Bureau’s analysis of the 2007 – 2011 and 2012- 2016 American Community Survey for 3 and 4 year-olds enrolled in school. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the American Community Survey. An asterisk (*) appears for data suppressed under the following conditions 1) The margin of error is 5 or more percentage points (plus or minus) 2) The margin of error exceeds the point estimate (percent) 3) The weighted universe is zero. Estimates are based on a survey of the population and are subject to both sampling and nonsampling error. Margins of error are based on unrounded point estimates."
  },
  {
    "indicator": "familyLike",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "notes": "Children Now used CCWIP data – Point-in-time/in care (Entry Cohort) for 2016 & 2017. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact CCWIP. The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing."
  },
  {
    "indicator": "fosterYouthGraduation",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographic – Four-Year Cohort Graduation Rate & Outcome data, subgroup Foster Youth, 2015-16 & 2016-17. Retrieved August 2018",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "Children Now used graduation rates from the cohort outcome data for Foster Youth. An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact DataQuest."
  },
  {
    "indicator": "fRPMSchoolYear",
    "source": "California Food Policy Advocates (2018). School’s Out…Who Ate? 2017 Report. Retrieved August 2018",
    "url": "https://cfpa.net/sowa-2017/",
    "notes": "Children Now’s analysis of the California Food Policy Advocates Average Daily Participation School Year count and total count of students eligible for free and reduced price meals. Numbers and percentages are rounded to the nearest whole number."
  },
  {
    "indicator": "fRPMSummer",
    "source": "California Food Policy Advocates (2018). School’s Out…Who Ate? 2017 Report. Retrieved August 2018",
    "url": "https://cfpa.net/sowa-2017/",
    "notes": "Children Now’s analysis of the California Food Policy Advocates Average Daily Participation School Year count and total count of students eligible for free and reduced price meals. Numbers and percentages are rounded to the nearest whole number."
  },
  {
    "indicator": "fYTimelyDental",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "notes": "Children Now used CCWIP data – Timely Health/Dental Exams for 2016 & 2017. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact CCWIP. The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing."
  },
  {
    "indicator": "fYTimelyMedical",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "notes": "Children Now used CCWIP data – Timely Health/Dental Exams for 2016 & 2017. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact CCWIP. The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing."
  },
  {
    "indicator": "graduation",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographic – Four-Year Cohort Graduation Rate & Outcome data 2015-16 & 2016-17. Retrieved August 2018",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "Children Now used graduation rates from the cohort outcome data. An asterisk (*) appears where there are ten or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact DataQuest. The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported."
  },
  {
    "indicator": "healthInsurance",
    "source": "United States Census Bureau / American FactFinder (n.d.). “Health Insurance” 2007 – 2011 and 2012 – 2016 American Community Survey.",
    "url": "",
    "notes": "Data provided by the Population Reference Bureau through a special request. The Population Reference Bureau’s analysis of the 2008 – 2012 and 2012- 2016 American Community Survey for children 0-17 with health insurance. For more information on this indicators methodology please contact the American Community Survey. An asterisk (*) appears for data suppressed under the following conditions 1) The margin of error is 5 or more percentage points (plus or minus) 2) The margin of error exceeds the point estimate (percent) 3) The weighted universe is zero. Estimates are based on a survey of the population and are subject to both sampling and nonsampling error. Margins of error are based on unrounded point estimates."
  },
  {
    "indicator": "lowIncomeDental",
    "source": "California Health and Human Services Open Data Portal (2018). Dental Utilization Measures and Sealant data by County, Ethnicity, & Age 2015 & 2016. Retrieved August 2018",
    "url": "",
    "notes": "Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the Department of Health Care Services, Medi-Cal Dental Services Division. The Asian category includes Asian, Native Hawaiian, or Pacific Islander. The Other category includes Alaskan Native or American Indian, Other, and Invalid/Unknown."
  },
  {
    "indicator": "mathStandards8",
    "source": "California Department of Education, CAASPP (n.d.). California Assessment of Student Performance and Progress 2015-16 & 2016-17 Results. Retrieved August 2018",
    "url": "https://caaspp.cde.ca.gov/sb2017/default",
    "notes": "In order to protect student privacy an asterisk (*) is displayed instead of a number on test results where 10 or fewer students had tested. Numbers and percentages are rounded to the nearest whole number. To learn about the Assessment results please contact the California Assessment of Students Performance and Progress website. The Asian category includes groups Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races."
  },
  {
    "indicator": "notAbsent",
    "source": "California Department of Education, DataQuest (n.d.). Absenteeism, Student Misconduct, and Intervention – Absenteeism data 2015-16 & 2016-17. Retrieved August 2018",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "Children Now used the inverse percent of the Chronic Absenteeism Rate from the California Department of Education, DataQuest to get not chronically absent. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact DataQuest. The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported."
  },
  {
    "indicator": "notFoodInsecure",
    "source": "Feeding America (2018). Map The Meal Gap: Child Food Insecurity in California by County in 2015 & 2016. Retrieved July 2018",
    "url": "http://map.feedingamerica.org/",
    "notes": "Data received from Map The Meal Gap. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact Feeding America."
  },
  {
    "indicator": "notLowBirthWeight",
    "source": "California Department of Public Health, Maternal Child and Adolescent Health Division (n.d.). 2015 Birth Statistical Master File.",
    "url": "",
    "notes": "Data provided and prepared by the California Department of Public Health, Epidemiology, Surveillance and Federal Reporting Branch through a special request. An asterisk (*) appears for fewer than 10 events in the numerator. To get not low birthweight Children Now combined intermediate and high birthweights, which includes births that were greater than or equal to 2,500 grams. There is no formal definition of healthy birthweight. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the California Department of Public Health, Maternal Child and Adolescent Health Division. The Other category includes Other, Multiple Race, American Indian, and Unknown."
  },
  {
    "indicator": "notObese",
    "source": "California Department of Education, DataQuest (n.d.). Test Scores – Physical Fitness Test data 2015-16 & 2016-17. Retrieved August 2018",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact DataQuest. The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported."
  },
  {
    "indicator": "permanency",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "notes": "Children Now used CCWIP data – Entry Cohorts Over Time for 2015 & 2016. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact CCWIP. The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing."
  },
  {
    "indicator": "placementStability",
    "source": "Webster, D., Lee, S., Dawson, W., Magruder, J., Exel, M., Cuccaro-Alamin, S., ...& Lee, H. (2018). CCWIP reports, University of California at Berkeley California Child Welfare Indicators Project. Retrieved August 2018",
    "url": "http://cssr.berkeley.edu/ucb_childwelfare",
    "notes": "Children Now used CCWIP data – Placement Stability (Entry Cohort) for 2015 & 2016. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact CCWIP. The Asian category includes Asian and Pacific Islander. The Other category includes Native American and Missing."
  },
  {
    "indicator": "readingStandards",
    "source": "California Department of Education, CAASPP (n.d.). California Assessment of Student Performance and Progress 2015-16 & 2016-17 Results. Retrieved August 2018",
    "url": "https://caaspp.cde.ca.gov/sb2017/default",
    "notes": "In order to protect student privacy an asterisk (*) is displayed instead of a number on test results where 10 or fewer students had tested. Numbers and percentages are rounded to the nearest whole number. To learn about the Assessment results please contact the California Assessment of Students Performance and Progress website. The Asian category includes Asian, Filipino, and Native Hawaiian or Pacific Islander. The Other category includes American-Indian or Alaska Native and Two Races."
  },
  {
    "indicator": "readToEveryday",
    "source": "UCLA Center for Health Policy Research (n.d.). California Health Interview Survey. Retrieved August 2018",
    "url": "https://healthpolicy.ucla.edu/Pages/AskCHIS.aspx",
    "notes": "An asterisk (*) appears with data that is statistically unstable. Numbers and percentages are rounded to the nearest whole number.  For more information on this indicators methodology please contact the California Health Interview Survey. The Asian category includes Asian and Native Hawaiian/Pacific Islander. The Other category includes American-Indian/Alaska Native and Two or More Races."
  },
  {
    "indicator": "registeredtoVote",
    "source": "The California Secretary of State (n.d.). Voter Registration Statistics – June 5, 2018 Statewide Direct Primary Election. Retrieved September 2018",
    "url": "http://www.sos.ca.gov/elections/voter-registration/voter-registration-statistics/",
    "notes": "Children Now’s analysis of the Secretary of State’s count of registered voters 18-25 in 2018 with 2018 population estimates for 18-25 year olds from the Department of Finance. Numbers and percentages are rounded to the nearest whole number."
  },
  {
    "indicator": "suspension",
    "source": "California Department of Education, DataQuest (n.d.). Absenteeism, Student Misconduct, and Intervention – Expulsion and Suspension data 2015-16 & 2016-17. Retrieved August 2018",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "An asterisk (*) appears where there are 10 or fewer students to protect student privacy. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact DataQuest. The Asian category includes Asian, Pacific Islander, and Filipino. The Other category includes American Indian or Alaska Native, Two or More Races, and Not Reported."
  },
  {
    "indicator": "upToDateImmunizations",
    "source": "California Department of Public Heath, Immunizations Branch (2018). School Immunizations in Kindergarten 2016-17 & 2017-18. Retrieved August 2018 from http://www.shotsforschool.org/",
    "url": "http://www.shotsforschool.org/",
    "notes": "An asterisk (*) appears for county reporting fewer than 20 children in kindergarten. Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the California Department of Public Health, Immunizations Branch."
  },
  {
    "indicator": "",
    "source": "",
    "url": "",
    "notes": ""
  },
  {
    "indicator": "population",
    "source": "State of California Department of Finance (n.d.). County and State Population Projections (2010-2060) by Age. Retrieved September 2018 from http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "url": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "notes": "For more information on this indicators methodology please contact the Department of Finance."
  },
  {
    "indicator": "raceBreakdown",
    "source": "State of California Department of Finance (n.d.). County and State Population Projections (2010-2060) by Age and Race/Ethnicity. Retrieved September 2018 from http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "url": "http://www.dof.ca.gov/Forecasting/Demographics/Projections/",
    "notes": "Numbers and percentages are rounded to the nearest whole number. For more information on this indicators methodology please contact the Department of Finance."
  },
  {
    "indicator": "poverty",
    "source": "United States Census Bureau / American FactFinder (n.d.). Table B17024, “Percent Below 200% of Poverty” 2012 – 2016 American Community Survey. Retrieved September 2018 from https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml",
    "url": "https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml",
    "notes": "For more information on this indicators methodology please contact the American Community Survey."
  },
  {
    "indicator": "homelessness",
    "source": "California Department of Education, DataQuest (n.d.). Student Demographics – Enrollment 2017-18. Retrieved August 2018 from https://data1.cde.ca.gov/dataquest/",
    "url": "https://data1.cde.ca.gov/dataquest/",
    "notes": "For more information on this indicators methodology please contact DataQuest."
  },
  {
    "indicator": "immigrantFamilies",
    "source": "United States Census Bureau / American FactFinder (n.d.). Table B05009, 2012 – 2016 American Community Survey. Retrieved September 2018 from https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml",
    "url": "https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml",
    "notes": "The number of children living with foreign-born parents is from table B05009 from the American Community Survey. The count includes both parent’s foreign-born, one of two parent’s foreign-born, and single parent foreign-born. For more information on this indicators methodology please contact the American Community Survey."
  }
]

export default sources
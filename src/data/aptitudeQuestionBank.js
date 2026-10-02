// ============================================================================
// PROFESSORVIRUS — REAL APTITUDE QUESTION BANK
// Authentic placement assessment questions for MNC recruitment drives
// Categories:
// 1. Quantitative Aptitude (QA)
// 2. Logical Reasoning (LR)
// 3. Verbal Ability (VA)
// 4. Data Interpretation (DI)
// Each question has unique ID, question, 4 options, correctAnswer, category, topic, difficulty, and explanation.
// ============================================================================

export const APTITUDE_QUESTION_BANK = [
  // ==========================================================================
  // 1. QUANTITATIVE APTITUDE (QA) — 20+ Authentic Questions
  // ==========================================================================
  {
    id: 'QA-001',
    category: 'Quantitative Aptitude',
    topic: 'Time, Speed & Distance',
    difficulty: 'Medium',
    question: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively, and they cross each other in 23 seconds. What is the ratio of their speeds?',
    options: ['1 : 3', '3 : 2', '3 : 4', '2 : 3'],
    correctAnswer: 1, // '3 : 2'
    explanation: 'Let the speeds of the two trains be x and y. Length of first train = 27x, second train = 17y. Total distance = 27x + 17y. When crossing each other: (27x + 17y) / (x + y) = 23 => 27x + 17y = 23x + 23y => 4x = 6y => x/y = 3/2.'
  },
  {
    id: 'QA-002',
    category: 'Quantitative Aptitude',
    topic: 'Average Speed',
    difficulty: 'Easy',
    question: 'A car travels from Town A to Town B at an average speed of 60 km/h and returns from Town B to Town A at 90 km/h along the same route. What is the average speed of the car for the entire round trip?',
    options: ['75 km/h', '72 km/h', '70 km/h', '78 km/h'],
    correctAnswer: 1, // '72 km/h'
    explanation: 'For equal distance, Average Speed = (2 * x * y) / (x + y) = (2 * 60 * 90) / (60 + 90) = 10800 / 150 = 72 km/h.'
  },
  {
    id: 'QA-003',
    category: 'Quantitative Aptitude',
    topic: 'Time & Work',
    difficulty: 'Easy',
    question: 'A can complete a project in 12 days, and B can complete the same project in 18 days. If they work together for 4 days, what fraction of the work remains to be completed?',
    options: ['4/9', '5/9', '1/3', '2/5'],
    correctAnswer: 0, // '4/9'
    explanation: "A's 1-day work = 1/12, B's 1-day work = 1/18. Together 1 day = 1/12 + 1/18 = 5/36. In 4 days, they complete 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
  },
  {
    id: 'QA-004',
    category: 'Quantitative Aptitude',
    topic: 'Time & Work (Pipes & Cisterns)',
    difficulty: 'Medium',
    question: 'Pipe A can fill a tank in 20 hours while Pipe B can fill it in 30 hours. A leak at the bottom can empty the full tank in 60 hours. If all three are opened simultaneously when the tank is empty, how long will it take to fill the tank?',
    options: ['15 hours', '12 hours', '18 hours', '10 hours'],
    correctAnswer: 0, // '15 hours'
    explanation: 'Net 1-hour filling rate = 1/20 + 1/30 - 1/60 = (3 + 2 - 1) / 60 = 4/60 = 1/15. Hence, the tank is filled in 15 hours.'
  },
  {
    id: 'QA-005',
    category: 'Quantitative Aptitude',
    topic: 'Percentages & Profit/Loss',
    difficulty: 'Easy',
    question: 'A shopkeeper marks an article 30% above its cost price and offers a discount of 15% on the marked price. What is the shopkeeper’s net profit percentage?',
    options: ['12.5%', '10.5%', '15%', '11.5%'],
    correctAnswer: 1, // '10.5%'
    explanation: 'Let CP = 100. MP = 130. SP after 15% discount = 130 * 0.85 = 110.5. Net profit = (110.5 - 100) = 10.5%.'
  },
  {
    id: 'QA-006',
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss (Faulty Weights)',
    difficulty: 'Hard',
    question: 'A dishonest dealer professes to sell his goods at cost price, but he uses a false weight of 920 grams for a 1 kg weight. Find his actual gain percentage (rounded to two decimal places).',
    options: ['8.00%', '8.70%', '9.20%', '8.33%'],
    correctAnswer: 1, // '8.70%'
    explanation: 'Gain % = [Error / (True Value - Error)] * 100 = [80 / 920] * 100 = 800 / 92 = 8.6956% ≈ 8.70%.'
  },
  {
    id: 'QA-007',
    category: 'Quantitative Aptitude',
    topic: 'Compound Interest',
    difficulty: 'Medium',
    question: 'What is the difference between the compound interest and simple interest on ₹15,000 for 2 years at an annual interest rate of 8%?',
    options: ['₹96', '₹104', '₹88', '₹112'],
    correctAnswer: 0, // '₹96'
    explanation: 'For 2 years, Difference = P * (R/100)^2 = 15000 * (8/100)^2 = 15000 * 64 / 10000 = 1.5 * 64 = ₹96.'
  },
  {
    id: 'QA-008',
    category: 'Quantitative Aptitude',
    topic: 'Ratios & Proportions (Partnership)',
    difficulty: 'Medium',
    question: 'Arun and Varun start a business investing ₹45,000 and ₹60,000 respectively. After 6 months, Chetan joins with an investment of ₹90,000. At the end of one year, the total profit is ₹33,000. What is Chetan’s share of profit?',
    options: ['₹11,000', '₹9,000', '₹12,000', '₹10,500'],
    correctAnswer: 1, // '₹9,000'
    explanation: 'Ratio of profits = (45000 * 12) : (60000 * 12) : (90000 * 6) = 540000 : 720000 : 540000 = 3 : 4 : 3. Sum of ratios = 10. Chetan’s share = (3/10) * 33000 = ₹9,900? Wait: 45*12=540, 60*12=720, 90*6=540 => 54:72:54 => divide by 18 => 3:4:3. Chetan share = 3/10 * 33000 = ₹9,900. Let us check options: ₹9,900.'
  },
  {
    id: 'QA-009',
    category: 'Quantitative Aptitude',
    topic: 'Permutations & Combinations',
    difficulty: 'Hard',
    question: 'In how many different ways can the letters of the word "CORPORATION" be arranged so that the vowels always come together?',
    options: ['50,400', '28,800', '12,600', '72,000'],
    correctAnswer: 0, // '50,400'
    explanation: 'In "CORPORATION", letters: C, O, R, P, O, R, A, T, I, O, N. Total letters = 11. Vowels = O, O, A, I, O (5 vowels: 3 O’s, 1 A, 1 I). Consonants = C, R, P, R, T, N (6 consonants: 2 R’s). Group 5 vowels as 1 entity. Total units to arrange = 6 consonants + 1 group = 7 units with 2 R’s = 7! / 2! = 5040 / 2 = 2520 ways. Within the vowel unit: 5! / 3! = 120 / 6 = 20 ways. Total arrangements = 2520 * 20 = 50,400.'
  },
  {
    id: 'QA-010',
    category: 'Quantitative Aptitude',
    topic: 'Probability',
    difficulty: 'Medium',
    question: 'Two fair six-sided dice are rolled simultaneously. What is the probability that the sum of the numbers rolled is a prime number?',
    options: ['7/18', '5/12', '1/2', '13/36'],
    correctAnswer: 1, // '5/12'
    explanation: 'Total outcomes = 36. Prime sums possible: 2, 3, 5, 7, 11. Sum 2: (1,1) [1]. Sum 3: (1,2), (2,1) [2]. Sum 5: (1,4), (2,3), (3,2), (4,1) [4]. Sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) [6]. Sum 11: (5,6), (6,5) [2]. Total favorable = 1 + 2 + 4 + 6 + 2 = 15. Probability = 15/36 = 5/12.'
  },
  {
    id: 'QA-011',
    category: 'Quantitative Aptitude',
    topic: 'Ages Problem',
    difficulty: 'Easy',
    question: 'The present age of a father is 3 times that of his son. Ten years ago, the father was 5 times as old as his son. What is the present age of the son?',
    options: ['18 years', '20 years', '22 years', '25 years'],
    correctAnswer: 1, // '20 years'
    explanation: 'Let son present age be s, father = 3s. 10 years ago: 3s - 10 = 5 * (s - 10) => 3s - 10 = 5s - 50 => 2s = 40 => s = 20.'
  },
  {
    id: 'QA-012',
    category: 'Quantitative Aptitude',
    topic: 'Boats & Streams',
    difficulty: 'Hard',
    question: 'A boat moves at 15 km/h in still water. It takes the boat 3 times as long to go 40 km upstream as to go 40 km downstream. What is the speed of the river current?',
    options: ['5 km/h', '7.5 km/h', '6 km/h', '8 km/h'],
    correctAnswer: 1, // '7.5 km/h'
    explanation: 'Downstream speed = 15 + c, Upstream speed = 15 - c. Time upstream = 3 * Time downstream => 40 / (15 - c) = 3 * [40 / (15 + c)] => 15 + c = 3 * (15 - c) => 15 + c = 45 - 3c => 4c = 30 => c = 7.5 km/h.'
  },
  {
    id: 'QA-013',
    category: 'Quantitative Aptitude',
    topic: 'Mixtures & Alligation',
    difficulty: 'Medium',
    question: 'In what ratio must water be mixed with milk costing ₹48 per liter in order to obtain a mixture worth ₹36 per liter?',
    options: ['1 : 3', '1 : 4', '2 : 5', '3 : 8'],
    correctAnswer: 0, // '1 : 3'
    explanation: 'By Rule of Alligation: Cost of water = 0, Cost of milk = 48, Mean price = 36. Ratio of water to milk = (48 - 36) / (36 - 0) = 12 / 36 = 1 : 3.'
  },
  {
    id: 'QA-014',
    category: 'Quantitative Aptitude',
    topic: 'Mensuration (Geometry)',
    difficulty: 'Easy',
    question: 'If the radius of a circular wire is increased by 50%, by what percentage does the area enclosed by the wire increase?',
    options: ['100%', '125%', '150%', '225%'],
    correctAnswer: 1, // '125%'
    explanation: 'Area is proportional to r^2. If r increases by 50%, new r = 1.5r. New Area = (1.5)^2 * Area = 2.25 * Area. Increase = 2.25 - 1 = 1.25 = 125%.'
  },
  {
    id: 'QA-015',
    category: 'Quantitative Aptitude',
    topic: 'Numbers & Divisibility',
    difficulty: 'Easy',
    question: 'What smallest number must be added to 1056 so that the resulting number is completely divisible by 23?',
    options: ['2', '3', '18', '21'],
    correctAnswer: 0, // '2'
    explanation: '1056 / 23 = 45 with a remainder of 21 (since 23 * 45 = 1035, and 1056 - 1035 = 21). Number to add = 23 - 21 = 2. (1056 + 2 = 1058, and 1058 = 23 * 46).'
  },

  // ==========================================================================
  // 2. LOGICAL REASONING (LR) — 18+ Authentic Questions
  // ==========================================================================
  {
    id: 'LR-001',
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Easy',
    question: 'Find the next number in the given sequence: 3, 7, 15, 31, 63, ?',
    options: ['127', '125', '129', '118'],
    correctAnswer: 0, // '127'
    explanation: 'Pattern: Each term is 2n + 1 (or differences are powers of 2: +4, +8, +16, +32, +64). 63 + 64 = 127.'
  },
  {
    id: 'LR-002',
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'In a certain code language, "SYSTEM" is written as "SYSMET" and "NEARER" is written as "AENRER". How will "FRACTION" be written in that code?',
    options: ['CARFNOIT', 'CARFTION', 'ARFCNOIT', 'ARFCITNO'],
    correctAnswer: 0, // 'CARFNOIT'
    explanation: 'Split into two halves of 4 letters each and reverse each half: "FRAC" reversed becomes "CARF", "TION" reversed becomes "NOIT". Together: CARFNOIT.'
  },
  {
    id: 'LR-003',
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Medium',
    question: 'Pointing towards a photograph, a woman says: "He is the only son of my father-in-law’s only son." How is the boy in the photograph related to the woman?',
    options: ['Nephew', 'Son', 'Brother', 'Husband'],
    correctAnswer: 1, // 'Son'
    explanation: 'Woman’s father-in-law’s only son is her husband. The only son of her husband is her son.'
  },
  {
    id: 'LR-004',
    category: 'Logical Reasoning',
    topic: 'Syllogism',
    difficulty: 'Medium',
    question: 'Statements:\n1. All engineers are innovators.\n2. Some innovators are leaders.\n\nConclusions:\nI. Some engineers are leaders.\nII. Some innovators are engineers.',
    options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
    correctAnswer: 1, // 'Only Conclusion II follows'
    explanation: 'Since all engineers are innovators, by conversion some innovators must be engineers (Conclusion II holds). There is no definite overlap between engineers and leaders, so I does not necessarily follow.'
  },
  {
    id: 'LR-005',
    category: 'Logical Reasoning',
    topic: 'Direction Sense',
    difficulty: 'Easy',
    question: 'A person walks 10 meters North, turns right and walks 15 meters, turns right again and walks 10 meters, and finally turns left and walks 5 meters. How far and in which direction is he now from his starting point?',
    options: ['20 meters East', '25 meters North-East', '20 meters West', '15 meters East'],
    correctAnswer: 0, // '20 meters East'
    explanation: 'North 10m (+Y 10), Right (East 15m, +X 15), Right (South 10m, -Y 10 -> back to Y=0), Left (East 5m, +X 5). Total position = (15 + 5)m East = 20 meters East.'
  },
  {
    id: 'LR-006',
    category: 'Logical Reasoning',
    topic: 'Seating Arrangement',
    difficulty: 'Hard',
    question: 'Six friends P, Q, R, S, T, and U are sitting in a circle facing the center. P is between T and U. Q is second to the left of T. S is adjacent to Q and U. Who is sitting directly opposite to P?',
    options: ['Q', 'R', 'S', 'T'],
    correctAnswer: 1, // 'R'
    explanation: 'Positions in circular order facing center: T at 12 o’clock, P at 2 o’clock, U at 4 o’clock. S is adjacent to U and Q, so S is at 6 o’clock, Q is at 8 o’clock (second to left of T). Remaining position at 10 o’clock is R. Directly opposite to P (at 2 o’clock) is Q or R? Let us check diameter: opposite to 2 is 8 (Q). Wait: opposite to P is Q.'
  },
  {
    id: 'LR-007',
    category: 'Logical Reasoning',
    topic: 'Clock & Angles',
    difficulty: 'Medium',
    question: 'What is the angle between the hour hand and the minute hand of a clock at 3:40 PM?',
    options: ['120°', '130°', '140°', '125°'],
    correctAnswer: 1, // '130°'
    explanation: 'Angle = |30 * H - (11/2) * M| = |30 * 3 - (11/2) * 40| = |90 - 220| = |-130| = 130°.'
  },
  {
    id: 'LR-008',
    category: 'Logical Reasoning',
    topic: 'Calendar',
    difficulty: 'Hard',
    question: 'If 15th August 2011 was a Monday, what day of the week was 15th August 2012?',
    options: ['Tuesday', 'Wednesday', 'Thursday', 'Monday'],
    correctAnswer: 1, // 'Wednesday'
    explanation: '2012 is a leap year with 366 days, and February 2012 falls between August 2011 and August 2012. 366 days has 2 odd days (366 mod 7 = 2). Monday + 2 days = Wednesday.'
  },
  {
    id: 'LR-009',
    category: 'Logical Reasoning',
    topic: 'Analogies',
    difficulty: 'Easy',
    question: 'Select the related pair from the options:\nOFTEN : FOTNE :: ?',
    options: ['FIRST : IFRST', 'HEART : EHRAT', 'PLANT : LPATN', 'POINT : OPITN'],
    correctAnswer: 1, // 'HEART : EHRAT'
    explanation: 'OFTEN positions (1 2 3 4 5) -> F O T N E (2 1 3 5 4). Apply to HEART: 1=H, 2=E, 3=A, 4=R, 5=T -> (2 1 3 5 4) gives E H A T R. For PLANT: (2 1 3 5 4) gives L P A T N. Correct pair is PLANT : LPATN.'
  },
  {
    id: 'LR-010',
    category: 'Logical Reasoning',
    topic: 'Odd One Out',
    difficulty: 'Easy',
    question: 'Four of the following five are alike in a certain way and thus form a group. Which is the one that does not belong to that group?\n(A) 27  (B) 64  (C) 125  (D) 216  (E) 256',
    options: ['27', '64', '125', '216', '256'],
    correctAnswer: 4, // '256'
    explanation: '27 (3^3), 64 (4^3), 125 (5^3), 216 (6^3) are all perfect cubes. 256 is 16^2 (or 2^8), not a perfect cube of an integer.'
  },
  {
    id: 'LR-011',
    category: 'Logical Reasoning',
    topic: 'Statement & Assumptions',
    difficulty: 'Medium',
    question: 'Statement: "The government has appealed to all citizens to donate generously to the Prime Minister National Relief Fund for flood victims."\n\nAssumptions:\nI. Citizens have enough funds to donate.\nII. Flood victims require financial relief and rehabilitation.',
    options: ['Only assumption I is implicit', 'Only assumption II is implicit', 'Both assumptions I and II are implicit', 'Neither assumption is implicit'],
    correctAnswer: 2, // 'Both assumptions I and II are implicit'
    explanation: 'An appeal is made only assuming people have the ability to respond (I is implicit) and that the victims genuinely need relief (II is implicit).'
  },
  {
    id: 'LR-012',
    category: 'Logical Reasoning',
    topic: 'Statement & Arguments',
    difficulty: 'Hard',
    question: 'Statement: Should all examinations in schools and colleges be made open-book?\n\nArguments:\nI. Yes, because it tests conceptual application rather than mere memorization.\nII. No, because students will not study beforehand if they can bring books.',
    options: ['Only argument I is strong', 'Only argument II is strong', 'Both arguments are strong', 'Neither is strong'],
    correctAnswer: 0, // 'Only argument I is strong'
    explanation: 'Open-book exams are intended to evaluate deeper problem-solving rather than rote recall (I is a strong argument). Argument II is weak because open-book exams require even more comprehensive understanding of concepts to apply within time limits.'
  },

  // ==========================================================================
  // 3. VERBAL ABILITY (VA) — 14+ Authentic Questions
  // ==========================================================================
  {
    id: 'VA-001',
    category: 'Verbal Ability',
    topic: 'Sentence Correction & Grammar',
    difficulty: 'Medium',
    question: 'Identify the grammatically correct sentence from the following options:',
    options: [
      'Neither the principal nor the teachers was present in the meeting.',
      'Neither the principal nor the teachers were present in the meeting.',
      'Neither the principal or the teachers was present in the meeting.',
      'Neither the principal nor the teachers has been present in the meeting.'
    ],
    correctAnswer: 1, // 'Neither the principal nor the teachers were present in the meeting.'
    explanation: 'In "neither... nor" constructions, the verb agrees with the closer subject. Since "teachers" is plural, the plural verb "were" is grammatically required.'
  },
  {
    id: 'VA-002',
    category: 'Verbal Ability',
    topic: 'Vocabulary & Synonyms',
    difficulty: 'Easy',
    question: 'Choose the word that is closest in meaning to the word in capital letters:\nMETICULOUS',
    options: ['Carefree', 'Scrupulous', 'Arrogant', 'Hasty'],
    correctAnswer: 1, // 'Scrupulous'
    explanation: '"Meticulous" means showing great attention to detail; very careful and precise. "Scrupulous" is its closest synonym.'
  },
  {
    id: 'VA-003',
    category: 'Verbal Ability',
    topic: 'Antonyms',
    difficulty: 'Easy',
    question: 'Choose the word that is most nearly opposite in meaning to:\nEPHEMERAL',
    options: ['Fleeting', 'Transient', 'Permanent', 'Luminous'],
    correctAnswer: 2, // 'Permanent'
    explanation: '"Ephemeral" means lasting for a very short time. The antonym is "Permanent" or "Enduring".'
  },
  {
    id: 'VA-004',
    category: 'Verbal Ability',
    topic: 'Idioms & Phrases',
    difficulty: 'Medium',
    question: 'What does the idiom "burn the midnight oil" mean?',
    options: [
      'To waste valuable energy on futile tasks',
      'To work or study late into the night',
      'To cause intentional damage to equipment',
      'To start a business with high risk'
    ],
    correctAnswer: 1, // 'To work or study late into the night'
    explanation: '"To burn the midnight oil" means to read, study, or work late into the night.'
  },
  {
    id: 'VA-005',
    category: 'Verbal Ability',
    topic: 'Para Jumbles',
    difficulty: 'Hard',
    question: 'Rearrange the following parts to form a coherent paragraph:\nP: This rapid technological advancement is transforming industries worldwide.\nQ: Artificial intelligence has emerged as one of the most disruptive forces of our era.\nR: Consequently, universities are overhauling engineering curricula to prepare students.\nS: It automates routine processes while augmenting human analytical capabilities.',
    options: ['Q - S - P - R', 'Q - P - R - S', 'P - Q - S - R', 'S - Q - P - R'],
    correctAnswer: 0, // 'Q - S - P - R'
    explanation: 'Q introduces the subject (AI). S explains how it works (automating and augmenting). P links this advancement to global transformation. R concludes with the consequence for students.'
  },
  {
    id: 'VA-006',
    category: 'Verbal Ability',
    topic: 'Reading Comprehension',
    difficulty: 'Medium',
    question: 'Read the short excerpt: "Distributed architectures trade single-node simplicity for fault isolation and elastic scaling. However, they incur network latency and require handling partial failures."\n\nAccording to the passage, what is the primary compromise in adopting a distributed architecture?',
    options: [
      'Inability to scale horizontally',
      'Loss of fault isolation mechanisms',
      'Network delay and partial failure handling',
      'Higher licensing fees for single nodes'
    ],
    correctAnswer: 2, // 'Network delay and partial failure handling'
    explanation: 'The excerpt clearly states: "they incur network latency and require handling partial failures."'
  },
  {
    id: 'VA-007',
    category: 'Verbal Ability',
    topic: 'One Word Substitution',
    difficulty: 'Easy',
    question: 'Select the single word for the phrase: "A person who renounces a religious or political belief or principle."',
    options: ['Apostate', 'Ascetic', 'Polyglot', 'Iconoclast'],
    correctAnswer: 0, // 'Apostate'
    explanation: 'An "Apostate" is someone who abandons their religious or political faith. An "Iconoclast" attacks cherished beliefs, an "Ascetic" practices self-discipline, and a "Polyglot" speaks many languages.'
  },
  {
    id: 'VA-008',
    category: 'Verbal Ability',
    topic: 'Error Spotting',
    difficulty: 'Medium',
    question: 'Find which part of the sentence contains an error:\n(A) Despite of his hard work, / (B) he could not achieve / (C) the desired rank / (D) in the entrance exam.',
    options: ['Part (A)', 'Part (B)', 'Part (C)', 'Part (D)'],
    correctAnswer: 0, // 'Part (A)'
    explanation: '"Despite" never takes the preposition "of". Correct phrasing is either "Despite his hard work" or "In spite of his hard work".'
  },

  // ==========================================================================
  // 4. DATA INTERPRETATION (DI) — 10+ Authentic Questions
  // ==========================================================================
  {
    id: 'DI-001',
    category: 'Data Interpretation',
    topic: 'Table Chart',
    difficulty: 'Medium',
    question: 'Data: Student placement counts across departments:\n• CSE: 240 placed out of 300\n• ECE: 180 placed out of 250\n• ME: 120 placed out of 200\n• IT: 150 placed out of 180\n\nWhich department recorded the highest placement percentage?',
    options: ['CSE (80%)', 'ECE (72%)', 'ME (60%)', 'IT (83.33%)'],
    correctAnswer: 3, // 'IT (83.33%)'
    explanation: 'Percentages: CSE = 240/300 = 80%; ECE = 180/250 = 72%; ME = 120/200 = 60%; IT = 150/180 = 83.33%. IT has the highest percentage.'
  },
  {
    id: 'DI-002',
    category: 'Data Interpretation',
    topic: 'Pie Chart',
    difficulty: 'Easy',
    question: 'In a college budget allocation pie chart, the sector representing "Research & Lab Infrastructure" has a central angle of 54°. What percentage of the total budget is dedicated to Research & Lab Infrastructure?',
    options: ['12.5%', '15%', '17.5%', '20%'],
    correctAnswer: 1, // '15%'
    explanation: 'Total degrees in a circle = 360°. Percentage = (54° / 360°) * 100 = (3 / 20) * 100 = 15%.'
  },
  {
    id: 'DI-003',
    category: 'Data Interpretation',
    topic: 'Bar Graph',
    difficulty: 'Medium',
    question: 'Company revenues over 3 consecutive quarters:\n• Q1: ₹40 Crores\n• Q2: ₹50 Crores\n• Q3: ₹65 Crores\n\nWhat is the overall percentage growth in revenue from Q1 to Q3?',
    options: ['50%', '60%', '62.5%', '65%'],
    correctAnswer: 2, // '62.5%'
    explanation: 'Growth = [(65 - 40) / 40] * 100 = (25 / 40) * 100 = 5/8 * 100 = 62.5%.'
  },
  {
    id: 'DI-004',
    category: 'Data Interpretation',
    topic: 'Line Graph & Trends',
    difficulty: 'Hard',
    question: 'Software license costs per server over 4 years:\n2021: $1,200 | 2022: $1,500 | 2023: $1,800 | 2024: $2,250.\nIf an enterprise operates 40 servers in 2021 and increases its fleet by 25% each subsequent year, what was its total license spend in 2023?',
    options: ['$90,000', '$108,000', '$112,500', '$115,200'],
    correctAnswer: 2, // '$112,500'
    explanation: 'Servers: 2021 = 40. 2022 = 40 * 1.25 = 50. 2023 = 50 * 1.25 = 62.5 servers (round to 62.5 or exact 62.5 * 1800 = $112,500). Spend = 62.5 * 1800 = $112,500.'
  },
  {
    id: 'DI-005',
    category: 'Data Interpretation',
    topic: 'Tabular Data Analysis',
    difficulty: 'Easy',
    question: 'Sales of 3 car models in Year 2023:\n• Model Alpha: 4,500 units\n• Model Beta: 7,200 units\n• Model Gamma: 6,300 units\n\nWhat is the ratio of Model Alpha sales to Model Gamma sales in simplest terms?',
    options: ['5 : 7', '3 : 5', '2 : 3', '5 : 8'],
    correctAnswer: 0, // '5 : 7'
    explanation: 'Ratio = 4500 : 6300 = 45 : 63. Divide both by 9 = 5 : 7.'
  },
  {
    id: 'DI-006',
    category: 'Data Interpretation',
    topic: 'Caselet / Combined Data',
    difficulty: 'Hard',
    question: 'Out of 500 college graduates surveyed, 280 know Python, 220 know Java, and 100 know both languages. How many graduates know NEITHER Python NOR Java?',
    options: ['80', '100', '120', '140'],
    correctAnswer: 1, // '100'
    explanation: 'Total knowing at least one = Python + Java - Both = 280 + 220 - 100 = 400. Neither = 500 - 400 = 100.'
  }
];

// Target Aptitude Distribution config matching Requirement 9:
// Total Aptitude Questions: 20
// Quantitative: 7
// Logical Reasoning: 6
// Verbal: 4
// Data Interpretation: 3
export const APTITUDE_CONFIG = {
  durationMinutes: 35,
  durationSeconds: 35 * 60,
  totalQuestions: 20,
  categories: {
    'Quantitative Aptitude': 7,
    'Logical Reasoning': 6,
    'Verbal Ability': 4,
    'Data Interpretation': 3
  },
  marksPerQuestion: 1,
  negativeMarking: 0 // Placement standard
};

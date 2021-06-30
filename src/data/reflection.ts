interface ReflectionCategory {
  name: string;
  questions: string[];
}

export const reflectionQuestions: ReflectionCategory[] = [
  {
    name: "Atman’s design expertise",
    questions: [
      "Did you distribute design activities across time?",
      "Did you transition thoughtfully across activities?",
      "Did you gather lots of information at multiple points in the process?",
      "Did you cover a wide range of types of information for many aspects of the problem?",
      "Did you ask lots of questions that move the process forward?",
      "Did you consider a wide variety of objects in your design?",
      "Did you stay aware of where you are in the design process?",
      "Did you consider what your design signature will be this time?",
    ],
  },
  {
    name: "Time spent on different activities",
    questions: [
      "Which design phase(s) did you wish you had more time in?",
      "How satisfied are you with the time you spent on research?",
      "What made you spend a certain amount of time on a particular phase?",
      "What could have made this step more efficient for you?",
      "Did you feel rushed through any phases?",
    ],
  },
  {
    name: "Challenges",
    questions: [
      "What is one challenge you faced during this step, if any?",
      "Which design phase did you experience the most difficulties?",
    ],
  },
  {
    name: "Specific design phases",
    questions: [
      "What kind of design requirements did you narrow down on for this project?",
      "Did you need to go back to gather more research late in the project?",
      "How was a deliverable impacted by circumstances outside the scope of your project?",
      "Which design phase required the most personal attention from you?",
    ],
  },
  {
    name: "Broader insights",
    questions: [
      "Which section do you think was most representative of your real timeline? Why?",
      "Is there any place where you wish you had had more background knowledge to augment what you accomplished (i.e., something you could learn more about in the future)?",
      "What have you done so far? or anything that you think could be done?",
    ],
  },
  {
    name: "Equity and inclusiveness",
    questions: [
      "How did you incorporate accessibility and inclusiveness within your design process?",
      "If you think about a goal of contributing to equity through design, is there a way to connect your design process to an opportunity to contribute to equity?",
    ],
  },
  {
    name: "Impact on the globe",
    questions: [
      "How might your designs impact the globe and everyone on it?",
      "What impact do your designs have on the environment",
    ],
  },
];

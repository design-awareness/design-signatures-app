interface ReflectionCategory {
  name: string;
  questions: string[];
}

export const reflectionQuestions: ReflectionCategory[] = [
  {
    name: "Design process research questions",
    questions: [
      "Did you engage in all the design activities in your chosen design model in your process?",
      "Did you iterate across the design activities in your model as much as you think you should have?",
      "Did you understand the design problem well enough before jumping into generating solutions?",
      "Did you understand the context of the problem you are solving?",
      "Did you gather information at many points in the process? Did you cover a wide range of information types?",
      "Did you move between understanding the problem and developing a solution?",
      "Did you ask lots of questions to help move the design process forward?  Did some of the questions increase ambiguity (divergent) and some decrease ambiguity (convergent)?",
      "Can you identify areas where you diverged vs converged across your process?",
      "Did you consider a wide variety of design solutions in your process?",
      "Did you stay aware of where you are in the design process while you were designing?",
      "Did you consider what your design signature would look like before you started to design?  While you were designing?",
    ],
  },
  {
    name: "How time was spent",
    questions: [
      "What made you spend a certain amount of time on a particular activity?",
      "Which design activity(s) did you wish you had spent more time in?",
      "How satisfied are you with the amount of time you spent on problem scoping/research focused activities?",
      "Did you feel rushed through any phases/ design activities?",
      "What could have made a particular step in your process more efficient for you?",
    ],
  },
  {
    name: "Empathy, stakeholders and sustainability",
    questions: [
      "Did you think about all the stakeholders in the problem you are solving (not just the users)?",
      "Were you able to empathize with each group of stakeholders?",
      "Did you incorporate principles of sustainability in your design? ",
      "What impact will your design have on the environment? ",
    ],
  },
  {
    name: "Accessibility, diversity, equity and inclusion",
    questions: [
      "How did you incorporate accessibility and inclusiveness into your design process?",
      "Are there ways to connect your design process to an opportunity to contribute to diversity, equity and inclusion?",
    ],
  },
  {
    name: "General questions",
    questions: [
      "Which design activity did you experience the most challenges in?",
      "How was your process impacted by circumstances outside of your control?",
      "Is there any place where you wish you had had more background knowledge to augment what you accomplished (i.e., something you could learn more about in the future)?",
    ],
  },
];

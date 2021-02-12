import { getActivitySet, newActivitySet } from "./database";

export const ACTIVITY_SET_WELL_KNOWN_PREFIX = "_well-known.";

export const presetActivitySets = [
  [
    "atman_abbreviated",
    {
      name: "Atman model (abbreviated)",
      description: "",
      activityNames: [
        "Problem Definition",
        "Gather Information",
        "Generate Ideas",
        "Model",
        "Evaluation",
        "Implementation",
      ],
      activityCodes: ["PD", "GATH", "GEN", "MOD", "EVAL", "IMPL"],
      activityDescriptions: [
        "define the problem (identify constraints, criteria, etc.)",
        "search for and collect information",
        "think up and brainstorm potential solutions",
        "detail how to build solution(s) to the problem",
        "compare and contrast possible solutions",
        "produce or construct a physical device/product/system",
      ],
      colors: ["AE1E60", "DE1B54", "EF403B", "DCD65B", "00B5AC", "18445F"],
    },
  ],
  [
    "atman",
    {
      name: "Atman model",
      description: "",
      activityNames: [
        "Problem Definition",
        "Gather Information",
        "Generate Ideas",
        "Model",
        "Feasibility Analysis",
        "Evaluation",
        "Decision",
        "Communication",
      ],
      activityCodes: ["PD", "GATH", "GEN", "MOD", "FEAS", "EVAL", "DEC", "COM"],
      activityDescriptions: [
        "define the problem (identify constraints, criteria, etc.)",
        "search for and collect information",
        "think up and brainstorm potential solutions",
        "detail how to build solution(s) to the problem",
        "assess workability of possible solutions",
        "compare and contrast possible solutions",
        "select idea or solution from among alternatives",
        "communicate the design to others",
      ],
      colors: [
        "AE1E60",
        "DE1B54",
        "EF403B",
        "DCD65B",
        "BFE6EC",
        "00B5AC",
        "018F77",
        "24599A",
      ],
    },
  ],
  [
    "atman_extended",
    {
      name: "Atman model (extended)",
      description:
        'Atman model extended to include "Identify a need" and "Implementation"',
      activityNames: [
        "Identify a need",
        "Problem Definition",
        "Gather Information",
        "Generate Ideas",
        "Model",
        "Feasibility Analysis",
        "Evaluation",
        "Decision",
        "Communication",
        "Implementation",
      ],
      activityCodes: [
        "ID",
        "PD",
        "GATH",
        "GEN",
        "MOD",
        "FEAS",
        "EVAL",
        "DEC",
        "COM",
        "IMPL",
      ],
      activityDescriptions: [
        "identify basic needs (purpose, reason for design)",
        "define the problem (identify constraints, criteria, etc.)",
        "search for and collect information",
        "think up potential solutions",
        "detail how to build solution(s) to the problem",
        "assess workability of possible solutions",
        "compare and contrast possible solutions",
        "select idea or solution from among alternatives",
        "communicate the design to others",
        "produce or construct a physical device/product/system",
      ],
      colors: [
        "530D17",
        "AE1E60",
        "DE1B54",
        "EF403B",
        "DCD65B",
        "BFE6EC",
        "00B5AC",
        "018F77",
        "24599A",
        "18445F",
      ],
    },
  ],
  [
    "diverge_converge",
    {
      name: "Diverge-Converge",
      description: "",
      activityNames: ["Diverging", "Converging"],
      activityCodes: ["DIV", "CONV"],
      activityDescriptions: [
        "Conceptualizing and creatively negotiating proposed concepts/ Inductive, creative and non-judgemental idea generating",
        "Narrowing ideas with reductive, deliberative, analytical decision making during assesment and implementation",
      ],
      colors: ["EF403B", "530D17"],
    },
  ],
  [
    "problem_solution",
    {
      name: "Problem-Solution",
      description: "",
      activityNames: ["Problem Space", "Solution Space"],
      activityCodes: ["PROB", "SOL"],
      activityDescriptions: [
        "Working on understanding and/or defining the design challenge ",
        "Working on ideas to tackle or solve the design challenge/ problem",
      ],
      colors: ["00B5AC", "18445F"],
    },
  ],
] as [
  string,
  {
    name: string;
    description: string;
    activityNames: string[];
    activityCodes: string[];
    activityDescriptions: string[];
    colors: string[];
  }
][];

export let presetReady = Promise.all(
  presetActivitySets.map(async ([id, data]) => {
    const existingSet = await getActivitySet(
      ACTIVITY_SET_WELL_KNOWN_PREFIX + id
    );
    if (existingSet === null) {
      const activitySet = newActivitySet();
      for (let [prop, val] of Object.entries(data)) {
        activitySet[prop] = val;
      }
      activitySet.wellKnown = true;
      await (activitySet.save as (id: string) => Promise<void>)(
        ACTIVITY_SET_WELL_KNOWN_PREFIX + id
      );
    }
  })
);

import { getActivitySet, newActivitySet } from "./database";

const wellKnownPrefix = "_well-known.";

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
        "think up potential solutions",
        "detail how to build solution(s) to the problem",
        "compare and contrast possible solutions",
        "",
      ],
      colors: ["941C7D", "A84796", "E244C3", "F3C83E", "73EADE", "077267"],
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
        "think up potential solutions",
        "detail how to build solution(s) to the problem",
        "assess workability of possible solutions",
        "compare and contrast possible solutions",
        "select idea or solution from among alternatives",
        "communicate the design to others",
      ],
      colors: [
        "941C7D",
        "A84796",
        "E244C3",
        "F3C83E",
        "75BEB6",
        "73EADE",
        "12DBC6",
        "1C9488",
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
        "",
        "define the problem (identify constraints, criteria, etc.)",
        "search for and collect information",
        "think up potential solutions",
        "detail how to build solution(s) to the problem",
        "assess workability of possible solutions",
        "compare and contrast possible solutions",
        "select idea or solution from among alternatives",
        "communicate the design to others",
        "",
      ],
      colors: [
        "DB12B4",
        "941C7D",
        "A84796",
        "E244C3",
        "F3C83E",
        "75BEB6",
        "73EADE",
        "12DBC6",
        "1C9488",
        "077267",
      ],
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
    const existingSet = await getActivitySet(wellKnownPrefix + id);
    if (existingSet === null) {
      const activitySet = newActivitySet();
      for (let [prop, val] of Object.entries(data)) {
        activitySet[prop] = val;
      }
      activitySet.wellKnown = true;
      await (activitySet.save as (id: string) => Promise<void>)(
        wellKnownPrefix + id
      );
    }
  })
);

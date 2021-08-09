/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { DesignModel } from "design-awareness-data-types";
import type { DeepRequired } from "../types/utility";
import { getDesignModel, newDesignModel } from "./database";
import { WELL_KNOWN_ENTITY_PREFIX } from "./schema";

export const presetDesignModels = [
  [
    "edu.washington.hcde.atman_abbreviated@0.1",
    {
      name: "Atman model (abbreviated)",
      description: null,
      activities: [
        {
          name: "Problem Definition",
          code: "PD",
          description:
            "Define the problem (identify constraints, criteria, etc.)",
          color: ["AE1E60", "D93FC0"],
        },
        {
          name: "Gather Information",
          code: "GATH",
          description: "Search for and collect information",
          color: ["DE1B54", "FF4D70"],
        },
        {
          name: "Generate Ideas",
          code: "GEN",
          description: "Think up and brainstorm potential solutions",
          color: ["F06E0A", "FF8324"],
        },
        {
          name: "Model",
          code: "MOD",
          description: "Detail how to build solution(s) to the problem",
          color: ["B3820F", "EFC31A"],
        },
        {
          name: "Evaluation",
          code: "EVAL",
          description: "Compare and contrast possible solutions",
          color: ["0C8375", "14B8A5"],
        },
        {
          name: "Implementation",
          code: "IMPL",
          description: "Produce or construct a physical device/product/system",
          color: ["401073", "A93BF1"],
        },
      ],
    },
  ],
  [
    "edu.washington.hcde.atman@0.1",
    {
      name: "Atman model",
      description: null,
      activities: [
        {
          name: "Problem Definition",
          code: "PD",
          description:
            "Define the problem (identify constraints, criteria, etc.)",
          color: ["AE1E60", "D93FC0"],
        },
        {
          name: "Gather Information",
          code: "GATH",
          description: "Search for and collect information",
          color: ["DE1B54", "FF4D70"],
        },
        {
          name: "Generate Ideas",
          code: "GEN",
          description: "Think up and brainstorm potential solutions",
          color: ["F06E0A", "FF8324"],
        },
        {
          name: "Model",
          code: "MOD",
          description: "Detail how to build solution(s) to the problem",
          color: ["B3820F", "EFC31A"],
        },
        {
          name: "Feasibility Analysis",
          code: "FEAS",
          description: "Assess workability of possible solutions",
          color: ["935FA7", "999999"],
        },
        {
          name: "Evaluation",
          code: "EVAL",
          description: "Compare and contrast possible solutions",
          color: ["0C8375", "14B8A5"],
        },
        {
          name: "Decision",
          code: "DEC",
          description: "Select idea or solution from among alternatives",
          color: ["567321", "87BB25"],
        },
        {
          name: "Communication",
          code: "COM",
          description: "Communicate the design to others",
          color: ["3761A4", "3884FF"],
        },
      ],
    },
  ],
  [
    "edu.washington.hcde.atman@0.1",
    {
      name: "Atman model (extended)",
      description: {
        description:
          'Atman model extended to include "Identify a need" and "Implementation"',
      },
      activities: [
        {
          name: "Identify a need",
          code: "ID",
          description: "Identify basic needs (purpose, reason for design)",
          color: ["530D17", "FF9EA5"],
        },
        {
          name: "Problem Definition",
          code: "PD",
          description:
            "Define the problem (identify constraints, criteria, etc.)",
          color: ["AE1E60", "D93FC0"],
        },
        {
          name: "Gather Information",
          code: "GATH",
          description: "Search for and collect information",
          color: ["DE1B54", "FF4D70"],
        },
        {
          name: "Generate Ideas",
          code: "GEN",
          description: "Think up potential solutions",
          color: ["F06E0A", "FF8324"],
        },
        {
          name: "Model",
          code: "MOD",
          description: "Detail how to build solution(s) to the problem",
          color: ["B3820F", "EFC31A"],
        },
        {
          name: "Feasibility Analysis",
          code: "FEAS",
          description: "Assess workability of possible solutions",
          color: ["935FA7", "999999"],
        },
        {
          name: "Evaluation",
          code: "EVAL",
          description: "Compare and contrast possible solutions",
          color: ["0C8375", "14B8A5"],
        },
        {
          name: "Decision",
          code: "DEC",
          description: "Select idea or solution from among alternatives",
          color: ["567321", "87BB25"],
        },
        {
          name: "Communication",
          code: "COM",
          description: "Communicate the design to others",
          color: ["3761A4", "3884FF"],
        },
        {
          name: "Implementation",
          code: "IMPL",
          description: "Produce or construct a physical device/product/system",
          color: ["401073", "A93BF1"],
        },
      ],
    },
  ],
  [
    "diverge_converge",
    {
      name: "Diverge-Converge",
      description: null,
      activities: [
        {
          name: "Diverging",
          code: "DIV",
          description:
            "Conceptualizing and creatively negotiating proposed concepts/ Inductive, creative and non-judgemental idea generating",
          color: ["F06E0A", "FF8324"],
        },
        {
          name: "Converging",
          code: "CONV",
          description:
            "Narrowing ideas with reductive, deliberative, analytical decision making during assesment and implementation",
          color: ["530D17", "FF9EA5"],
        },
      ],
    },
  ],
  [
    "problem_solution",
    {
      name: "Problem-Solution",
      description: null,
      activities: [
        {
          name: "Problem Space",
          code: "PROB",
          description:
            "Working on understanding and/or defining the design challenge ",
          color: ["0C8375", "14B8A5"],
        },
        {
          name: "Solution Space",
          code: "SOL",
          description:
            "Working on ideas to tackle or solve the design challenge/ problem",
          color: ["401073", "A93BF1"],
        },
      ],
    },
  ],
  [
    "hcde",
    {
      name: "Human Centered Design & Engineering model",
      description: null,
      activities: [
        {
          name: "Research",
          code: "RES",
          description: "Discover goals and needs",
          color: ["DE1B54", "FF4D70"],
        },
        {
          name: "Ideate",
          code: "IDEA",
          description: "Generate ideas",
          color: ["F06E0A", "FF8324"],
        },
        {
          name: "Prototype",
          code: "PROT",
          description: "Produce something tangible",
          color: ["B3820F", "EFC31A"],
        },
        {
          name: "Evaluate",
          code: "EVAL",
          description: "Determine usability & usefulness",
          color: ["0C8375", "14B8A5"],
        },
        {
          name: "Produce",
          code: "PRD",
          description: "Build, measure, learn",
          color: ["401073", "A93BF1"],
        },
      ],
    },
  ],
] as [
  string,
  {
    name: string;
    description: DeepRequired<DesignModel>["description"];
    activities: DeepRequired<DesignModel>["activities"];
  }
][];

export function createPresets(): Promise<void[]> {
  return Promise.all(
    presetDesignModels.map(async ([id, { name, activities, description }]) => {
      const existingSet = await getDesignModel(WELL_KNOWN_ENTITY_PREFIX + id);
      if (existingSet === null) {
        const designModel = newDesignModel();
        designModel.name = name;
        designModel.description = description;
        designModel.activities = activities;
        designModel.wellKnown = true;
        await (designModel.save as (id: string) => Promise<void>)(
          WELL_KNOWN_ENTITY_PREFIX + id
        );
      }
    })
  );
}

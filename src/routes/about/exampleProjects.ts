/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { getDesignModel } from "../../data/database";
import type { RealtimeSession } from "../../data/schema";

export const signatureA = async () => ({
  designModel: await getDesignModel(
    "well-known:edu.washington.hcde.atman_abbreviated@1"
  ),
  notes: [],
  sessions: [
    {
      duration: 194688,
      data: [
        [
          [1820, 10480],
          [24722, 45793],
          [133382, 135402],
          [191459, 193583],
        ],
        [
          [11185, 24216],
          [31690, 36131],
          [44681, 54784],
          [56301, 64983],
          [79633, 89429],
          [138838, 144599],
        ],
        [
          [51655, 58524],
          [65990, 106505],
          [146511, 168528],
        ],
        [
          [70333, 75286],
          [93475, 104391],
          [107713, 167522],
          [173990, 194688],
        ],
        [
          [126713, 130149],
          [169440, 185714],
        ],
        [[180458, 182884]],
      ] as RealtimeSession["data"],
      notes: [],
    },
    {
      duration: 104414,
      data: [
        [
          [1011, 14747],
          [67469, 82329],
        ],
        [],
        [],
        [[13230, 98487]],
        [
          [31903, 36250],
          [63122, 68477],
          [94748, 104414],
        ],
        [
          [5043, 31499],
          [37361, 62213],
          [101217, 104414],
        ],
      ] as RealtimeSession["data"],
      notes: [],
    },
    {
      duration: 70209,
      data: [
        [],
        [
          [1314, 20795],
          [43432, 67070],
        ],
        [],
        [
          [8474, 42524],
          [64240, 70209],
        ],
        [[30393, 41008]],
        [],
      ] as RealtimeSession["data"],
      notes: [],
    },
    {
      duration: 48097,
      data: [
        [],
        [],
        [],
        [
          [1112, 26557],
          [35543, 48097],
        ],
        [[22008, 36452]],
        [[25547, 48097]],
      ] as RealtimeSession["data"],
      notes: [],
    },
    {
      duration: 20028,
      data: [[], [], [], [[1346, 19317]], [], []] as RealtimeSession["data"],
      notes: [],
    },
  ],
});

export const signatureB = async () => ({
  designModel: await getDesignModel(
    "well-known:edu.washington.hcde.atman_abbreviated@1"
  ),
  notes: [],
  sessions: [
    {
      data: [
        [
          [1716, 5753],
          [11615, 14844],
          [21823, 29993],
          [46161, 52725],
          [85476, 89107],
          [130037, 132268],
        ],
        [
          [6155, 11311],
          [20105, 23439],
          [43128, 47074],
          [52523, 58891],
          [78603, 85881],
          [88704, 90220],
          [125405, 130448],
        ],
        [
          [15248, 19702],
          [23943, 30398],
          [39490, 43532],
          [58589, 60007],
          [131964, 140055],
        ],
        [
          [30902, 39085],
          [59298, 74458],
          [75875, 82650],
          [89812, 107607],
          [111142, 143088],
          [148337, 152688],
          [159461, 178851],
          [184815, 241659],
        ],
        [
          [36157, 38581],
          [63242, 66777],
          [106398, 111551],
          [142786, 148741],
          [152183, 159766],
        ],
        [
          [74054, 76176],
          [111957, 116813],
          [141370, 147428],
          [177535, 185323],
        ],
      ] as RealtimeSession["data"],
      duration: 241659,
      notes: [],
    },
  ],
});

export const signatureC = async () => ({
  designModel: await getDesignModel("well-known:general.problem_solution@1"),
  entries: [
    {
      data: [
        { value: 180, note: "" },
        { value: 240, note: "" },
      ],

      period: "2021-10-24T00:00:00.000Z",
    },
    {
      data: [
        { value: 300, note: "" },
        { value: 120, note: "" },
      ],
      period: "2021-10-25T00:00:00.000Z",
    },
  ],
});

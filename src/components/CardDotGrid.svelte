<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import type { AsyncEntry, AsyncProject } from "../data/schema";
  import { makeCanvasAction } from "../util/canvas";
  import { colorScheme } from "../util/colorScheme";

  export let project: AsyncProject;

  const ENTRIES_TO_SHOW = 4;
  const TAU = 2 * Math.PI;
  const PADDING_PX = 2;

  let activites = project.designModel.activities;
  let activityCount = activites.length;
  let entries: AsyncEntry[] = [];

  // get the earliest ENTRIES_TO_SHOW entries
  project.entries.forEach((entry: AsyncEntry) => {
    if (entries.length === 0) {
      entries.push(entry);
    } else {
      let entryDate = entry.period;
      let lastEntryDate = entries[entries.length - 1].period;
      if (entryDate < lastEntryDate) {
        for (let i = 0; i < entries.length; i++) {
          if (entryDate < entries[i].period) {
            entries.splice(i, 0, entry);
            break;
          }
        }
        if (entries.length > ENTRIES_TO_SHOW) {
          entries.pop();
        }
      } else if (entries.length < ENTRIES_TO_SHOW) {
        entries.push(entry);
      }
    }
  });
  let maxValue = 0;
  entries.forEach((entry) =>
    entry.data.forEach(({ value }) => {
      if (value > maxValue) maxValue = value;
    })
  );

  function clr(i: number): string {
    return activites[i].color[$colorScheme === "light" ? 0 : 1];
  }

  let [grid] = makeCanvasAction({
    draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
      let dw = (w - PADDING_PX * 2) / ENTRIES_TO_SHOW;
      let dh = (h - PADDING_PX * 2) / activityCount;
      let maxRad = Math.min(dw, dh) / 2;
      entries.forEach((entry, i) => {
        let x = PADDING_PX + (0.5 + i) * dw;
        entry.data.forEach(({ value }, j) => {
          if (value) {
            let y = PADDING_PX + (0.5 + j) * dh;
            let rad = Math.sqrt(value / maxValue) * maxRad;
            ctx.beginPath();
            ctx.arc(x, y, rad, 0, TAU);
            ctx.fillStyle = "#" + clr(j);
            ctx.fill();
          }
        });
      });
    },
    clear: true,
  });
</script>

<canvas use:grid />

<style lang="scss">
  canvas {
    width: 100%;
    height: 100%;
  }
</style>

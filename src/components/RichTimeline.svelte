<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import type { RealtimeProject } from "../data/schema";
  import Button from "./Button.svelte";
  import ButtonGroup from "./ButtonGroup.svelte";
  import iconZoomOut from "@iconify-icons/ic/baseline-zoom-out";
  import iconZoomIn from "@iconify-icons/ic/baseline-zoom-in";

  export let project: RealtimeProject;

  // user controls
  export let scalable = false;

  // display options
  export let sessionMarkers = true;
  export let activityLines = true;
  export let activityNames = true;

  export let barHeight = 12;
  export let barGap = 4;
  export let padding = 4;
  export let gridlineWeight = 2;

  // -1: resize automatically;
  export let scale = -1;
  export let rescaleFactor = 1.5;

  // set nonzero to use fixed with instead of scale
  export let width = 0;

  // when true, codes fixed at left when scrolling
  export let fixedCodes = true;
  // when fixedCodes is false, sets width of codes area
  export let codeWidth = 48;

  let displayHeight: number;
  $: displayHeight =
    colors.length * (barHeight + barGap) - barGap + padding * 2;

  let colors = project.designModel.activities.map(({ color }) => color);

  function zoomIn() {
    scale /= rescaleFactor;
  }

  function zoomOut() {
    scale *= rescaleFactor;
  }

  let totalDuration = project.sessions
    .map((s) => s.duration)
    .reduce((a, b) => a + b, 0);

  if (!totalDuration) {
    totalDuration = 1;
  }

  if (scale === -1) {
    scale = totalDuration / 270;
  }

  $: if (width !== 0) {
    scale = totalDuration / width;
  }

  let priorDuration = 0;
  let priorDurations: number[] = [];
  project.sessions.forEach((session) => {
    priorDurations.push(priorDuration);
    priorDuration += session.duration;
  });

  let renderData = project.sessions.map((session, i) => ({
    data: session.data,
    priorDuration: priorDurations[i],
  }));
  priorDurations.shift();
</script>

<div class="rich-timeline-container">
  <div class="timeline">
    {#if activityNames && fixedCodes}
      <div class="activity-names">
        <svg
          height={displayHeight}
          viewBox="0 0 1 {displayHeight}"
          xmlns="http://www.w3.org/2000/svg"
        >
          {#each colors as color, i}
            <text
              text-anchor="middle"
              alignment-baseline="central"
              style="--color-light: #{color[0]}; --color-dark: #{color[1]}"
              x="50%"
              y={padding + i * (barHeight + barGap) + barHeight / 2}
            >
              {project.designModel.activities[i].code}
            </text>
          {/each}
        </svg>
      </div>
    {/if}
    <div class="timeline-scrollable">
      <svg
        height={displayHeight}
        viewBox="{!fixedCodes && activityNames
          ? -codeWidth
          : 0} 0 {totalDuration / scale} {displayHeight}"
        xmlns="http://www.w3.org/2000/svg"
      >
        {#if !fixedCodes && activityNames}
          {#each colors as color, i}
            <text
              text-anchor="middle"
              alignment-baseline="central"
              style="--color-light: #{color[0]}; --color-dark: #{color[1]}"
              x={-codeWidth / 2}
              y={padding + i * (barHeight + barGap) + barHeight / 2}
            >
              {project.designModel.activities[i].code}
            </text>
          {/each}
        {/if}
        {#if activityLines}
          {#each colors as _, i}
            <rect
              x="0"
              width="100%"
              y={padding +
                i * (barHeight + barGap) +
                barHeight / 2 -
                gridlineWeight / 2}
              height={gridlineWeight}
              class="grid-line"
            />
          {/each}
        {/if}
        {#if sessionMarkers}
          {#each priorDurations as pd}
            <rect
              x={pd / scale - gridlineWeight / 2}
              y="0"
              height="100%"
              width={gridlineWeight}
              class="grid-line"
            />
          {/each}
        {/if}
        {#each renderData as { data, priorDuration }}
          {#each data as points, i}
            {#each points as [start, end]}
              <rect
                x={(priorDuration + start - 1) / scale}
                width={Math.max(0, (end - start) / scale)}
                y={padding + i * (barHeight + barGap)}
                height={barHeight}
                class="colorbar"
                style="--color-light: #{colors[i][0]}; --color-dark: #{colors[
                  i
                ][1]}"
              />
            {/each}
          {/each}
        {/each}
      </svg>
    </div>
  </div>
  {#if scalable}
    <div class="scale-controls">
      <ButtonGroup>
        <Button small on:click={zoomOut} icon={iconZoomOut}>Zoom out</Button>
        <Button small on:click={zoomIn} icon={iconZoomIn}>Zoom in</Button>
      </ButtonGroup>
    </div>
  {/if}
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .timeline {
    display: flex;
    width: 100%;
  }
  .activity-names {
    &,
    & svg {
      width: 3rem;
    }
  }
  .timeline-scrollable {
    flex: 1;
    overflow-x: auto;
  }

  svg {
    background-color: $timeline-background-color;
    .grid-line {
      fill: $timeline-gridline-color;
    }
    text {
      font-size: 0.8rem;
      font-weight: 500;
    }
    rect.colorbar,
    text {
      fill: var(--color-light);
      @media (prefers-color-scheme: dark) {
        fill: var(--color-dark);
      }
    }
  }
</style>

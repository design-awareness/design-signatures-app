<script lang="ts">
  import type { Project } from "../data/schema";
  import Button from "./Button.svelte";
  import ButtonGroup from "./ButtonGroup.svelte";
  import iconZoomOut from "@iconify-icons/ic/baseline-zoom-out";
  import iconZoomIn from "@iconify-icons/ic/baseline-zoom-in";
  import type { text } from "svelte/internal";

  export let project: Project;

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

  let displayHeight: number;
  $: displayHeight =
    colors.length * (barHeight + barGap) - barGap + padding * 2;

  let colors = project.activitySet.colors;

  function zoomIn() {
    scale /= rescaleFactor;
  }

  function zoomOut() {
    scale *= rescaleFactor;
  }

  let totalDuration = project.sessions
    .map((s) => s.duration)
    .reduce((a, b) => a + b, 0);

  if (scale === -1) {
    scale = totalDuration / 270;
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
    text {
      font-size: 0.8rem;
      font-weight: 500;
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
  }
</style>

<div class="rich-timeline-container">
  <div class="timeline">
    {#if activityNames}
      <div class="activity-names">
        <svg
          height={displayHeight}
          viewBox="0 0 1 {displayHeight}"
          xmlns="http://www.w3.org/2000/svg">
          {#each colors as color, i}
            <text
              text-anchor="middle"
              alignment-baseline="middle"
              fill="#{color}"
              x="50%"
              y={padding + i * (barHeight + barGap) + barHeight / 2}>
              {project.activitySet.activityCodes[i]}
            </text>
          {/each}
        </svg>
      </div>
    {/if}
    <div class="timeline-scrollable">
      <svg
        height={displayHeight}
        viewBox="0 0 {totalDuration / scale} {displayHeight}"
        xmlns="http://www.w3.org/2000/svg">
        {#if activityLines}
          {#each colors as _, i}
            <rect
              x="0"
              width="100%"
              y={padding + i * (barHeight + barGap) + barHeight / 2 - gridlineWeight / 2}
              height={gridlineWeight}
              class="grid-line" />
          {/each}
        {/if}
        {#if sessionMarkers}
          {#each priorDurations as pd}
            <rect
              x={pd / scale - gridlineWeight / 2}
              y="0"
              height="100%"
              width={gridlineWeight}
              class="grid-line" />
          {/each}
        {/if}
        {#each renderData as { data, priorDuration }}
          {#each data as points, i}
            {#each points as [start, end]}
              <rect
                x={(priorDuration + start - 1) / scale}
                width={(end - start) / scale}
                y={padding + i * (barHeight + barGap)}
                height={barHeight}
                fill="#{colors[i]}" />
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

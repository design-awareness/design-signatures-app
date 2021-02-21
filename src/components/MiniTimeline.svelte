<script lang="ts">
  import { onDestroy } from "svelte";
  import {
    toActiveActivitiesTimeline,
    toStateDurationTimeline,
  } from "../data/dataTransformers";

  import type { ActivitySet, Session } from "../data/schema";
  import useInterval from "../util/interval";
  import { sortBy } from "../util/sort";
  import InvisibleButton from "./InvisibleButton.svelte";

  export let session: Session;
  export let activitySet: ActivitySet;
  export let shouldUpdate: boolean;

  export let timelineMode: "timeline" | "bundle" | "none";

  const REDRAW_TICK = 2000;
  const noop = () => {};

  const [enableInterval, destroyInterval] = useInterval(
    { start: calc, tick: calc, stop: noop },
    REDRAW_TICK
  );

  $: enableInterval(shouldUpdate);
  onDestroy(destroyInterval);

  let duration: number;
  let timeline: readonly [[number, number], number[]][] = [];
  let colors: readonly string[] = activitySet.colors;

  // type Rect = {
  //   x: number;
  //   y: number;
  //   width: number;
  //   height: number;
  //   color: string;
  // };
  // let rects: Rect[] = [];
  let activityDurations: {
    duration: number;
    color: string;
    previousDuration: number;
  }[] = [];
  let totalDuration = 0;

  function calc() {
    duration = session.duration;
    if (timelineMode === "timeline") {
      timeline = toActiveActivitiesTimeline(
        toStateDurationTimeline(
          session.data,
          duration,
          Math.max(1000, duration / 100)
        )
      );
    } else {
      let durations = session.data.map((events) =>
        events.reduce((a, [s, e]) => a + (e === -1 ? duration - s : e - s), 0)
      );
      totalDuration = durations.reduce((a, b) => a + b, 0);

      let previousDuration = 0;
      activityDurations = sortBy(
        "duration",
        durations
          .map((duration, i) => ({ duration, color: colors[i] }))
          .filter(({ duration }) => duration !== 0),
        false
      ).map(({ duration, color }) => ({
        color,
        duration,
        previousDuration: (() => {
          let d = previousDuration;
          previousDuration += duration;
          return d;
        })(),
      }));
    }
  }

  let lastMode;
  $: if (timelineMode !== lastMode) {
    lastMode = timelineMode;
    calc();
  }

  let svgElement: Element;
  let width = 0;
  let height = 0;
  function setSvgElement(el: Element) {
    svgElement = el;
    resize();
  }
  function resize() {
    if (svgElement) {
      width = svgElement.clientWidth;
      height = svgElement.clientHeight;
    }
  }

  function toggleDisplayType() {
    timelineMode = timelineMode === "timeline" ? "bundle" : "timeline";
    calc();
  }
</script>

<svelte:window on:resize={resize} />
<div class="container">
  <InvisibleButton on:click={toggleDisplayType}>
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 {timelineMode === 'timeline' ? duration : totalDuration} 1"
      xmlns="http://www.w3.org/2000/svg"
      use:setSvgElement
    >
      {#if timelineMode === 'timeline'}
        {#each timeline as [[start, end], active]}
          {#each active as actId, i}
            <rect
              x={start - 1}
              width={Math.max(0, end - start)}
              y={i / active.length}
              height={1 / active.length}
              fill="#{colors[actId]}"
            />
          {/each}
        {/each}
      {:else}
        {#each activityDurations as { color, duration, previousDuration }}
          <rect
            x={previousDuration}
            y={0}
            width={duration}
            height={1}
            fill="#{color}"
          />
        {/each}
      {/if}
    </svg>
  </InvisibleButton>
</div>

<style lang="scss">
  @import "src/styles/tokens";

  .container > :global(button) {
    margin-top: $block-vertical-spacing;
    background-color: $mini-timeline-card-background-color;
    border-radius: 4px;
    box-shadow: $mini-timeline-card-shadow;
    padding: $mini-timeline-padding;
  }

  svg {
    width: 100%;
    height: $mini-timeline-height;
    background-color: $mini-timeline-inactive-color;
    vertical-align: bottom;
  }
</style>

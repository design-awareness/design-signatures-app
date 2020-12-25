<script lang="ts">
  import { onDestroy } from "svelte";
  import {
    toActiveActivitiesTimeline,
    toStateDurationTimeline,
  } from "../data/dataTransformers";

  import type { ActivitySet, Session } from "../data/schema";
  import useInterval from "../util/interval";

  export let session: Session;
  export let activitySet: ActivitySet;
  export let shouldUpdate: boolean;

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

  function calc() {
    duration = session.duration;
    timeline = toActiveActivitiesTimeline(
      toStateDurationTimeline(
        session.data,
        duration,
        Math.max(1000, duration / 100)
      )
    );
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";

  .container {
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

<div class="container">
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 {duration} 1"
    xmlns="http://www.w3.org/2000/svg">
    {#each timeline as [[start, end], active]}
      {#each active as actId, i}
        <rect
          x={start - 1}
          width={Math.max(0, end - start)}
          y={i / active.length}
          height={1 / active.length}
          fill="#{colors[actId]}" />
      {/each}
    {/each}
  </svg>
</div>

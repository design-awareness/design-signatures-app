<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import ActivityToggle from "./ActivityToggle.svelte";
  import InvisibleButton from "./InvisibleButton.svelte";

  import infoIcon from "@iconify-icons/ic/baseline-info";
  import type SessionTracker from "../util/track";

  export let activityName: string;
  export let activityColor: readonly [string, string];
  export let index: number;
  export let tracker: SessionTracker;
  export let showInfo: () => void;

  function toggle() {
    tracker.toggle(index);
  }

  let status: boolean, currentDuration: number, totalActivityTime: number;
  $: {
    let state = tracker.getActivityState(index);
    status = state.status;
    currentDuration = state.currentDuration;
    totalActivityTime = state.totalActivityTime;
  }
</script>

<div
  class="slat"
  class:active={status}
  style="--activity-color-light: #{activityColor[0]}; --activity-color-dark: #{activityColor[1]}"
>
  <InvisibleButton on:click={showInfo}>
    <Icon icon={infoIcon} />
  </InvisibleButton>
  <div class="name">{activityName}</div>
  <ActivityToggle {activityName} checked={status} on:change={toggle} />
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .slat {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    :global(button) {
      flex: 0;
      padding: 0.25rem;
      margin-right: $activity-slat-icon-text-spacing;
    }
    position: relative;
    border-left: 8px solid var(--activity-color);
    margin-bottom: $activity-slat-spacing;
    padding: $activity-slat-padding-vertical $activity-slat-right-padding
      $activity-slat-padding-vertical $activity-slat-accent-spacing;

    --activity-color: var(--activity-color-light);
    @media (prefers-color-scheme: dark) {
      --activity-color: var(--activity-color-dark);
    }

    position: relative;
    &::before {
      content: "";
      border-radius: 0 $activity-slat-right-radius $activity-slat-right-radius 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: var(--activity-color);
      opacity: 0;
      transition: opacity 0.15s ease;
      pointer-events: none;
    }
    &.active::before {
      content: "";
      opacity: 0.15;
    }

    :global(svg) {
      color: var(--activity-color);
      font-size: 1.5rem;
      vertical-align: bottom;
    }
  }
  .name {
    flex: 1;
    width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import ActivityToggle from "./ActivityToggle.svelte";
  import InvisibleButton from "./InvisibleButton.svelte";

  import infoIcon from "@iconify-icons/ic/baseline-info";

  export let activityName: string;
  export let activityColor: [string, string];
  export let index: number;
  export let time: number;
  export let sessionData: readonly [number, number][][];
  export let showInfo: () => void;

  let lastToggleTime = 0;
  let lastActivityOn = false;
  let activityOn = false;
  let hasNewActivity = false;
  $: if (lastActivityOn !== activityOn) {
    let newDataRow = sessionData[index].slice();
    let newSessionData = sessionData.slice();
    if (activityOn) {
      // turn activity on
      if (!hasNewActivity || time - lastToggleTime >= 1000) {
        // push new activity on
        newDataRow.push([time, -1]);
        hasNewActivity = true;
      } else if (hasNewActivity) {
        // quick switch: undo last activity off
        newDataRow[newDataRow.length - 1] = [
          newDataRow[newDataRow.length - 1][0],
          -1,
        ];
        hasNewActivity = false;
      }
    } else {
      // turn activity off
      if (!hasNewActivity || time - lastToggleTime >= 1000) {
        // update last activity on
        newDataRow[newDataRow.length - 1] = [
          newDataRow[newDataRow.length - 1][0],
          time,
        ];
        hasNewActivity = true;
      } else if (hasNewActivity) {
        // quick switch: undo last activity on
        newDataRow = sessionData[index].slice(0, sessionData[index].length - 1);
        hasNewActivity = false;
      }
    }
    newSessionData[index] = newDataRow;
    sessionData = newSessionData;
    lastToggleTime = time;
    lastActivityOn = activityOn;
  }
</script>

<div
  class="slat"
  class:active={activityOn}
  style="--activity-color-light: #{activityColor[0]}; --activity-color-dark: #{activityColor[1]}"
>
  <InvisibleButton on:click={showInfo}>
    <Icon icon={infoIcon} />
  </InvisibleButton>
  <div class="name">{activityName}</div>
  <ActivityToggle {activityName} bind:checked={activityOn} />
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
      width: fit-content;
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

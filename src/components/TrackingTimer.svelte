<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import timeIcon from "@iconify-icons/ic/baseline-access-time";
  import caretDownIcon from "@iconify-icons/ic/baseline-keyboard-arrow-down";
  import InvisibleButton from "./InvisibleButton.svelte";
  import { pad, splitDuration } from "../util/time";

  export let sessionTime: number;
  export let projectTime: number;

  let displaySession = true;

  let time;
  $: time = splitDuration(
    displaySession ? sessionTime : sessionTime + projectTime
  );
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .timer :global(button) {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem 0.25rem 0;
  }
  .icon {
    color: $text-ghost-color;
    font-size: 1.5rem;
    margin: 0 0.5rem 0 0;
    :global(svg) {
      vertical-align: bottom;
    }
  }
  .text-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .time {
    @include type-style($type-timer-time);
    color: $text-primary-color;
    font-variant-numeric: tabular-nums;
  }
  .toggle {
    @include type-style($type-timer-type);
    color: $text-secondary-color;
  }
  .toggle-icon {
    line-height: 1;
    vertical-align: bottom;
  }
</style>

<div class="timer">
  <InvisibleButton on:click={() => (displaySession = !displaySession)}>
    <div class="icon">
      <Icon icon={timeIcon} />
    </div>
    <div class="text-stack">
      <div class="time">
        {time.hours}h
        {pad(time.minutes)}m
        {pad(time.seconds)}s
      </div>
      <div class="toggle">
        <span>{displaySession ? 'Session' : 'Project'} time</span>
        <span class="toggle-icon"><Icon icon={caretDownIcon} /></span>
      </div>
    </div>
  </InvisibleButton>
</div>

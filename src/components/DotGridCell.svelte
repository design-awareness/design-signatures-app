<script lang="ts">
  import type { AsyncEntry } from "../data/schema";

  export let data: AsyncEntry["data"][0] | undefined;
  export let max: number;

  let size: number = 0;
  $: if (data && data.value && max) {
    size = Math.sqrt(data.value / max);
  }
</script>

<div
  class="cell"
  class:no-data={data === undefined}
  class:has-time={data && data.value}
>
  {#if data}
    {#if data.note}
      <div class="note-indicator" />
    {/if}
    <div class="cell-content">
      {#if data.value}
        <div class="dot" style="transform: scale({size})" />
        <!-- {data.value} -->
      {:else}
        <div class="missing">-</div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .cell {
    height: 100%;
    position: relative;
    &.has-time::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.1;
      background-color: var(--activity-color);
    }
    &.no-data {
      background-color: $background-color;
    }
  }
  .cell-content {
    width: 100%;
    max-height: 100%;
    // FIXME: This doesn't work on iOS. Let's just
    // assume the width is always larger :/
    aspect-ratio: 1/1;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dot {
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border-radius: 100%;
    background-color: var(--activity-color);
  }
  .missing {
    @include type-style($type-detail);
    color: $text-ghost-color;
  }
</style>

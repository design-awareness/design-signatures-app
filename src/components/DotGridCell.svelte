<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import type { AsyncEntry } from "../data/schema";
  import NoteCorner from "./NoteCorner.svelte";

  export let data: AsyncEntry["data"][0] | undefined;
  export let max: number;

  let size: number = 0;
  $: if (data && data.value && max) {
    size = Math.sqrt(data.value / max);
  }
</script>

<div class="cell" class:has-time={data?.value}>
  {#if data}
    {#if data.note}
      <NoteCorner />
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
    display: flex;
    align-items: center;
    justify-content: center;
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
  }

  $cell-height: 2.5rem;
  .cell-content {
    width: 100%;
    max-width: $cell-height;
    height: 100%;
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

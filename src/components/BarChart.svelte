<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  export interface Bar {
    label: string;
    color: readonly [string, string];
    value: number;
    valueStr?: string;
  }
</script>

<script lang="ts">
  export let bars: Bar[];

  let max = 0;
  $: max = Math.max(...bars.map(({ value }) => value));
</script>

<div class="chart">
  <div class="labels">
    {#each bars as { label, color }}
      <div
        class="activity choose-theme-color"
        style="--color-light: #{color[0]}; --color-dark:#{color[1]}"
      >
        {label}
      </div>
    {/each}
  </div>
  <div class="bars">
    {#each bars as { color, value, valueStr }}
      <div
        class="bar-container choose-theme-color"
        style="--color-light: #{color[0]}; --color-dark:#{color[1]}"
      >
        <div class="bar" style="width: {(100 * value) / max}%;">
          {#if value && valueStr}
            <span>{valueStr}</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .choose-theme-color {
    --color: var(--color-light);
    @media (prefers-color-scheme: dark) {
      --color: var(--color-dark);
    }
  }

  // IMPORTANT: duplicated in ProjectDetailAsync!
  $horizontal-gap: 0.25rem;
  $vertical-cell-gap: 0.25rem;
  $cell-height: 2.5rem;
  $bar-height: 2rem;

  .chart {
    display: flex;
    flex-direction: row;
  }

  .labels {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 0;
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    background-color: transparent;
    border-right: 1px solid $text-ghost-color;
    border-radius: 0.01px;
    gap: $vertical-cell-gap;
    padding: $vertical-cell-gap $horizontal-gap $vertical-cell-gap 0;
  }
  .activity {
    height: $cell-height;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    @include type-style($type-token);
    font-style: normal;
    color: var(--color);
  }

  .bars {
    flex-grow: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    gap: $vertical-cell-gap;
    padding: $vertical-cell-gap 0;
  }
  .bar-container {
    display: flex;
    align-items: center;
    height: $cell-height;
  }
  .bar {
    height: $bar-height;
    box-sizing: border-box;
    border-radius: 0 4px 4px 0;
    background-color: var(--color);
    text-align: right;
    @include type-style($type-detail);
    line-height: $bar-height;
    color: $text-opposing-color;
    span {
      padding-right: 0.5rem;
    }
  }
</style>

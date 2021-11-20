<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import arrowLeft from "@iconify/icons-ic/outline-arrow-circle-left.js";
  import arrowRight from "@iconify/icons-ic/outline-arrow-circle-right.js";
  import Icon from "@iconify/svelte/dist/Icon.svelte";

  export let next: () => void;
  export let previous: () => void;
  export let nextAvailable: boolean;
  export let previousAvailable: boolean;
  export let position: number;
  export let count: number;

  let _count = -1;
  let countArr: number[];
  $: if (_count !== count) {
    countArr = new Array<number>(count).fill(0).map((_, i) => i);
  }
</script>

<div class="controls">
  <button on:click={previous} disabled={!previousAvailable}>
    <Icon icon={arrowLeft} />
  </button>
  <div class="indicators" aria-label="On screen {position + 1} of {count}">
    {#each countArr as _, i}
      <div
        class="indicator"
        class:active={i === position}
        role="presentation"
      />
    {/each}
  </div>
  <button on:click={next} disabled={!nextAvailable}>
    <Icon icon={arrowRight} />
  </button>
</div>

<style lang="scss">
  @import "src/styles/tokens";

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    border: 0;
    margin: 0;
    padding: 0.25rem;
    background: none;
    display: flex;
    border-radius: 100%;
    color: $text-primary-color;
    font-size: 2rem;
    &:disabled {
      color: $text-ghost-color;
    }
  }
  .indicators {
    display: flex;
    gap: 0.25rem;
  }
  .indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    background-color: $text-ghost-color;
    &.active {
      background-color: $text-actionable-color;
    }
  }
</style>

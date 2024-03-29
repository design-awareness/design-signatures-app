<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import check from "@iconify/icons-ic/baseline-check";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import colorPresets from "../../data/colorPresets";
  import { randomID } from "../../util/id";

  export let color: readonly [string, string];

  let idPrefix = randomID();
</script>

<div class="label">Color</div>
<div class="color-group">
  {#each colorPresets as colorPreset, id}
    <input
      type="radio"
      id="{idPrefix}{id}"
      bind:group={color}
      value={colorPreset}
    />
    <label
      for="{idPrefix}{id}"
      class="swatch"
      style="--swatch-light: #{colorPreset[0]}; --swatch-dark: #{colorPreset[1]}"
    >
      {#if colorPreset[0] === color[0] && colorPreset[1] === color[1]}
        <Icon icon={check} />
      {/if}
    </label>
  {/each}
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .label {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
  }

  .color-group {
    display: flex;
    flex-wrap: wrap;
    width: 5 * $color-picker-swatch-size + 4 * $color-picker-spacing;
    margin: 0 auto (-$color-picker-spacing) auto;

    input {
      display: none;
    }
    .swatch {
      width: $color-picker-swatch-size;
      height: $color-picker-swatch-size;
      border-radius: $color-picker-swatch-border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $color-picker-swatch-size -
        (2 * $color-picker-swatch-check-padding);
      color: $text-opposing-color;
      &:not(:nth-child(10n)) {
        margin: 0 $color-picker-spacing $color-picker-spacing 0;
      }

      :global(svg) {
        opacity: $color-picker-swatch-check-opacity;
      }

      background-color: getvar(swatch-light);
      @media (prefers-color-scheme: dark) {
        background-color: getvar(swatch-dark);
      }
    }
  }
</style>

<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import type { IconifyIcon } from "../types/IconifyIcon";
  export let disabled = false;
  export let small = false;
  export let inlabel = false;
  export let icon: IconifyIcon | null = null;
</script>

<button class:small class:inlabel on:click {disabled}>
  {#if icon}
    <Icon {icon} />
  {/if}
  <slot />
</button>

<style lang="scss">
  @import "src/styles/type.scss";
  @import "src/styles/tokens.scss";

  button {
    @include type-style($type-button);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $button-background-color;
    border: $button-border-size solid $button-border-color;
    box-sizing: border-box;
    border-radius: $button-border-radius;
    padding: calc(#{$button-padding-vertical} - #{$button-border-size})
      calc(#{$button-padding-horizontal} - #{$button-border-size});
    min-width: $button-min-width;
    white-space: nowrap;
    color: $text-primary-color;
    font-feature-settings: "tnum" 1;
    :global(svg) {
      margin-right: $button-icon-spacing;
      font-size: $button-icon-size;
    }
    &:disabled {
      color: $button-disabled-color;
      border-color: $button-disabled-color;
    }
  }

  .small {
    @include type-style($type-button-small);
    padding: calc(#{$button-padding-vertical-small} - #{$button-border-size})
      calc(#{$button-padding-horizontal-small} - #{$button-border-size});
  }

  .inlabel {
    @include type-style($type-button-inlabel);
    $height: rem(map-get($type-button-inlabel, height));
    line-height: calc(#{$height} - #{2 * $button-border-size});
    padding: 0 $button-padding-horizontal-label;
    min-width: $button-min-width-label;
    :global(svg) {
      font-size: $button-icon-size-label;
      margin-right: $button-icon-spacing-label;
    }
  }
</style>

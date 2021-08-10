<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import type { IconifyIcon } from "../types/IconifyIcon";

  export let type: "info" | "danger" | "note" = "info";
  export let icon: IconifyIcon | undefined = undefined;
</script>

<div class="alert type--{type}">
  {#if icon}
    <div class="alert-icon">
      <Icon {icon} />
    </div>
  {/if}
  <div class="alert-body">
    <slot />
  </div>
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .alert {
    &.type--info {
      --alert-color: #{$accent-info-color};
    }
    &.type--danger {
      --alert-color: #{$accent-danger-color};
    }
    &.type--note {
      --alert-color: #{$accent-note-color};
    }
    border: 1px solid var(--alert-color);
    border-radius: $input-border-radius;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: var(--alert-color);
      opacity: 0.2;
    }
  }
  .alert-icon {
    z-index: 1;
    padding: 1rem 0.5rem 1rem 1rem;
    font-size: 1.5rem;
    display: flex;
  }
  .alert-body {
    z-index: 1;
    padding: 0.5rem;
    @include type-style($type-input);
  }
</style>

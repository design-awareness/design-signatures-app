<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  export let fill = false;
</script>

<div class="group" class:fill>
  <slot />
</div>

<style lang="scss">
  @import "src/styles/tokens";
  .group {
    margin: $block-vertical-spacing 0 0 0;
    display: flex;
    justify-content: space-between;
    gap: $button-group-fill-spacing;

    // center single buttons
    :global(button):first-child:last-child {
      margin: 0 auto;
    }

    &.fill {
      :global(button) {
        flex-grow: 1;
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>

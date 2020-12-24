<script lang="ts">
  export let fill = false;
</script>

<style lang="scss">
  @import "src/styles/tokens";
  .group {
    margin: $block-vertical-spacing 0 0 0;
    display: flex;
    justify-content: space-between;

    // center single buttons
    :global(button):first-child:last-child {
      margin: 0 auto;
    }

    &.fill {
      // gap: $button-group-fill-spacing;
      :global(button) {
        flex-grow: 1;
        margin: 0 $button-group-fill-spacing/2;
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

<div class="group" class:fill>
  <slot />
</div>

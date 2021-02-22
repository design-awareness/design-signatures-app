<script type="ts">
  import Button from "./Button.svelte";

  export let disabled = false;
  export let label: string;
</script>

<div class="spacer" role="presentation" />
<div class="bar" class:disabled>
  <Button on:click {disabled}>{label}</Button>
</div>

<style type="scss">
  @import "src/styles/tokens";
  .bar {
    position: fixed;
    left: 0;
    bottom: 0;
    height: $action-bar-height;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $action-bar-shadow;
    background-color: $action-bar-background-color;
    &.disabled {
      background-color: $action-bar-background-color_disabled;
    }
  }
  .spacer {
    height: $action-bar-height;
  }
</style>

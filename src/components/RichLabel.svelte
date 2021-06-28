<script lang="ts">
  export let label: string;
</script>

<div class="label">
  <span>{label}</span>
  <slot />
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .label {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
    display: flex;
    span {
      flex-grow: 1;
    }
  }
</style>

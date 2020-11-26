<script lang="ts">
  export let disabled = false;

  export let small = false;
  export let inlabel = false;
</script>

<style lang="scss">
  @import "src/styles/type.scss";
  @import "src/styles/tokens.scss";

  button {
    @include type-style($type-button);
    text-align: center;
    background-color: $button-background-color;
    border: $button-border-size solid $button-border-color;
    box-sizing: border-box;
    border-radius: $button-border-radius;
    padding: calc(#{$button-padding-vertical} - #{$button-border-size})
      calc(#{$button-padding-horizontal} - #{$button-border-size});
    min-width: $button-min-width;
  }

  .inlabel {
    @include type-style($type-label-button);
    $height: rem(map-get($type-label-button, height));
    line-height: calc(#{$height} - #{2 * $button-border-size});
    padding: 0 $button-padding-horizontal-label;
    min-width: $button-min-width-label;
  }
</style>

<button class:small class:inlabel on:click {disabled}><slot /></button>

<script lang="ts">
  export let value: string;
  export let label: string;
  export let placeholder = "";

  export let large = false;
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  div {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
  }
  input,
  textarea {
    border: $input-border-size solid $input-border-color;
    border-radius: $input-border-radius;
    background-color: $input-background-color;
    padding: calc(#{$input-padding-vertical} - #{$input-border-size})
      calc(#{$input-padding-horizontal} - #{$input-border-size});
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin: 0 0 $block-vertical-spacing 0;
    font-size: 0.875rem;
    @include type-style($type-input);
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  textarea {
    min-width: 100%;
    max-width: 100%;
    min-height: calc(
      2 *
        (
          #{rem(map-get($type-input, height))} + #{$input-padding-vertical} + #{$input-border-size}
        )
    );
  }
</style>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <div>{label}</div>
  {#if large}
    <textarea bind:value {placeholder} />
  {:else}
    <input type="text" bind:value {placeholder} on:input {...$$props} />
  {/if}
</label>

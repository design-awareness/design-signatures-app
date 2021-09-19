<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  export let value: string;
  export let label: string;
  export let placeholder = "";
  export let helptext: string | null = null;

  export let large = false;
  export let xlarge = false;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  {#if label}
    <div>{label}</div>
  {/if}
  {#if large}
    <textarea bind:value class:xlarge {placeholder} on:blur />
  {:else}
    <input type="text" bind:value {placeholder} on:input on:blur {...$$props} />
  {/if}
  {#if helptext}
    <p>{helptext}</p>
  {/if}
</label>

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
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: $text-primary-color;
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
    &.xlarge {
      min-height: calc(
        2 * (#{$input-padding-vertical} + #{$input-border-size}) + 4 * #{rem(
            map-get($type-input, height)
          )}
      );
    }
  }
  label:first-child > div {
    margin-top: 0;
  }
  p {
    margin-top: 0;
    @include type-style($type-input);
    opacity: 0.5;
  }
</style>

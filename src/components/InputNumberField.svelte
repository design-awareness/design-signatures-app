<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  // FIXME: I'd really like to be able to use a single component for text and
  // numeric inputs, but I'm not sure how to do this in a nice type-safe way.

  export let value: number;
  export let label: string;
  export let placeholder = "";
  export let helptext: string | null = null;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  {#if label}
    <div>{label}</div>
  {/if}
  <input type="number" bind:value {placeholder} on:input {...$$props} />
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
  input {
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
  label:first-child > div {
    margin-top: 0;
  }
  p {
    margin-top: 0;
    @include type-style($type-input);
    opacity: 0.5;
  }
</style>

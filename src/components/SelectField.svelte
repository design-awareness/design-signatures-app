<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  export let label: string | null;
  export let value: any;
  export let options: [any, string][];
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  {#if label}
    <div>{label}</div>
  {/if}
  <select bind:value on:input {...$$props}>
    {#each options as option}
      <option value={option[0]}>{option[1]}</option>
    {/each}
  </select>
</label>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  div {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
  }
  select {
    color: $text-primary-color;
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
  }
</style>

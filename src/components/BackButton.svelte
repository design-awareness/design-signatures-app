<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Link from "./Link.svelte";
  import arrow from "@iconify-icons/ic/baseline-arrow-back";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  export let href: string = "/";
  export let button: null | (() => void) = null;
</script>

<div class="back-button">
  {#if button}
    <button on:click={button}>
      <Icon icon={arrow} />
      <span class="back">Back</span>
    </button>
  {:else}
    <Link {href} up>
      <Icon icon={arrow} />
      <span class="back">Back</span>
    </Link>
  {/if}
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .back-button :global(a),
  .back-button button {
    @include type-style($type-back-button);
    border: none;
    background: transparent;
    color: $back-button-text-color;
    text-decoration: none;
    font-weight: 600;
    padding: $back-button-padding-vertical $back-button-padding-horizontal;
    border-radius: $back-button-border-radius;
    display: inline-flex;
    align-items: center;
    &:focus,
    &:hover {
      background: rgba(black, 0.1);
    }
    :global(svg) {
      margin: -0.5rem 0.25rem -0.5rem -0.25rem;
      font-size: 1.25rem;
    }
  }
</style>

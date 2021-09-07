<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import caretDownIcon from "@iconify-icons/ic/baseline-keyboard-arrow-down";
  import caretUpIcon from "@iconify-icons/ic/baseline-keyboard-arrow-up";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import { getContext } from "svelte";
  import { AccordionItem } from "svelte-collapsible";
  import type { IconifyIcon } from "../types/IconifyIcon";
  import { randomID } from "../util/id";

  const store = getContext<SvelteStore<{ key: string }>>(
    "svelte-collapsible-accordion"
  );

  const key = randomID();
  export let icon: undefined | IconifyIcon = undefined;
  export let label: string;

  let open = false;
  $: open = $store.key === key;
</script>

<div class="wrapper">
  <AccordionItem {key}>
    <button slot="header" class="header">
      {#if icon}
        <Icon {icon} />
      {/if}
      <h4>{label}</h4>

      <Icon icon={open ? caretUpIcon : caretDownIcon} />
    </button>
    <div slot="body" class="card-body">
      <slot />
    </div>
  </AccordionItem>
</div>

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";
  @import "src/styles/type";

  .wrapper {
    box-shadow: $collapse-card-shadow;
    overflow: hidden;
    border-radius: $collapse-card-radius;
    background-color: $alt-background-color;
    margin: 0.75rem 0;
  }

  button {
    $focus-ring-allowance: 2px;
    width: calc(100% - #{2 * $focus-ring-allowance});
    border: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: calc(#{$collapse-padding-vertical} - #{$focus-ring-allowance})
      calc(#{$collapse-padding-horizontal} - #{$focus-ring-allowance});
    margin: $focus-ring-allowance;
    border-radius: $collapse-card-radius - $focus-ring-allowance;
    & :global(svg) {
      font-size: 1.5rem;
    }
  }

  .header {
    color: $text-primary-color;
  }

  .card-body {
    padding: $collapse-padding-vertical $collapse-padding-horizontal;
    > :global(:first-child) {
      margin-top: 0;
    }
    > :global(:last-child) {
      margin-bottom: 0;
    }
  }

  h4 {
    margin: 0;
    flex: 1;
    @include type-style($type-section-header);
  }
</style>

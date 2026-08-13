<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { CarouselContext } from "./context";
  import { key } from "./context";

  const context = getContext<CarouselContext | undefined>(key);
  if (!context) {
    throw new Error("<CarouselItem> can only be used inside <Carousel>.");
  }

  let thisElement: HTMLDivElement;
  const myIndex = context.register();

  onMount(() => {
    context.provideDOMElement(myIndex, thisElement);
  });
</script>

<div class="item-container" bind:this={thisElement}>
  <slot />
</div>

<style>
  .item-container {
    flex: 0 0 100%;
    width: 100%;
  }
</style>

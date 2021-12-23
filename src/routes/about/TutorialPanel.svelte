<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  import type { TypedMediaDef } from "../../components/TypedMedia.svelte";

  export type Tutorial = [TypedMediaDef, string][];

  export const tutorialPlaceholderMedia: TypedMediaDef = {
    type: "image",
    url: {
      light:
        "https://cdn.design-awareness.com/app-assets/tutorials/placeholder-light.svg",
      dark: "https://cdn.design-awareness.com/app-assets/tutorials/placeholder-dark.svg",
    },
  };
</script>

<script lang="ts">
  import { Carousel, CarouselItem } from "svelte-snappy-carousel";
  import CarouselControls from "../../components/CarouselControls.svelte";
  import DeviceOutline from "../../components/DeviceOutline.svelte";
  import TypedMedia from "../../components/TypedMedia.svelte";

  export let tutorial: Tutorial;
  // ensure tutorial doesn't get updated
  const data = tutorial;

  let visibleItem = 0;
</script>

<Carousel bind:visibleItem>
  {#each data as [media, label], i}
    <CarouselItem>
      <div class="pane">
        <div class="media">
          <DeviceOutline>
            <TypedMedia {media} isVisible={visibleItem === i} />
          </DeviceOutline>
        </div>
        <p>{label}</p>
      </div>
    </CarouselItem>
  {/each}
  <CarouselControls
    slot="outer-controls"
    let:next
    {next}
    let:previous
    {previous}
    let:nextAvailable
    {nextAvailable}
    let:previousAvailable
    {previousAvailable}
    let:count
    {count}
    let:position
    {position}
  />
</Carousel>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .pane {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .media {
    padding: 0 2rem;
    width: fit-content;
    :global(img),
    :global(video) {
      max-width: 100%;
    }
  }
  p {
    text-align: center;
    @include type-style($type-detail);
    padding: 1rem;
    margin: 0;
  }
</style>

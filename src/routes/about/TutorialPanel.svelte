<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  import type { TypedMedia } from "./TutorialMedia.svelte";

  export type Tutorial = [TypedMedia, string][];

  export const tutorialPlaceholderMedia: TypedMedia = {
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
  import TutorialMedia from "./TutorialMedia.svelte";

  export let tutorial: Tutorial;
  // ensure tutorial doesn't get updated
  const data = tutorial;
</script>

<Carousel>
  {#each data as [media, label]}
    <CarouselItem>
      <div class="pane">
        <div class="media">
          <div class="device-outline">
            <TutorialMedia {media} />
          </div>
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
    .device-outline {
      border: 8px solid black;
      border-radius: 24px;
      overflow: hidden;
      width: fit-content;
      display: flex;
    }
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

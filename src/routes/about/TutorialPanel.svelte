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
  import arrowLeft from "@iconify/icons-ic/outline-arrow-circle-left.js";
  import arrowRight from "@iconify/icons-ic/outline-arrow-circle-right.js";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import { Carousel, CarouselItem } from "svelte-snappy-carousel";
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
  <div
    slot="outer-controls"
    class="controls"
    let:next
    let:previous
    let:nextAvailable
    let:previousAvailable
    let:position
    let:count
  >
    <button on:click={previous} disabled={!previousAvailable}>
      <Icon icon={arrowLeft} />
    </button>
    <div class="indicators" aria-label="On screen {position + 1} of {count}">
      {#each data as _, i}
        <div
          class="indicator"
          class:active={i === position}
          role="presentation"
        />
      {/each}
    </div>
    <button on:click={next} disabled={!nextAvailable}>
      <Icon icon={arrowRight} />
    </button>
  </div>
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
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    border: 0;
    margin: 0;
    padding: 0.25rem;
    background: none;
    display: flex;
    border-radius: 100%;
    color: $text-primary-color;
    font-size: 2rem;
    &:disabled {
      color: $text-ghost-color;
    }
  }
  .indicators {
    display: flex;
    gap: 0.25rem;
  }
  .indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    background-color: $text-ghost-color;
    &.active {
      background-color: $text-actionable-color;
    }
  }
</style>

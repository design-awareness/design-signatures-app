<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  import type { Schemable } from "../../util/colorScheme";

  export type TypedMedia = StrictTypedMedia | Schemable<string>;

  type StrictTypedMedia =
    | {
        type: "image";
        url: Schemable<string>;
      }
    | {
        type: "video";
        url: Schemable<string>;
      };
</script>

<script lang="ts">
  import { hasOwnProperty } from "../../types/utility";

  import { colorScheme, fromSchemable } from "../../util/colorScheme";
  import { onMount } from "svelte";
  export let media: TypedMedia;
  export let isVisible = true;

  let derivedMedia: StrictTypedMedia;
  $: if (!hasOwnProperty(media, "type")) {
    derivedMedia = {
      type: "image",
      url: media,
    };
  } else {
    derivedMedia = media;
  }

  let wasVisible = isVisible;
  let videoElement: HTMLVideoElement;
  $: if (videoElement && wasVisible !== isVisible) {
    wasVisible = isVisible;
    if (isVisible) {
      attemptPlay();
    } else {
      videoElement.pause();
    }
  }
  onMount(() => {
    if (videoElement && isVisible) {
      attemptPlay();
    }
  });

  function attemptPlay() {
    if (videoElement) {
      let promise = videoElement.play();
      promise &&
        promise.catch((e) => {
          videoElement.addEventListener("click", attemptPlay, { once: true });
          console.error("failed to autoplay video:", e);
        });
    }
  }
</script>

{#if derivedMedia.type === "image"}
  <!-- svelte-ignore a11y-missing-attribute -->
  <img src={fromSchemable(derivedMedia.url, $colorScheme)} loading="lazy" />
{:else}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    bind:this={videoElement}
    src={fromSchemable(derivedMedia.url, $colorScheme)}
    loop
    muted
    preload="metadata"
    playsinline
  />
{/if}

<style lang="scss">
  video {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    border-radius: 16px; // 24 - 8, from deviceoutline
    overflow: hidden;
  }
</style>

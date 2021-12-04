<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  import type { Schemable } from "../util/colorScheme";

  export type TypedMediaDef = StrictTypedMedia | Schemable<string>;

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
  import { hasOwnProperty } from "../types/utility";

  import { colorScheme, fromSchemable } from "../util/colorScheme";
  export let media: TypedMedia;

  let derivedMedia: StrictTypedMedia;
  $: if (!hasOwnProperty(media, "type")) {
    derivedMedia = {
      type: "image",
      url: media,
    };
  } else {
    derivedMedia = media;
  }
</script>

{#if derivedMedia.type === "image"}
  <!-- svelte-ignore a11y-missing-attribute -->
  <img src={fromSchemable(derivedMedia.url, $colorScheme)} />
{:else}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video src={fromSchemable(derivedMedia.url, $colorScheme)} loop />
{/if}

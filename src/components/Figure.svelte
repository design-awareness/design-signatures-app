<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  // FIXME: move this to a build-time variable?
  export const CDN_PREFIX = "https://cdn.design-awareness.com/app-assets/";
</script>

<script lang="ts">
  export let path: string;
  export let alt: string;
</script>

<figure>
  <img src="{CDN_PREFIX}{path}" {alt} />
  <figcaption>
    <slot />
  </figcaption>
</figure>

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";
  @import "src/styles/type";

  figure {
    margin: $block-vertical-spacing auto;
    gap: math.div($block-vertical-spacing, 2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  img {
    max-width: 100%;
  }

  figcaption {
    @include type-style($type-caption);
    color: $text-secondary-color;
    font-style: italic;
  }
</style>

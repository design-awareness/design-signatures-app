<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";

  import type { IconifyIcon } from "../types/IconifyIcon";
  import { delay as startDelay } from "../util/delay";

  export let icon: IconifyIcon;
  export let label: string;
  export let delay: number = 0;

  let visible = startDelay(delay);
</script>

{#await visible then _}
  <div class="splash">
    <div class="icon">
      <Icon {icon} />
    </div>
    <h1>{label}</h1>
    <slot />
  </div>
{/await}

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .splash {
    position: absolute;
    background-color: $background-color;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 6rem;
      color: $text-ghost-color;
    }
    h1 {
      @include type-style($type-header);
      color: $text-secondary-color;
    }
  }
</style>

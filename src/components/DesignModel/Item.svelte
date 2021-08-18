<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import type { DesignModel } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";
  import ActivityList from "./ActivityList.svelte";

  export let designModel: DesignModel | null = null;
  export let selected = false;
  // export let empty = false;
</script>

<div class="item card" class:selected>
  {#if !designModel}
    <p class="inner">Start from scratch</p>
  {:else}
    <div class="header">
      <h4>{designModel.name}</h4>
    </div>
    <div class="body">
      <ActivityList activities={designModel.activities} />
    </div>
  {/if}
</div>

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";
  @import "src/styles/type";

  $pad-v: max(
    math.div($input-padding-vertical, 2),
    math.div($input-padding-horizontal, 2)
  );
  $pad-h: math.div($input-padding-horizontal, 2);

  .card {
    padding: 0;
  }
  .header {
    background-color: $design-model-header-background;
    padding: $pad-v $pad-h;
    display: flex;
    justify-content: space-between;
    h4 {
      color: $text-primary-color;
      @include type-style($type-input);
      margin: 0;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: $pad-v;
    padding: $pad-v $pad-h;
  }
  .inner {
    padding: $pad-v $pad-h;
    text-align: center;
  }

  .selected {
    .header {
      background-color: $design-model-header-selected;
    }
    background-color: $input-active-selection-background-color;
    border: $design-model-header-selected;
  }

  p {
    margin: 0;
    color: $text-primary-color;
  }
</style>

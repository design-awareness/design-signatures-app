<script lang="ts">
  import type { DesignModel } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";

  export let activitySet: DesignModel | null = null;
  export let selected = false;
  // export let empty = false;
</script>

<!-- reorganize divs so one top level w/ no pad or marg, then the header div and token div inside that -->
<div class="item designmodelcard" class:selected>
  {#if !activitySet}
    <p>Start from scratch</p>
  {:else}
    <div class="header">
      <p>{activitySet.name}</p>
    </div>
    <div class="activities">
      <ActivityToken forEach={activitySet} />
    </div>
  {/if}
</div>

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";

  div {
    padding: max(
        math.div($input-padding-vertical, 2),
        math.div($input-padding-horizontal, 2)
      )
      math.div($input-padding-horizontal, 2);
  }
  .designmodelcard {
    padding: 0;
  }
  .header {
    background-color: $design-model-header-background;
  }
  .selected {
    .header {
      background-color: $design-model-header-selected;
    }
    p {
      font-weight: bold;
    }
    background-color: $input-active-selection-background-color;
    border: $design-model-header-selected;
  }
  p {
    margin: 0;
    color: $text-primary-color;
  }
</style>

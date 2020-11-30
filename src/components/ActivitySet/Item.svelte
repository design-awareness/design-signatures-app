<script lang="ts">
  import type { ActivitySet } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";

  export let activitySet: ActivitySet = null;
  export let selected = false;
  export let empty = false;
</script>

<style lang="scss">
  @import "src/styles/tokens";

  div {
    padding: max($input-padding-vertical, $input-padding-horizontal)
      $input-padding-horizontal;
  }
  .selected {
    background-color: $input-active-selection-background-color;
  }
  p {
    margin: 0;
  }
</style>

<div class="item" class:selected>
  {#if empty}
    <p>Start from scratch</p>
  {:else}
    <p>{activitySet.name}</p>
    <ActivityToken forEach={activitySet} />
  {/if}
</div>

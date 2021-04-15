<script lang="ts">
  import type { ActivitySet } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";

  export let activitySet: ActivitySet | null = null;
  export let selected = false;
  // export let empty = false;
</script>

<div class="item" class:selected>
  {#if !activitySet}
    <p>Start from scratch</p>
  {:else}
    <p>{activitySet.name}</p>
    <ActivityToken forEach={activitySet} />
  {/if}
</div>

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
    color: $text-primary-color;
  }
</style>

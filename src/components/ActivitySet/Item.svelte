<script lang="ts">
  import type { ActivitySet } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";

  export let activitySet: ActivitySet;
  export let selected = false;
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
  <p>{activitySet.name}</p>
  <ActivityToken forEach={activitySet} />
</div>

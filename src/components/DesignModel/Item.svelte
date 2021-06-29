<script lang="ts">
  import type { DesignModel } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";

  export let designModel: DesignModel | null = null;
  export let selected = false;
  // export let empty = false;
</script>

<!-- should clean up the loop -->
<div class="item designmodelcard" class:selected>
  {#if !designModel}
    <p>Start from scratch</p>
  {:else}
    <div class="header">
      <p>{designModel.name}</p>
    </div>
    <div class="activities">
      {#each designModel.activities as {name, code, color}}
      <div class="activity">
        <div class="token"><ActivityToken mini color={color} code={code}/></div>
        <p>{name}</p>
      </div>
      {/each}
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
  .activity {
    padding: 0;
    display: inline-flex;
    align-items: center;
  }
  .token {
    float:left;
  }
  .header {
    background-color: $design-model-header-background;
  }
  .selected {
    .header {
      background-color: $design-model-header-selected;
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

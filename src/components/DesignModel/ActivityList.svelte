<script lang="ts">
  import type { DesignModel } from "../../data/schema";
  import ActivityToken from "../ActivityToken.svelte";

  export let activities: DesignModel["activities"];
  export let small = true;
</script>

{#each activities as { name, code, color }}
  <div class="activity" class:small>
    <div class="token"><ActivityToken mini={small} {color} {code} /></div>
    <p>{name}</p>
  </div>
{/each}

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .activity {
    padding: 0;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    p {
      @include type-style($type-body);
      margin: 0;
      color: $text-primary-color;
    }
    &.small p {
      @include type-style($type-caption);
    }
  }
  .token {
    display: flex;
    padding-left: 0;
    .activity:not(.small) & {
      width: 5rem;
      justify-content: flex-end;
    }
  }
</style>

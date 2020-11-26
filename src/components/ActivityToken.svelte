<script lang="ts">
  import type { ActivitySet } from "../data/schema";
  import ActivitySetEditor from "./dev/DBEditor/ActivitySetEditor.svelte";

  export let forEach: ActivitySet = null;
  let activitySet: ActivitySet;
  $: activitySet = forEach as ActivitySet;
  export let align: "left" | "right" | "center" = "left";

  export let color: string = null;
  export let code: string = null;
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .label {
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
    display: flex;
    justify-content: space-between;
  }
  ul {
    margin: ($input-spacing-inner / 2) 0 0 0;
    padding: 0;
  }
  li {
    display: inline-block;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  i {
    @include type-style($type-token);
    display: inline-block;
    text-transform: uppercase;
    color: $token-text-color;
    font-style: normal;
    padding: $token-vertical-spacing $token-horizontal-spacing;
    border-radius: $token-border-radius;
    margin: 0 0.25rem 0.25rem 0;
  }
</style>

{#if forEach}
  <ul class={align}>
    {#each activitySet.activityCodes as code, i}
      <li>
        <svelte:self color={activitySet.colors[i]} {code} />
      </li>
    {/each}
  </ul>
{:else}<i style="background-color: #{color}">{code}</i>{/if}

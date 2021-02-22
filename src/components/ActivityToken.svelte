<script lang="ts">
  import type { ActivitySet } from "../data/schema";
  import ActivitySetEditor from "./dev/DBEditor/ActivitySetEditor.svelte";

  export let forEach: ActivitySet = null;
  let activitySet: ActivitySet;
  $: activitySet = forEach as ActivitySet;
  export let align: "left" | "right" | "center" = "left";
  export let fixWidth = false;
  export let space = false;

  export let color: [string, string] = null;
  export let code: string = null;

  const NBSP = " ";
</script>

{#if forEach}
  <ul style="text-align: {align}">
    {#each activitySet.activityCodes as code, i}
      <li>
        <svelte:self space color={activitySet.colors[i]} {code} />
      </li>
    {/each}
  </ul>
{:else}
  <i
    class:fixWidth
    class:space
    style="--color-light: #{color?.[0]}; --color-dark: #{color?.[1]}"
  >{code || NBSP}</i>
{/if}

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
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
    color: $text-opposing-color;
    font-style: normal;
    padding: $token-vertical-spacing $token-horizontal-spacing;
    border-radius: $token-border-radius;
    text-align: center;

    background-color: getvar(color-light);
    @media (prefers-color-scheme: dark) {
      background-color: getvar(color-dark);
    }

    &.space {
      margin: 0 0.25rem 0.25rem 0;
    }
    &.fixWidth {
      width: $token-fixed-width;
    }
  }
</style>

<script lang="ts">
  import type { DesignModel } from "../data/schema";

  // FIXME: this probably shouldn't be a function of ActivityToken.
  // I think it's only in the design model previewer, so since that's
  // getting redone we should be able to take this away.
  export let forEach: DesignModel | null = null;
  let designModel: DesignModel;
  $: designModel = forEach as DesignModel;
  export let align: "left" | "right" | "center" = "left";
  export let fixWidth = false;
  export let space = false;

  export let color: readonly [string, string] | null = null;
  export let code: string | null = null;

  const NBSP = " ";
</script>

{#if forEach}
  <ul style="text-align: {align}">
    {#each designModel.activities as { color, code }}
      <li>
        <svelte:self space {color} {code} />
      </li>
    {/each}
  </ul>
{:else}
  <i
    class:fixWidth
    class:space
    style="--color-light: #{color?.[0]}; --color-dark: #{color?.[1]}"
    >{code || NBSP}</i
  >
{/if}

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";
  @import "src/styles/type";
  ul {
    margin: math.div($input-spacing-inner, 2) 0 0 0;
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

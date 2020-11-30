<script lang="ts">
  import Link from "./Link.svelte";
  import arrow from "@iconify-icons/ic/baseline-arrow-back";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  export let href: string = "/";
  export let button: () => void = null;
</script>

<style lang="scss">
  @import "src/styles/tokens";

  .back-button :global(a),
  .back-button :global(button) {
    border: none;
    background: transparent;
    font: inherit;
    display: inline-block;
    color: $back-button-text-color;
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    display: inline-flex;
    align-items: center;
    &:focus,
    &:hover {
      background: rgba(black, 0.1);
    }
    :global(svg) {
      margin: -0.5rem 0.25rem -0.5rem -0.25rem;
      font-size: 1.25rem;
    }
  }
</style>

<div class="back-button">
  {#if button}
    <button on:click={button}>
      <Icon icon={arrow} />
      <span class="back">Back</span>
    </button>
  {:else}
    <Link {href} up>
      <Icon icon={arrow} />
      <span class="back">Back</span>
    </Link>
  {/if}
</div>

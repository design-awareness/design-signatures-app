<script lang="ts">
  import Link from "./Link.svelte";
  export let href: string;
</script>

<style lang="scss">
  .back-button :global(a) {
    display: inline-block;
    color: #8f8f8f;
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 0.5rem;
    border-radius: 2rem;
    &:focus,
    &:hover {
      background: rgba(black, 0.1);
    }
  }
  .back::before {
    content: "<- ";
  }
</style>

<div class="back-button">
  <Link {href} up><span class="back">Back</span></Link>
</div>

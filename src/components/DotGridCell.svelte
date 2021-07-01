<script lang="ts">
  import type { AsyncEntry } from "../data/schema";

  export let data: AsyncEntry["data"][0] | undefined;
  export let max: number;

  let size: number = 0;
  if (data && data.value && max) {
    size = Math.sqrt(data.value / max);
  }
</script>

<div class="cell" class:hasData={data && data.value}>
  {#if data}
    {#if data.note}
      <div class="note-indicator" />
    {/if}
    {#if data.value}
      <div class="dot" style="transform: scale({size})" />
    {:else}
      <div class="missing" />
    {/if}
  {/if}
</div>

<style lang="scss">
</style>

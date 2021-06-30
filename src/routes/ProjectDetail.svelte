<script lang="ts">
  import { getProjectOrFail } from "../data/database";
  import ProjectDetailRealtime from "./ProjectDetailRealtime.svelte";
  import ProjectDetailAsync from "./ProjectDetailAsync.svelte";

  export let params: { id: string };
  let promise = getProjectOrFail(params.id);
</script>

{#await promise}
  Loading project…
{:then projectProperties}
  {#if projectProperties[0] === "AsyncProject"}
    <ProjectDetailAsync project={projectProperties[1]} />
  {:else}
    <ProjectDetailRealtime project={projectProperties[1]} />
  {/if}
{:catch}
  No such project exists.
{/await}

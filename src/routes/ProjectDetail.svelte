<script lang="ts">
  import { pop } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Link from "../components/Link.svelte";
  import Header from "../components/type/Header.svelte";
  import { getProject } from "../data/database";
  import type { Project } from "../data/schema";

  export let params: { id: string };

  let projectPromise: Promise<Project>;
  projectPromise = getProject(params.id);

  let active = true;
  async function remove() {
    active = false;
    await (await projectPromise).remove();
    pop();
  }
</script>

<style lang="scss">
</style>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    {#await projectPromise}
      loading…
    {:then project}
      <Header>{project.name || 'No project here!'}</Header>
      <p>{project.id}</p>
      <button on:click={remove} disabled={!active}>delete</button>
    {/await}
  </ContentFrame>
</main>

<script lang="ts">
  import Header from "../components/type/Header.svelte";
  import { newActivitySet, newProject } from "../data/database";
  import { pop } from "svelte-spa-router/Router.svelte";
  import Link from "../components/Link.svelte";
  let rand = Math.floor(Math.random() * 65536);
  let name = "New project " + rand.toString(16);
  let active = true;
  async function go() {
    active = false;
    const proj = newProject();
    const actv = newActivitySet();
    proj.activitySet = actv;
    proj.name = name;
    actv.name = "Activity set " + rand.toString(16);
    await proj.save();
    pop();
  }
</script>

<main class="device-frame page">
  <Link up href="/">back</Link>
  <Header>Create project</Header>
  <input bind:value={name} disabled={!active} />
  <button on:click={go} disabled={!active}>create</button>
</main>

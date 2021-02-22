<script lang="ts">
  import Header from "../components/type/Header.svelte";
  import type { ActivitySet } from "../data/schema";
  import { newProject } from "../data/database";
  import { replace } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import InputField from "../components/InputField.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ActivitySetChooser from "../components/ActivitySet/Chooser.svelte";
  import BuilderFrame from "../components/ActivitySet/BuilderFrame.svelte";
  import { pushRecentProject } from "../data/recentProjects";

  let name = "";
  let description = "";

  let activitySet: ActivitySet = null;
  let isCreating = false;

  let newSetOverlay = false;

  let beginEnabled = false;
  $: beginEnabled = name !== "" && activitySet !== null && !isCreating;

  async function go() {
    isCreating = true;
    const proj = newProject();
    proj.name = name;
    proj.description = description;
    proj.activitySet = activitySet;
    proj.created = new Date();
    proj.lastModified = new Date();
    proj.notes = [];
    proj.sessions = [];
    proj.active = true;
    await proj.save();
    const id = proj.id;
    pushRecentProject(id);
    await replace(`/projects/${id}/`);
  }
</script>

<main class="device-frame page">
  {#if !newSetOverlay}
    <ContentFrame>
      <BackButton href="/" />
      <Header>Create project</Header>
      <InputField
        label="Project Name"
        placeholder="My cool project"
        bind:value={name}
      />
      <InputField label="Description" large bind:value={description} />
      <ActivitySetChooser
        bind:activitySet
        createNew={() => (newSetOverlay = true)}
      />
    </ContentFrame>
    <BottomActionBar
      label="Create project"
      on:click={go}
      disabled={!beginEnabled}
    />
  {:else}
    <!-- newSetOverlay -->
    <BuilderFrame bind:visible={newSetOverlay} bind:activitySet />
  {/if}
</main>

<style lang="scss">
  @import "src/styles/tokens";
  .page {
    background-color: $background-color;
    min-height: 100%;
  }
</style>

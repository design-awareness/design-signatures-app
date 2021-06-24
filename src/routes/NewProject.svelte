<script lang="ts">
  import Header from "../components/type/Header.svelte";
  import type { DesignModel } from "../data/schema";
  import { newRealtimeProject } from "../data/database";
  import { replace, location } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import InputField from "../components/InputField.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ActivitySetChooser from "../components/ActivitySet/Chooser.svelte";
  import BuilderFrame from "../components/ActivitySet/BuilderFrame.svelte";
  import { pushRecentProject } from "../data/recentProjects";
  import { push } from "svelte-spa-router";

  let name = "";
  let description = "";

  let activitySet: DesignModel;
  let isCreating = false;

  const BUILDER_SUFFIX = "as";
  const BUILDER_MODAL_SUFFIX = "as!";

  export let params: { wild: string };

  let beginEnabled = false;
  $: beginEnabled = name !== "" && activitySet !== null && !isCreating;

  async function go() {
    isCreating = true;
    const proj = newRealtimeProject();
    proj.name = name;
    proj.description = description;
    proj.designModel = activitySet;
    proj.created = new Date();
    proj.modified = new Date();
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
  {#if !(params.wild === BUILDER_SUFFIX || params.wild === BUILDER_MODAL_SUFFIX)}
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
        createNew={() => push($location + "as")}
      />
    </ContentFrame>
    <BottomActionBar
      label="Create project"
      on:click={go}
      disabled={!beginEnabled}
    />
  {:else}
    <!-- newSetOverlay -->
    <BuilderFrame
      bind:activitySet
      showModal={params.wild === BUILDER_MODAL_SUFFIX}
    />
  {/if}
</main>

<style lang="scss">
  @import "src/styles/tokens";
  .page {
    background-color: $background-color;
    min-height: 100%;
  }
</style>

<script lang="ts">
  import Header from "../components/type/Header.svelte";
  import type { ActivitySet } from "../data/schema";
  import { newActivitySet, newProject } from "../data/database";
  import { pop } from "svelte-spa-router/Router.svelte";
  import Link from "../components/Link.svelte";
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import InputField from "../components/InputField.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ActivitySetChooser from "../components/ActivitySet/Chooser.svelte";

  let name = "";
  let description = "";

  let activitySet: ActivitySet = null;
  let isCreating = false;

  let beginEnabled = false;
  $: beginEnabled = name !== "" && activitySet !== null && !isCreating;

  async function go() {
    isCreating = true;
    const proj = newProject();
    proj.name = name;
    proj.description = description;
    console.log(activitySet.name);
    proj.activitySet = activitySet;
    console.log(proj);
    console.log(proj.activitySet && proj.activitySet.name);
    await proj.save();
    pop();
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  .page {
    background-color: $background-color;
    min-height: 100%;
  }
</style>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Create project</Header>
    <InputField label="Name" placeholder="My cool project" bind:value={name} />
    <InputField label="Description" large bind:value={description} />
    <ActivitySetChooser bind:activitySet />
  </ContentFrame>
  <BottomActionBar
    label="Begin tracking"
    on:click={go}
    disabled={!beginEnabled} />
</main>

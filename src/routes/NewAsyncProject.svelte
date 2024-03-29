<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { pop, push } from "svelte-spa-router";
  import { location, replace } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import {
    BUILDER_MODAL_SUFFIX,
    BUILDER_SUFFIX,
  } from "../components/DesignModel/Builder.svelte";
  import BuilderFrame from "../components/DesignModel/BuilderFrame.svelte";
  import DesignModelChooser from "../components/DesignModel/Chooser.svelte";
  import InputField from "../components/InputField.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import SegmentedSelector from "../components/SegmentedSelector.svelte";
  import Header from "../components/type/Header.svelte";
  import { newAsyncProject } from "../data/database";
  import { pushRecentProject } from "../data/recentProjects";
  import type { DesignModel } from "../data/schema";
  import { delay } from "../util/delay";

  let name = "";
  let description = "";
  let reportingPeriod: "day" | "week" | null = null;
  let periodAlignment: number = 0;

  let designModel: DesignModel;
  let isCreating = false;

  export let params: { wild: string };

  let periodsPage: 0 | 1 | 2 = 0;
  $: if (periodAlignment === -1) {
    periodsPage++;
    if (periodsPage > 2) {
      periodsPage = 0;
    }
    setTimeout(() => {
      periodAlignment = [0, 2, 5][periodsPage];
    }, 0);
  }

  const periodOptions: [number, string][][] = [
    [
      [0, "Sunday"],
      [1, "Monday"],
      [-1, "More…"],
    ],
    [
      [2, "Tuesday"],
      [3, "Wednesday"],
      [4, "Thursday"],
      [-1, "More…"],
    ],
    [
      [5, "Friday"],
      [6, "Saturday"],
      [-1, "More…"],
    ],
  ];

  let canContinue = false;
  $: canContinue =
    name !== "" &&
    reportingPeriod !== null &&
    designModel !== null &&
    !isCreating;

  async function go() {
    isCreating = true;
    const proj = newAsyncProject();
    proj.name = name;
    proj.description = description;
    proj.designModel = designModel;
    proj.created = new Date();
    proj.modified = new Date();
    proj.notes = [];
    proj.entries = [];
    // this nullish fallback shouldn't be necessary, since reportingPeriod needs
    // a choice before the button is enabled, but this keeps typescript happy!
    proj.reportingPeriod = reportingPeriod ?? "day";
    proj.periodAlignment = periodAlignment;
    proj.active = true;
    await proj.save();
    const id = proj.id;
    pushRecentProject(id);
    await pop();
    await delay(16);
    await replace(`/projects/${id}/`);
  }
</script>

<main class="device-frame page">
  {#if !(params.wild === BUILDER_SUFFIX || params.wild === BUILDER_MODAL_SUFFIX)}
    <ContentFrame>
      <BackButton href="/new/" />
      <Header>Create Project</Header>
      <InputField
        label="Project name"
        placeholder="My cool project"
        bind:value={name}
      />
      <InputField label="Description" large bind:value={description} />
      <SegmentedSelector
        fullWidth
        label="I want to log my design activity every:"
        bind:value={reportingPeriod}
        options={[
          ["day", "Day"],
          ["week", "Week"],
        ]}
      />
      <SegmentedSelector
        fullWidth
        label="Start week on:"
        bind:value={periodAlignment}
        options={periodOptions[periodsPage]}
      />
      <DesignModelChooser
        bind:selectedDesignModel={designModel}
        createNew={() => push($location + BUILDER_SUFFIX)}
      />
    </ContentFrame>
    <BottomActionBar
      label="Create project"
      on:click={go}
      disabled={!canContinue}
    />
  {:else}
    <BuilderFrame
      bind:designModel
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

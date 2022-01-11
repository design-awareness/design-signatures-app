<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import bellIcon from "@iconify/icons-ic/baseline-notifications-none";
  import { pop, push, querystring } from "svelte-spa-router";
  import reflectIcon from "../assets/reflectIcon";
  import ActivityToken from "../components/ActivityToken.svelte";
  import Alert from "../components/Alert.svelte";
  import BackButton from "../components/BackButton.svelte";
  import Button from "../components/Button.svelte";
  import type { ViewMode } from "../components/DotGrid.svelte";
  import DotGrid from "../components/DotGrid.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import ProjectNotes from "../components/ProjectNotes.svelte";
  import ProjectSummaryAsync from "../components/ProjectSummaryAsync.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import CONFIG from "../data/config";
  import type { AsyncEntry, AsyncProject } from "../data/schema";
  import { makeEntryTable } from "../util/asyncEntry";
  import { getToday } from "../util/date";
  import dotTimeline from "../util/dotTimeline";
  import { expressiveDurationM } from "../util/time";
  import AsyncEntryEditor from "./AsyncEntryEditor.svelte";

  export let project: AsyncProject;

  let showCanvas = false;
  (async function () {
    showCanvas = await CONFIG.getDevShowCanvasTimelineOnProjectPage();
  })();

  let { reportingPeriod } = project;
  let entryTable = makeEntryTable(project);

  let viewOptions: [ViewMode, string][] = [
    ["week", "Week"],
    ["month", "Month"],
  ];
  if (reportingPeriod === "day") viewOptions.unshift(["day", "Day"]);
  let view: ViewMode = viewOptions[1][0];
  let viewDate: Date = getToday();
  let activeEntry: AsyncEntry | null = null;

  let selectedActivity = -1;

  let updateSummary: () => void = function () {};

  let showEntry: boolean;
  let wasShowingEntry = false;
  $: {
    showEntry = $querystring === "entry";
    if (showEntry && !activeEntry) pop();
    if (wasShowingEntry && !showEntry && activeEntry && activeEntry.dirty) {
      project.save();
      updateSummary?.();
    }
    wasShowingEntry = showEntry;
  }

  async function saveEntry() {
    if (!activeEntry) return;
    activeEntry.modified = new Date();
    project.modified = new Date();
    await project.save();
    updateSummary?.();
    wasShowingEntry = false;
    await pop();
  }

  let entryLabel: string = "";
</script>

<main class="device-frame page">
  {#if showEntry && activeEntry}
    <AsyncEntryEditor
      {project}
      entry={activeEntry}
      label={entryLabel}
      save={saveEntry}
      designModel={project.designModel}
    />
  {:else}
    <ContentFrame>
      <div class="top-bar">
        <BackButton href="/" />
        <ProjectMenu bind:project />
      </div>
      <Header>{project.name}</Header>
      <p class="description">{project.description}</p>

      <PageSeparator />

      {#if project.entries.length === 0}
        <Alert type="info" icon={bellIcon}>
          <strong>Document your first entry!</strong>
          Select a time interval below to add an entry.
        </Alert>
      {/if}

      <DotGrid
        {project}
        {entryTable}
        {viewOptions}
        bind:view
        bind:viewDate
        bind:activeEntry
        bind:entryLabel
        {updateSummary}
        bind:selectedActivity
      />

      {#if view === reportingPeriod && activeEntry !== null && (activeEntry.note || activeEntry.data.some(({ note }) => note))}
        <div class="contextual-notes">
          {#if selectedActivity === -1 || activeEntry.data[selectedActivity].note}
            <SectionHeader>Entry notes</SectionHeader>
          {/if}
          {#if activeEntry.note && selectedActivity === -1}
            <div class="note-card">
              <p>{activeEntry.note}</p>
            </div>
          {/if}
          {#each activeEntry?.data ?? [] as { value, note }, i}
            {#if note && (selectedActivity === -1 || selectedActivity === i)}
              <div class="note-card">
                <div class="note-meta">
                  <ActivityToken
                    mini
                    code={project.designModel.activities[i].code}
                    color={project.designModel.activities[i].color}
                  />
                  <span>{expressiveDurationM(value)}</span>
                </div>
                <p>{note}</p>
              </div>
            {/if}
          {/each}
        </div>
      {/if}

      {#if project && showCanvas}
        <div class="canvas-timeline-container">
          <canvas use:dotTimeline={{ project }} />
        </div>
      {/if}

      {#if project.entries.length !== 0}
        <div class="reflect-button">
          <Button
            on:click={async () => await push("/reflect/")}
            icon={reflectIcon}
          >
            Reflect
          </Button>
        </div>
      {/if}

      <PageSeparator />

      <ProjectSummaryAsync {project} bind:update={updateSummary} />

      {#if project.active || project.notes.length > 0}
        <PageSeparator />

        <ProjectNotes {project} />
      {/if}
    </ContentFrame>
  {/if}
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $alt-background-color;
    min-height: 100%;
  }

  .description {
    color: $text-secondary-color;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
  }

  .reflect-button {
    margin-top: $block-vertical-spacing;
    display: flex;
    justify-content: flex-end;
  }

  .contextual-notes {
    margin-top: $block-vertical-spacing;
  }
  .note-card {
    .note-meta {
      display: flex;
      align-items: center;
      span {
        @include type-style($type-detail);
        color: $text-secondary-color;
        &::before {
          content: "·";
          margin: 0 0.5rem;
        }
      }
    }
    p {
      @include type-style($type-body);
      margin: 0.25rem 0 1rem 0;
    }
  }

  .canvas-timeline-container {
    max-width: 100%;
    overflow: auto;
  }
</style>

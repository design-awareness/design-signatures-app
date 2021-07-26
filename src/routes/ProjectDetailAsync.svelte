<script lang="ts">
  import bellIcon from "@iconify-icons/ic/baseline-notifications-none";
  import { pop, push, querystring } from "svelte-spa-router";
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
  import type { AsyncEntry, AsyncProject } from "../data/schema";
  import { makeEntryTable } from "../util/asyncEntry";
  import type { SimpleDate } from "../util/date";
  import { getToday } from "../util/date";
  import { expressiveDurationM } from "../util/time";
  import AsyncEntryEditor from "./AsyncEntryEditor.svelte";

  export let project: AsyncProject;

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

      {#if project.entries.length !== 0}
        <div class="reflect-button">
          <Button on:click={async () => await push("/reflect/")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440.7 470.4" class="reflect-icon">
              <path d="M84.3 334.5C-68 183.8 49.5 12.8 205.1 15.7c125.2 2.3 175 90.7 178.6 140.6.8 11.5-.8 34.2-4.5 38.3l46.6 97.2-37.2.9s4 45.4 3.2 53.8c-3.3 34-11.1 42.5-81.5 40.4l1.5 66.9H104.1v-72.9" fill="none" stroke-width="25" stroke-linecap="square" stroke-linejoin="round" stroke-miterlimit="10"/>
              <g stroke-miterlimit="10"><path d="M145.4 316.1L62.6 446 24 412.6l91-117.8c-61.5-60-42.9-140.7.3-187.2s117.2-51.3 175.1 1.3c64.1 58.3 42.2 135.5 13.7 174.1-28.8 39.1-84.5 64.8-158.7 33.1z" fill="none" stroke-width="33" stroke-linejoin="round"/>
                <path d="M121.011 279.458l36.054 26.086-99.01 136.843L22.003 416.3z" stroke-width="1.00003"/>
              </g>
            </svg>
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
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
    .reflect-icon{
      height: 1.2rem;
      stroke: $text-primary-color;
    }
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
</style>

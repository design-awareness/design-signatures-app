<script lang="ts">
  import { push } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import Button from "../components/Button.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import ProjectNotes from "../components/ProjectNotes.svelte";
  import ProjectSummaryRealtime from "../components/ProjectSummaryRealtime.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { newProjectNote } from "../data/database";
  import { checkNeedsRepair, repair } from "../data/repairRealtimeSession";
  import type { RealtimeProject } from "../data/schema";
  import { shortDuration } from "../util/time";

  export let project: RealtimeProject;

  // it's possible that the last session could have been corrupted
  // due to, for example, the user closing the app with tracking in
  // progress and some activities enabled. Starting at the end,
  // check sessions and repair if necessary, stopping when a session
  // doesn't need repairing. More than one should be pretty unlikely :-)
  if (project.sessions.length > 0) {
    let sessionIdxToRepair = project.sessions.length - 1;
    let needsRepair = false;
    do {
      let session = project.sessions[sessionIdxToRepair];
      needsRepair = checkNeedsRepair(session);
      if (needsRepair) {
        repair(session);
        session.save();
      }
      sessionIdxToRepair--;
    } while (needsRepair && sessionIdxToRepair >= 0);
  }

  function startTracking() {
    push(`/projects/${project.id}/track/`);
  }

  function getPreviousSessionTotal(i: number) {
    let total = 0;
    for (let j = 0; j < i; j++) {
      total += project.sessions[j].duration;
    }
    return total;
  }

  let showProjectTimestamps = true;
</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
      <ProjectMenu bind:project />
    </div>
    <Header>{project.name}</Header>
    <p class="description">{project.description}</p>

    <PageSeparator />

    <RichTimeline {project} scalable />

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

    <PageSeparator />

    <ProjectSummaryRealtime {project} />

    {#if project.sessions?.some((session) => session.notes.length > 0)}
      <PageSeparator />

      <!-- FIXME: This should have both project and session-level notes?  -->
      <Header>Tracking Notes</Header>

      {#each project.sessions as session, i}
        {#each session.notes as note}
          <div
            class="note-meta"
            on:click={() => (showProjectTimestamps = !showProjectTimestamps)}
          >
            {#if showProjectTimestamps}
              {shortDuration(getPreviousSessionTotal(i) + note.time)}
            {:else}
              {note.created.toLocaleDateString(undefined, {
                day: "numeric",
                month: "numeric",
                year: "2-digit",
              })}
              {note.created.toLocaleString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            {/if}
          </div>
          <div class="content">{note.content}</div>
        {/each}
      {/each}
    {/if}

    {#if project.active || project.notes.length > 0}
      <PageSeparator />
      <ProjectNotes {project} />
    {/if}

    {#if project.active}
      <BottomActionBar
        label={project.sessions?.length ? "Resume tracking" : "Start tracking"}
        on:click={startTracking}
      />
    {/if}
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $background-color;
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

  .note-meta {
    white-space: nowrap;
    padding-right: 0.5rem;
    @include type-style($type-note-meta);
    color: $text-secondary-color;
  }
  .content {
    margin-bottom: 1rem;
  }
</style>

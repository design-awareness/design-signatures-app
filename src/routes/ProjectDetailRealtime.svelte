<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import closeIcon from "@iconify-icons/ic/baseline-close";
  import { tick } from "svelte";
  import { push } from "svelte-spa-router/Router.svelte";
  import reflectIcon from "../assets/reflectIcon";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import Button from "../components/Button.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import ProjectNotes from "../components/ProjectNotes.svelte";
  import ProjectSummaryRealtime from "../components/ProjectSummaryRealtime.svelte";
  import Header from "../components/type/Header.svelte";
  import { checkNeedsRepair, repair } from "../data/repairRealtimeSession";
  import type { RealtimeProject, TimedNote } from "../data/schema";
  import { delay } from "../util/delay";
  import { shortDuration } from "../util/time";
  import timeline from "../util/timeline";

  export let project: RealtimeProject;

  let timelinePinned = false;

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

  let timelineHeightEl: HTMLDivElement | undefined;
  let timelineHeight = 1;
  async function pinTimeline() {
    timelinePinned = true;
    await tick();
    timelineHeight = timelineHeightEl?.getBoundingClientRect?.()?.height ?? 0;
  }
  function unpinTimeline() {
    timelinePinned = false;
  }

  let noteElementLookup = new Map<TimedNote, HTMLDivElement>();
  function setNote(el: HTMLDivElement, note: TimedNote) {
    noteElementLookup.set(note, el);
  }

  async function showNote(note: TimedNote) {
    let element = noteElementLookup.get(note);
    if (element) {
      await tick();
      let scrollTarget = element.offsetTop - timelineHeight;
      document.documentElement.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });
      element.classList.remove("selected");
      await delay(100);
      element.classList.add("selected");
    }
  }
</script>

<main class="device-frame page">
  <ContentFrame>
    {#if timelinePinned}
      <div
        class="timeline-spacer"
        role="presentation"
        style="height: {timelineHeight}px"
      />
    {:else}
      <div class="top-bar">
        <BackButton href="/" />
        <ProjectMenu bind:project />
      </div>
      <Header>{project.name}</Header>
      <p class="description">{project.description}</p>

      <PageSeparator />
    {/if}

    <div
      class="timeline-area"
      class:pinned={timelinePinned}
      bind:this={timelineHeightEl}
    >
      {#if timelinePinned}
        <Button small icon={closeIcon} on:click={unpinTimeline}>
          Unpin timeline
        </Button>
      {/if}
      <canvas
        use:timeline={{ project, selectNote: showNote }}
        on:click={pinTimeline}
      />
    </div>

    {#if !timelinePinned}
      {#if project.sessions.length !== 0}
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
    {/if}

    <ProjectSummaryRealtime {project} />

    {#if project.sessions?.some((session) => session.notes.length > 0)}
      <PageSeparator />

      <!-- FIXME: This should have both project and session-level notes?  -->
      <Header>Tracking Notes</Header>

      {#each project.sessions as session, i}
        {#each session.notes as note}
          <div class="session-note" use:setNote={note} class:selected={false}>
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
          </div>
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
    margin-top: $block-vertical-spacing;
    display: flex;
    justify-content: flex-end;
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

  .timeline-area.pinned {
    position: fixed;
    top: 0;
    left: 0px;
    box-sizing: border-box;
    width: 100%;
    padding: 1rem;
    background-color: $alt-background-color;
    border-bottom: 1px solid $text-ghost-color;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    z-index: 50;
  }

  .session-note.selected {
    animation: 2s highlight-note ease;
  }

  @keyframes highlight-note {
    0% {
      background-color: $accent-note-color;
    }
    50% {
      background-color: $accent-note-color;
    }
    100% {
      background-color: transparent;
    }
  }
</style>

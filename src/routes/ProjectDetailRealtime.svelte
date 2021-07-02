<script lang="ts">
  import { push } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import Button from "../components/Button.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import type { RealtimeProject } from "../data/schema";
  import { shortDuration } from "../util/time";

  export let project: RealtimeProject;

  function startTracking() {
    push(`/projects/${project.id}/track/`);
  }

  let showProjectTimestamps = false;
</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
      <ProjectMenu bind:project />
    </div>
    <Header>{project.name || "No project here!"}</Header>
    <p class="description">{project.description}</p>
    <SectionHeader>Tracking overview</SectionHeader>
    <RichTimeline {project} scalable />

    <div class="reflect-button">
      <Button on:click={async () => await push("/reflect/")}>
        Reflect
      </Button>
    </div>

    <!-- FIXME: This should have both project and session-level notes?  -->
    <SectionHeader>Project comments</SectionHeader>

    {#each project.sessions.flatMap((session) => session.notes) as note}
      <div
        class="note-meta"
        on:click={() => (showProjectTimestamps = !showProjectTimestamps)}
      >
        {#if showProjectTimestamps}
          {shortDuration(note.time)} [WRONG!]
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

  .reflect-button{
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
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

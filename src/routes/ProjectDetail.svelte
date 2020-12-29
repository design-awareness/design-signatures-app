<script lang="ts">
  import { pop, push } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { getProject } from "../data/database";
  import { removeRecentProject } from "../data/recentProjects";
  import type { Project } from "../data/schema";
  import { shortDuration } from "../util/time";

  export let params: { id: string };

  let projectPromise: Promise<Project>;
  projectPromise = getProject(params.id);

  let active = true;
  async function remove() {
    active = false;
    let project = await projectPromise;
    const toRemove = [];
    toRemove.push(removeRecentProject(project.id));
    project.notes.forEach((note) => toRemove.push(note.remove()));
    project.sessions.forEach((session) => toRemove.push(session.remove()));
    toRemove.push(project.remove());
    await Promise.all(toRemove);
    pop();
  }

  function startTracking() {
    push(`/projects/${params.id}/track/`);
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $background-color;
    min-height: 100%;
  }

  .timeline-placeholder {
    height: 8rem;
    background-color: rgba(black, 0.25);
  }

  .note-meta {
    font-size: 0.8rem;
    color: $text-secondary-color;
    font-weight: 600;
  }
</style>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    {#await projectPromise}
      loading…
    {:then project}
      <Header>{project.name || 'No project here!'}</Header>
      <p>{project.description}</p>
      <SectionHeader>Tracking overview</SectionHeader>
      <div class="timeline-placeholder" />
      <!-- <table>
        <tbody>
          <tr>
            <td>
              <ul style="list-style-type:none">
                {#each project.activitySet.activityCodes as activityCode, i}
                  <li>
                    <p style="color:#{project.activitySet.colors[i]};">
                      <b>{activityCode}</b>
                    </p>
                  </li>
                {/each}
              </ul>
            </td>
            <td><img src="images/videoholder.png" alt="notfound" /></td>
          </tr>
        </tbody>
      </table> -->

      <SectionHeader>Project comments</SectionHeader>

      <table>
        {#each project.notes as note}
          <tr>
            <td class="note-meta">
              {note.created.toLocaleDateString()}
              <br />
              {note.created.toLocaleTimeString()}
              {#if note.timed}<br /> {shortDuration(note.timestamp)}{/if}
            </td>
            <td>{note.contents}</td>
          </tr>
        {/each}
      </table>

      <button on:click={remove} disabled={!active}>delete</button>

      {#if project.active}
        <BottomActionBar
          label={project.sessions?.length ? 'Resume tracking' : 'Start tracking'}
          on:click={startTracking} />
      {/if}
    {/await}
  </ContentFrame>
</main>

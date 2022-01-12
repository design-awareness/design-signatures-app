<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { onDestroy } from "svelte";

  import { writable } from "svelte/store";

  import BackButton from "../../components/BackButton.svelte";
  import Checkbox from "../../components/Checkbox.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import CONFIG from "../../data/config";
  import {
    deleteDB,
    getAll,
    getAsyncEntry,
    getAsyncProject,
    getDesignModel,
    getProjectNote,
    getRealtimeProject,
    getRealtimeSession,
    getTimedNote,
  } from "../../data/database";
  import { colorScheme } from "../../util/colorScheme";
  import { canInstall, isInstalled } from "../../util/pwa";

  let reloadSuppressed = false;
  (async function () {
    reloadSuppressed = await CONFIG.getDevSuppressBeforeUnload();
  })();
  let alwaysShowOnboarding = false;
  (async function () {
    alwaysShowOnboarding = await CONFIG.getDevAlwaysShowOnboarding();
  })();

  export const showCanvasTimelineOnProjectPage = writable<boolean>(false);
  (async function () {
    const initialValue = await CONFIG.getDevShowCanvasTimelineOnProjectPage();
    showCanvasTimelineOnProjectPage.set(initialValue);
    onDestroy(
      showCanvasTimelineOnProjectPage.subscribe(
        CONFIG.setDevShowCanvasTimelineOnProjectPage
      )
    );
  })();

  async function deleteAll() {
    if (
      confirm("Are you absolutely sure? All database entities will be deleted.")
    ) {
      const [
        asyncEntries,
        asyncProjects,
        designModels,
        projectNotes,
        realtimeProjects,
        realtimeSessions,
        timedNotes,
      ] = await Promise.all([
        getAll("AsyncEntry"),
        getAll("AsyncProject"),
        getAll("DesignModel"),
        getAll("ProjectNote"),
        getAll("RealtimeProject"),
        getAll("RealtimeSession"),
        getAll("TimedNote"),
      ]);
      await Promise.all([
        CONFIG.setRecentProjects([]),
        Promise.all(
          asyncEntries.map(async (id) => {
            const designModel = await getAsyncEntry(id);
            if (designModel) await designModel.remove();
          })
        ),
        Promise.all(
          asyncProjects.map(async (id) => {
            const asyncProject = await getAsyncProject(id);
            if (asyncProject) await asyncProject.remove();
          })
        ),
        Promise.all(
          designModels.map(async (id) => {
            const designModel = await getDesignModel(id);
            if (designModel) await designModel.remove();
          })
        ),
        Promise.all(
          projectNotes.map(async (id) => {
            const projectNote = await getProjectNote(id);
            if (projectNote) await projectNote.remove();
          })
        ),
        Promise.all(
          realtimeProjects.map(async (id) => {
            const realtimeProject = await getRealtimeProject(id);
            if (realtimeProject) await realtimeProject.remove();
          })
        ),
        Promise.all(
          realtimeSessions.map(async (id) => {
            const realtimeSession = await getRealtimeSession(id);
            if (realtimeSession) await realtimeSession.remove();
          })
        ),
        Promise.all(
          timedNotes.map(async (id) => {
            const timedNote = await getTimedNote(id);
            if (timedNote) await timedNote.remove();
          })
        ),
      ]);
      alert("Database cleared successfully.");
      location.reload();
    }
  }

  async function deleteDb() {
    if (
      confirm("Are you absolutely sure? The entire database will be deleted.")
    ) {
      try {
        await deleteDB();
        alert("Database deleted successfully.");
      } catch (e) {
        alert("An error occurred while deleting the database.");
      }
      location.reload();
    }
  }
</script>

<ContentFrame>
  <BackButton href="/" />
  <Header>Developer Tools</Header>
  <p>
    <Link href="/dev/DBEditor">Database inspector</Link>
  </p>
  <p>
    <Link href="/dev/component-library/">Component library</Link>
  </p>

  <Header>Developer Configuration</Header>
  <p>
    Prevent reload/close while tracking:
    <button
      on:click={() => {
        reloadSuppressed = !reloadSuppressed;
        CONFIG.setDevSuppressBeforeUnload(reloadSuppressed);
      }}>{reloadSuppressed ? "suppressed" : "normal"}</button
    >
  </p>

  <p>
    <Checkbox
      bind:checked={$showCanvasTimelineOnProjectPage}
      label="Show canvas timeline on async project page"
    />
  </p>

  <p>
    Show onboarding on launch:
    <button
      on:click={() => {
        alwaysShowOnboarding = !alwaysShowOnboarding;
        CONFIG.setDevAlwaysShowOnboarding(alwaysShowOnboarding);
      }}>{alwaysShowOnboarding ? "always" : "normal"}</button
    >
  </p>

  <Header>Device Properties</Header>
  <p>Color scheme: {$colorScheme}</p>
  <p>PWA status: {$isInstalled ? "installed" : "not installed"}</p>
  <p>Has installation prompt: {$canInstall}</p>

  <Header>Danger Zone</Header>
  <p>
    Remove all entries from the database:
    <button on:click={deleteAll}>purge</button>
  </p>
  <p>
    Delete the database itself (including configuration):
    <button on:click={deleteDb}>delete</button>
  </p>
</ContentFrame>

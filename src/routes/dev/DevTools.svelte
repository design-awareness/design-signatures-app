<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import CONFIG from "../../data/config";
  import {
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

  let reloadSuppressed = false;
  (async function () {
    reloadSuppressed = await CONFIG.getDevSuppressBeforeUnload();
  })();

  async function deleteAll() {
    if (
      confirm("Are you absolutely sure? The entire database will be deleted.")
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
</script>

<ContentFrame>
  <BackButton href="/" />
  <Header>Developer tools</Header>
  <p>
    <Link href="/dev/DBEditor">Database inspector</Link>
  </p>
  <p>
    <Link href="/dev/component-library/">Component library</Link>
  </p>

  <Header>Developer configuration</Header>
  <p>
    Prevent reload/close while tracking:
    <button
      on:click={() => {
        reloadSuppressed = !reloadSuppressed;
        CONFIG.setDevSuppressBeforeUnload(reloadSuppressed);
      }}>{reloadSuppressed ? "suppressed" : "normal"}</button
    >
  </p>

  <Header>Device properties</Header>
  <p>Color scheme: {$colorScheme}</p>

  <Header>Danger zone</Header>
  <p>Purge the entire database: <button on:click={deleteAll}>purge</button></p>
</ContentFrame>

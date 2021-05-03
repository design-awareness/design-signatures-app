<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import { ACTIVITY_SET_WELL_KNOWN_PREFIX } from "../../data/activitySetPresets";
  import CONFIG from "../../data/config";
  import {
    getActivitySet,
    getAll,
    getNote,
    getProject,
    getSession,
  } from "../../data/database";
  import { colorScheme } from "../../util/colorScheme";

  let reloadSuppressed = false;
  (async function () {
    reloadSuppressed = await CONFIG.getDevSuppressBeforeUnload();
  })();

  async function resetWKAS() {
    if (confirm("Are you sure? Built-in activity sets will be recreated.")) {
      const activitySets = await getAll("ActivitySet");
      await Promise.all(
        activitySets.map(async (asid) => {
          if (asid.startsWith(ACTIVITY_SET_WELL_KNOWN_PREFIX)) {
            const as = await getActivitySet(asid);
            if (as) await as.remove();
          }
        })
      );
      alert("Reset complete.");
      location.reload();
    }
  }

  async function deleteAll() {
    if (
      confirm("Are you absolutely sure? The entire database will be deleted.")
    ) {
      const [activitySets, notes, projects, sessions] = await Promise.all([
        getAll("ActivitySet"),
        getAll("Note"),
        getAll("Project"),
        getAll("Session"),
      ]);
      await Promise.all([
        CONFIG.setRecentProjects([]),
        Promise.all(
          activitySets.map(async (asid) => {
            const activitySet = await getActivitySet(asid);
            if (activitySet) await activitySet.remove();
          })
        ),
        Promise.all(
          notes.map(async (noteid) => {
            const note = await getNote(noteid);
            if (note) await note.remove();
          })
        ),
        Promise.all(
          projects.map(async (prid) => {
            const project = await getProject(prid);
            if (project) await project.remove();
          })
        ),
        Promise.all(
          sessions.map(async (asid) => {
            const session = await getSession(asid);
            if (session) await session.remove();
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
  <p>
    Reset well known activity sets:
    <button on:click={resetWKAS}>reset</button>
  </p>
  <p>Purge the entire database: <button on:click={deleteAll}>purge</button></p>
</ContentFrame>

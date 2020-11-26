<script lang="ts">
  import EntityChooser from "../../components/dev/DBEditor/EntityChooser.svelte";
  import EntityEditor from "../../components/dev/DBEditor/EntityEditor.svelte";
  import { createTrigger } from "../../util/trigger";
  import type { DBModelName } from "../../data/schema";
  import BackButton from "../../components/BackButton.svelte";
  import {
    getActivitySet,
    getAll,
    getNote,
    getProject,
    getSession,
  } from "../../data/database";
  let type: DBModelName, id: string;

  const [setView, setViewTrigger] = createTrigger<[DBModelName, string]>();

  const deleteAll = async () => {
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
  };
</script>

<style lang="scss">
  .editor {
    max-width: 32rem;
    width: fit-content;
    margin: 2rem auto;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 20px -10px rgba(black, 0.35);
    padding: 1rem;
    margin-top: 1rem;
  }

  .purgeButton {
    display: block;
    font-size: 0.5rem;
    margin: 1rem 1rem 1rem auto;
  }
</style>

<BackButton href="/" />
<div class="editor">
  <EntityChooser
    bind:selectedType={type}
    bind:selectedId={id}
    {setViewTrigger} />
  <EntityEditor entityType={type} {id} {setView} />
</div>
<button on:click={deleteAll} class="purgeButton">purge</button>

<script lang="ts">
  import { onTrigger } from "../../../util/trigger";
  import type { ITriggerPassable, TriggerInvoker } from "../../../util/trigger";
  import { getNote, newNote } from "../../../data/database";
  import type { DBModelName, Note } from "../../../data/schema";
  import EditorField from "./EditorField.svelte";
  import EditorRefField from "./EditorRefField.svelte";

  export let setView: TriggerInvoker<[DBModelName, string]>;
  export let save: ITriggerPassable<void>;
  export let remove: ITriggerPassable<void>;
  export let id: string;

  let dbObj: Note;
  let loadedId: string = undefined;
  let loading = true;

  async function loadObj() {
    loading = true;
    if (id === null) {
      dbObj = newNote();
    } else {
      dbObj = await getNote(id);
    }
    loading = false;
  }
  $: if (id !== loadedId) loadObj();

  onTrigger(save, async () => {
    await dbObj.save();
    setView(["Note", dbObj.id]);
  });
  onTrigger(remove, async () => {
    await dbObj.remove();
    setView(["Note", null]);
  });
</script>

<style lang="scss">
  .editor {
    display: table;
  }
  p {
    font-weight: 600;
    line-height: 2;
  }
</style>

<p class="detail">{(dbObj && dbObj.id) || 'New Note'}</p>
<div class="editor">
  {#if !loading && dbObj}
    <EditorField name="contents" type="string" bind:value={dbObj.contents} />
    <EditorField name="created" type="date" bind:value={dbObj.created} />
    <EditorField name="timed" type="boolean" bind:value={dbObj.timed} />
    <EditorField name="timestamp" type="number" bind:value={dbObj.timestamp} />
    <EditorRefField
      name="session"
      type="Session"
      bind:value={dbObj.session}
      {setView} />
    <EditorRefField
      name="project"
      type="Project"
      bind:value={dbObj.project}
      {setView} />
  {/if}
</div>

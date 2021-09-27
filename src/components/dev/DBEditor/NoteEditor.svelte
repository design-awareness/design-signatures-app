<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<!-- <script lang="ts">
  import { onTrigger } from "../../../util/trigger";
  import type { ITriggerPassable, TriggerInvoker } from "../../../util/trigger";
  import { getTimedNote, newTimedNote } from "../../../data/database";
  import type { EntityName, Note } from "../../../data/schema";
  import EditorField from "./EditorField.svelte";
  import EditorRefField from "./EditorRefField.svelte";

  export let setView: TriggerInvoker<[EntityName, string | null]>;
  export let save: ITriggerPassable<void>;
  export let remove: ITriggerPassable<void>;
  export let id: string;

  let dbObj: Note;
  let loadedId: string | null = null;
  let loading = true;

  async function loadObj() {
    loading = true;
    if (id === null) {
      dbObj = newTimedNote();
    } else {
      dbObj = await getTimedNote(id);
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

<p class="detail">{(dbObj && dbObj.id) || "New Note"}</p>
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
      {setView}
    />
    <EditorRefField
      name="project"
      type="Project"
      bind:value={dbObj.project}
      {setView}
    />
  {/if}
</div>

<style lang="scss">
  .editor {
    display: table;
  }
  p {
    font-weight: 600;
    line-height: 2;
  }
</style> -->

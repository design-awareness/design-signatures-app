<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { onTrigger } from "../../../util/trigger";
  import type { ITriggerPassable, TriggerInvoker } from "../../../util/trigger";
  import {
    getRealtimeProject,
    newRealtimeProject,
  } from "../../../data/database";
  import type { EntityName, RealtimeProject } from "../../../data/schema";
  import EditorField from "./EditorField.svelte";
  import EditorRefField from "./EditorRefField.svelte";
  import EditorFieldGroup from "./EditorFieldGroup.svelte";

  export let setView: TriggerInvoker<[EntityName, string | null]>;
  export let save: ITriggerPassable<void>;
  export let remove: ITriggerPassable<void>;
  export let id: string;

  let dbObj: RealtimeProject;
  let loadedId: string | null = null;
  let loading = true;

  async function loadObj() {
    loading = true;
    if (id === null) {
      dbObj = newRealtimeProject();
    } else {
      dbObj = await getRealtimeProject(id);
    }
    loading = false;
  }
  $: if (id !== loadedId) loadObj();

  onTrigger(save, async () => {
    await dbObj.save();
    setView(["RealtimeProject", dbObj.id]);
  });
  onTrigger(remove, async () => {
    await dbObj.remove();
    setView(["RealtimeProject", null]);
  });
</script>

<p class="detail">{(dbObj && dbObj.id) || "New Project"}</p>
<div class="editor">
  {#if !loading && dbObj}
    <EditorField name="name" type="string" bind:value={dbObj.name} />
    <EditorField
      name="description"
      type="string"
      bind:value={dbObj.description}
    />
    <EditorField name="active" type="boolean" bind:value={dbObj.active} />
    <EditorField name="created" type="date" bind:value={dbObj.created} />
    <EditorField name="modified" type="date" bind:value={dbObj.modified} />
    <EditorRefField
      name="designModel"
      type="DesignModel"
      bind:value={dbObj.designModel}
      {setView}
    />
    <EditorFieldGroup
      name="notes"
      type={{ entity: "ProjectNote" }}
      bind:value={dbObj.notes}
      {setView}
    />
    <EditorFieldGroup
      name="sessions"
      type={{ entity: "RealtimeSession" }}
      bind:value={dbObj.sessions}
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
</style>

<script lang="ts">
  import { onTrigger } from "../../../util/trigger";
  import type { ITriggerPassable, TriggerInvoker } from "../../../util/trigger";
  import { getProject, newProject } from "../../../data/database";
  import type { DBModelName, Project } from "../../../data/schema";
  import EditorField from "./EditorField.svelte";
  import EditorRefField from "./EditorRefField.svelte";
  import EditorFieldGroup from "./EditorFieldGroup.svelte";

  export let setView: TriggerInvoker<[DBModelName, string | null]>;
  export let save: ITriggerPassable<void>;
  export let remove: ITriggerPassable<void>;
  export let id: string;

  let dbObj: Project;
  let loadedId: string | null = null;
  let loading = true;

  async function loadObj() {
    loading = true;
    if (id === null) {
      dbObj = newProject();
    } else {
      dbObj = await getProject(id);
    }
    loading = false;
  }
  $: if (id !== loadedId) loadObj();

  onTrigger(save, async () => {
    await dbObj.save();
    setView(["Project", dbObj.id]);
  });
  onTrigger(remove, async () => {
    await dbObj.remove();
    setView(["Project", null]);
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
    <EditorField
      name="lastModified"
      type="date"
      bind:value={dbObj.lastModified}
    />
    <EditorRefField
      name="activitySet"
      type="ActivitySet"
      bind:value={dbObj.activitySet}
      {setView}
    />
    <EditorFieldGroup
      name="notes"
      type={{ entity: "Note" }}
      bind:value={dbObj.notes}
      {setView}
    />
    <EditorFieldGroup
      name="sessions"
      type={{ entity: "Session" }}
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

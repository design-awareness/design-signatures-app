<script lang="ts">
  import { onTrigger } from "../../../util/trigger";
  import type { ITriggerPassable, TriggerInvoker } from "../../../util/trigger";
  import { getActivitySet, newActivitySet } from "../../../data/database";
  import type { ActivitySet, DBModelName } from "../../../data/schema";
  import EditorField from "./EditorField.svelte";
  import EditorFieldGroup from "./EditorFieldGroup.svelte";

  export let setView: TriggerInvoker<[DBModelName, string]>;
  export let save: ITriggerPassable<void>;
  export let remove: ITriggerPassable<void>;
  export let id: string;

  let dbObj: ActivitySet;
  let loadedId: string = undefined;
  let loading = true;

  async function loadObj() {
    loading = true;
    if (id === null) {
      dbObj = newActivitySet();
    } else {
      dbObj = await getActivitySet(id);
    }
    loading = false;
  }
  $: if (id !== loadedId) loadObj();

  onTrigger(save, async () => {
    await dbObj.save();
    setView(["ActivitySet", dbObj.id]);
  });
  onTrigger(remove, async () => {
    await dbObj.remove();
    setView(["ActivitySet", null]);
  });
</script>

<p class="detail">{(dbObj && dbObj.id) || 'New ActivitySet'}</p>
<div class="editor">
  {#if !loading && dbObj}
    <EditorField name="name" type="string" bind:value={dbObj.name} />
    <EditorField
      name="description"
      type="string"
      bind:value={dbObj.description}
    />
    <EditorFieldGroup
      name="activityNames"
      type={{ primitive: 'string' }}
      bind:value={dbObj.activityNames}
    />
    <EditorFieldGroup
      name="activityCodes"
      type={{ primitive: 'string' }}
      bind:value={dbObj.activityCodes}
    />
    <EditorFieldGroup
      name="activityDescriptions"
      type={{ primitive: 'string' }}
      bind:value={dbObj.activityDescriptions}
    />
    <EditorFieldGroup
      name="colors"
      type={{ primitive: 'string' }}
      bind:value={dbObj.colors}
      isSpecialColor={true}
    />
    <EditorField
      name="wellKnown"
      type="boolean"
      bind:value={dbObj.wellKnown}
      disabled
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

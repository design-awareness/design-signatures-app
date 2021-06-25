<!-- <script lang="ts">
  import type { EntityName } from "../../../data/schema";
  import { createTrigger } from "../../../util/trigger";
  import type { TriggerInvoker } from "../../../util/trigger";

  import ActivitySetEditor from "./ActivitySetEditor.svelte";
  import NoteEditor from "./NoteEditor.svelte";
  import ProjectEditor from "./ProjectEditor.svelte";
  import SessionEditor from "./SessionEditor.svelte";

  const [triggerSave, save] = createTrigger<MouseEvent>();
  const [triggerRemove, remove] = createTrigger<MouseEvent>();

  export let entityType: EntityName;
  export let id: string;
  export let setView: TriggerInvoker<[EntityName, string | null]>;

  const editorComponents = {
    ActivitySet: ActivitySetEditor,
    Note: NoteEditor,
    Project: ProjectEditor,
    Session: SessionEditor,
  };
</script>

<button on:click={triggerSave}>save</button>
{#if id}<button on:click={triggerRemove}>delete</button>{/if}

<svelte:component
  this={editorComponents[entityType]}
  {id}
  {setView}
  {save}
  {remove}
/> -->

<script lang="ts">
  import type { EntityName } from "../../../data/schema";
  import * as db from "../../../data/database";
  import { onTrigger } from "../../../util/trigger";
  import type { ITriggerPassable } from "../../../util/trigger";
  const typeOptions = ["ActivitySet", "Note", "Project", "Session"];

  export let selectedType: EntityName = "DesignModel";
  export let selectedId: string | null = null;
  export let setViewTrigger: ITriggerPassable<[EntityName, string | null]>;

  let loading = true;
  let idOptions: string[] = [];

  async function changeType() {
    loading = true;
    let loadingType = selectedType;
    const ids = await db.getAll(loadingType);
    if (loadingType === selectedType && loading === true) {
      if (selectedId !== null && !ids.includes(selectedId)) {
        selectedId = null;
      }
      idOptions = ids;
      loading = false;
    }
  }

  changeType();

  onTrigger(setViewTrigger, ([type, id]) => {
    selectedType = type;
    selectedId = id;
    changeType();
  });
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={selectedType} on:change={changeType}>
  {#each typeOptions as option}
    <option value={option}>{option}</option>
  {/each}
</select>
<select bind:value={selectedId}>
  {#if !loading}
    <option value={null}>{"<create new>"}</option>
    {#each idOptions as id}
      <option value={id}>{id}</option>
    {/each}
  {:else}
    <option value={null} disabled>loading…</option>
  {/if}
</select>

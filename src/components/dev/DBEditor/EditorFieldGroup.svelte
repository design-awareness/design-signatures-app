<script lang="ts">
  import type { DBModelName } from "../../../data/schema";
  import type { TriggerInvoker } from "../../../util/trigger";
  import EditorField from "./EditorField.svelte";
  import EditorRefField from "./EditorRefField.svelte";

  export let name: string;
  export let type:
    | { primitive: "boolean" | "string" | "number" | "date" }
    | { entity: DBModelName };
  export let value: readonly any[] = [];
  export let setView: TriggerInvoker<[DBModelName, string]> = () => {};

  $: if (!Array.isArray(value)) value = [];

  function getDefault() {
    if (type.hasOwnProperty("primitive")) {
      let _type = type as {
        primitive: "boolean" | "string" | "number" | "date";
      };
      if (_type.primitive === "boolean") {
        return false;
      } else if (_type.primitive === "string") {
        return "";
      } else if (_type.primitive === "number") {
        return 0;
      } else if (_type.primitive === "date") {
        return new Date();
      }
    } else {
      return null;
    }
  }

  function set(i: number) {
    return function (val: any) {
      const tarr = [...value];
      tarr[i] = val.detail;
      value = [...tarr];
    };
  }

  function addOne() {
    value = [...value, getDefault()];
  }

  function remove(i: number) {
    return function () {
      let tarr = [...value];
      tarr.splice(i, 1);
      value = [...tarr];
    };
  }
</script>

<style lang="scss">
  .field {
    display: table-row;
  }
  p {
    display: table-cell;
  }
  .group {
    display: table;
    border: 1px solid grey;
    padding: 0.25rem;
    margin-bottom: 0.25rem;
  }
</style>

<div class="field">
  <p>{name}</p>
  <div class="group">
    {#each value as entry, i}
      {#if type.hasOwnProperty('primitive')}
        <EditorField
          type={type['primitive']}
          value={entry}
          on:set={set(i)}
          on:remove={remove(i)}
          hasRemove={true}
          name={'' + i} />
      {:else}
        <EditorRefField
          type={type['entity']}
          value={entry}
          on:set={set(i)}
          on:remove={remove(i)}
          hasRemove={true}
          name={'' + i}
          {setView} />
      {/if}
    {/each}
    <button on:click={addOne}>+</button>
  </div>
</div>

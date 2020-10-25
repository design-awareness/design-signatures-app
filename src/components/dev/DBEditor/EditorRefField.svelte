<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { DBModelName } from "../../../data/schema";
  import * as db from "../../../data/database";
  import type { TriggerInvoker } from "../../../util/trigger";
  const dispatch = createEventDispatcher();

  export let name: string;
  export let type: DBModelName;
  export let value = null;
  export let hasRemove = false;
  export let setView: TriggerInvoker<[DBModelName, string]>;

  const id = Math.random().toString(36).substr(2, 8);

  $: refid = value ? value.id : "(no reference!)";
  async function validate() {
    const givenId = this.value;
    value = await db["get" + type](givenId);
    if (value === null) {
      this.value = "(no reference!)";
    }
    dispatch("set", value);
  }

  function remove() {
    dispatch("remove");
  }

  async function go() {
    if (value && value.id) {
      await validate.call({ value: value.id });
    }
    setView([type, value ? value.id : null]);
  }
</script>

<style lang="scss">
  .field {
    display: table-row;
    height: 2rem;
  }
  label,
  .label-btn-group {
    display: table-cell;
  }
</style>

<div class="field">
  {#if name}<label for={id}>{name}</label>{/if}
  <div class="label-btn-group">
    <input
      type="text"
      value={refid}
      on:blur={validate}
      on:click={function () {
        this.select();
      }} />
    {#if value && value.id}<button on:click={go}>go</button>{/if}
  </div>
  {#if hasRemove}<button on:click={remove}>-</button>{/if}
</div>

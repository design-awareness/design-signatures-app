<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { EntityName } from "../../../data/schema";
  import * as db from "../../../data/database";
  import type { TriggerInvoker } from "../../../util/trigger";
  import { randomID } from "../../../util/id";
  const dispatch = createEventDispatcher();

  export let name: string;
  export let type: EntityName;
  export let value: any = null;
  export let hasRemove = false;
  export let setView: TriggerInvoker<[EntityName, string]>;

  const id = randomID();

  $: refid = value ? value.id : "(no reference!)";
  async function validate(this: HTMLInputElement | { value: any }) {
    const givenId = this.value;
    // @ts-expect-error
    value = await db["get" + type](givenId);
    if (value === null) {
      this.value = "(no reference!)";
    }
    dispatch("set", value);
  }

  function remove() {
    dispatch("remove");
  }

  function clickInput(this: HTMLInputElement) {
    this.select();
  }

  async function go() {
    if (value && value.id) {
      await validate.call({ value: value.id });
    }
    setView([type, value ? value.id : null]);
  }
</script>

<div class="field">
  {#if name}<label for={id}>{name}</label>{/if}
  <div class="label-btn-group">
    <input type="text" value={refid} on:blur={validate} on:click={clickInput} />
    {#if value && value.id}<button on:click={go}>go</button>{/if}
  </div>
  {#if hasRemove}<button on:click={remove}>-</button>{/if}
</div>

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

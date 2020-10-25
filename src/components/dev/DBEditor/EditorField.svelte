<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let name: string;
  export let type: "boolean" | "string" | "number" | "date";
  export let value: any;
  export let hasRemove = false;

  const id = Math.random().toString(36).substr(2, 8);

  function blur() {
    dispatch("set", this.value);
  }

  function remove() {
    dispatch("remove");
  }

  function setDate() {
    value = new Date(this.value);
  }
</script>

<style lang="scss">
  .field {
    display: table-row;
    height: 2rem;
  }
  label,
  input {
    display: table-cell;
  }
</style>

<div class="field">
  {#if name}<label for={id}>{name}</label>{/if}
  {#if type === 'boolean'}
    <input type="checkbox" on:blur={blur} bind:checked={value} {id} />
  {/if}
  {#if type === 'string'}
    <input type="text" on:blur={blur} bind:value {id} />
  {/if}
  {#if type === 'number'}
    <input type="number" on:blur={blur} bind:value {id} />
  {/if}
  {#if type === 'date'}
    <input
      type="datetime-local"
      on:blur={blur}
      on:change={setDate}
      value={value ? value
            .toLocaleString('sv')
            .replace(
              ' ',
              'T'
            ) : new Date().toLocaleString('sv').replace(' ', 'T')}
      {id} />
  {/if}
  {#if hasRemove}<button on:click={remove}>-</button>{/if}
</div>

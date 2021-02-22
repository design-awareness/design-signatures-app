<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let name: string;
  export let type: "boolean" | "string" | "number" | "date";
  export let value: any;
  export let hasRemove = false;
  export let disabled = false;
  export let isSpecialColor = false;

  const id = Math.random().toString(36).substr(2, 8);

  function blur() {
    dispatch("set", this.value);
  }
  const blurS = (i) =>
    function () {
      value[i] = this.value;
      dispatch("set", value);
    };

  function remove() {
    dispatch("remove");
  }

  function setDate() {
    value = new Date(this.value);
  }
</script>

<div class="field">
  {#if name}<label for={id}>{name}</label>{/if}
  {#if type === 'boolean'}
    <input
      type="checkbox"
      on:blur={blur}
      bind:checked={value}
      {id}
      {disabled}
    />
  {/if}
  {#if type === 'string'}
    {#if isSpecialColor}
      <input
        type="text"
        on:blur={blurS(0)}
        bind:value={value[0]}
        id={id + '1'}
        {disabled}
      />
      <input
        type="text"
        on:blur={blurS(1)}
        bind:value={value[1]}
        id={id + '2'}
        {disabled}
      />
    {:else}<input type="text" on:blur={blur} bind:value {id} {disabled} />{/if}
  {/if}
  {#if type === 'number'}
    <input type="number" on:blur={blur} bind:value {id} {disabled} />
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
      {id}
      {disabled}
    />
  {/if}
  {#if hasRemove}<button on:click={remove}>-</button>{/if}
</div>

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

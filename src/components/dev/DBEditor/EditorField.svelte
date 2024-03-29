<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { randomID } from "../../../util/id";
  const dispatch = createEventDispatcher();

  export let name: string;
  export let type: "boolean" | "string" | "number" | "date";
  export let value: any;
  export let hasRemove = false;
  export let disabled = false;
  export let isSpecialColor = false;

  const id = randomID();

  function blur(this: HTMLInputElement) {
    dispatch("set", this.value);
  }
  const blurS = (i: number) =>
    function (this: HTMLInputElement) {
      value[i] = this.value;
      dispatch("set", value);
    };

  function remove() {
    dispatch("remove");
  }

  function setDate(this: HTMLInputElement) {
    value = new Date(this.value);
  }
</script>

<div class="field">
  {#if name}<label for={id}>{name}</label>{/if}
  {#if type === "boolean"}
    <input
      type="checkbox"
      on:blur={blur}
      bind:checked={value}
      {id}
      {disabled}
    />
  {/if}
  {#if type === "string"}
    {#if isSpecialColor}
      <input
        type="text"
        on:blur={blurS(0)}
        bind:value={value[0]}
        id={id + "1"}
        {disabled}
      />
      <input
        type="text"
        on:blur={blurS(1)}
        bind:value={value[1]}
        id={id + "2"}
        {disabled}
      />
    {:else}<input type="text" on:blur={blur} bind:value {id} {disabled} />{/if}
  {/if}
  {#if type === "number"}
    <input type="number" on:blur={blur} bind:value {id} {disabled} />
  {/if}
  {#if type === "date"}
    <input
      type="datetime-local"
      on:blur={blur}
      on:change={setDate}
      value={value
        ? value.toLocaleString("sv").replace(" ", "T")
        : new Date().toLocaleString("sv").replace(" ", "T")}
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

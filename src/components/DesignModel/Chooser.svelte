<script lang="ts">
  import { getDesignModel, getAll, newDesignModel } from "../../data/database";
  import add from "@iconify-icons/ic/baseline-add";

  import type { DesignModel } from "../../data/schema";
  import { sortBy } from "../../util/sort";
  import Button from "../Button.svelte";
  import InvisibleButton from "../InvisibleButton.svelte";
  import Item from "./Item.svelte";

  export let selectedDesignModel: DesignModel | null = null;
  export let label = "Design Model";
  export let createNew: (() => void) | null = null;
  export let withEmpty = false;

  let allDesignModelsPromise: Promise<DesignModel[]>;
  function refreshSets() {
    allDesignModelsPromise = getAll("DesignModel").then((ids) =>
      Promise.all(ids.map(getDesignModel))
    );
  }
  refreshSets();

  function set(newModel: DesignModel) {
    selectedDesignModel = newModel;
  }
</script>

<div class="label">
  <span>{label}</span>
  {#if createNew}
    <Button inlabel on:click={createNew} icon={add}>Create new</Button>
  {/if}
</div>
{#await allDesignModelsPromise}
  <div>Loading design models…</div>
{:then designModels}
  <ul class="container">
    {#if withEmpty}
      <li>
        <InvisibleButton on:click={() => set(newDesignModel())}>
          <Item />
        </InvisibleButton>
      </li>
    {/if}
    {#each sortBy("wellKnown", sortBy("name", designModels)) as designModel}
      <li>
        <InvisibleButton on:click={() => set(designModel)}>
          <Item {designModel} selected={designModel === selectedDesignModel} />
        </InvisibleButton>
      </li>
    {/each}
  </ul>
{/await}

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .label {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
    display: flex;
    justify-content: space-between;
  }
  .container {
    // border: $input-border-size solid $input-border-color;
    border-radius: $input-border-radius;
    background-color: none;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: none;
  }
  li {
    background-color: $input-background-color;
    padding: 0;
    border-radius: 4px;
    margin: $block-vertical-spacing 0 $block-vertical-spacing 0;
    border: $input-border-size solid $input-border-color;
  }
</style>

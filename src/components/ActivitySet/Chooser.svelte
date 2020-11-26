<script lang="ts">
  import { getActivitySet, getAll } from "../../data/database";

  import type { ActivitySet } from "../../data/schema";
  import { sortBy } from "../../util/sort";
  import Button from "../Button.svelte";
  import InvisibleButton from "../InvisibleButton.svelte";
  import Item from "./Item.svelte";

  export let activitySet: ActivitySet;

  const getAllActivitySets = () =>
    getAll("ActivitySet").then((ids) => Promise.all(ids.map(getActivitySet)));

  function set(as: ActivitySet) {
    activitySet = as;
  }
</script>

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
    border: $input-border-size solid $input-border-color;
    border-radius: $input-border-radius;
    background-color: $input-background-color;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: none;
  }
  li {
    padding: 0;
    border-bottom: $input-border-size solid $input-border-color;
    &:last-child {
      border-bottom: none;
    }
  }
</style>

<div class="label">
  <span>Activity set</span>
  <Button inlabel>Create new</Button>
</div>
{#await getAllActivitySets()}
  <div>Loading activity sets…</div>
{:then activitySets}
  <ul class="container">
    {#each sortBy('wellKnown', sortBy('name', activitySets)) as activitySetItem}
      <li>
        <InvisibleButton on:click={() => set(activitySetItem)}>
          <Item
            activitySet={activitySetItem}
            selected={activitySetItem === activitySet} />
        </InvisibleButton>
      </li>
    {/each}
  </ul>
{/await}

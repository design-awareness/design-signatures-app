<script lang="ts">
  import { newActivitySet } from "../../data/database";

  import type { ActivitySet } from "../../data/schema";
  import BackButton from "../BackButton.svelte";
  import Button from "../Button.svelte";
  import InvisibleButton from "../InvisibleButton.svelte";
  import ContentFrame from "../layout/ContentFrame.svelte";
  import Header from "../type/Header.svelte";
  import Builder from "./Builder.svelte";
  import Chooser from "./Chooser.svelte";
  import Item from "./Item.svelte";

  let startingPoint: ActivitySet = null;
  export let visible: boolean;
  export let activitySet: ActivitySet;

  function saveAndClose(finishedActivitySet: ActivitySet) {
    activitySet = finishedActivitySet;
    visible = false;
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  .device-frame {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: $background-color;
    z-index: 100;
    overflow: auto;
  }
</style>

<div class="device-frame">
  <ContentFrame>
    <BackButton button={() => (visible = false)} />
    {#if startingPoint === null}
      <Header>Create a Design Activity Set</Header>
      <Chooser
        label="Starting point"
        withEmpty
        bind:activitySet={startingPoint} />
    {:else}
      <Builder {startingPoint} bind:activitySet bind:visible />
    {/if}
  </ContentFrame>
</div>

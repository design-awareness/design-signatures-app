<script lang="ts">
  import { pop } from "svelte-spa-router/Router.svelte";
  import type { ActivitySet } from "../../data/schema";
  import BackButton from "../BackButton.svelte";
  import ContentFrame from "../layout/ContentFrame.svelte";
  import Header from "../type/Header.svelte";
  import Builder from "./Builder.svelte";
  import Chooser from "./Chooser.svelte";

  let startingPoint: ActivitySet | null = null;
  export let activitySet: ActivitySet;

  export let showModal: boolean;
</script>

<div class="device-frame">
  <ContentFrame>
    <BackButton button={() => pop()} />
    {#if startingPoint === null}
      <Header>Create a Design Activity Set</Header>
      <Chooser
        label="Starting point"
        withEmpty
        bind:activitySet={startingPoint}
      />
    {:else}
      <Builder {startingPoint} bind:activitySet {showModal} />
    {/if}
  </ContentFrame>
</div>

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

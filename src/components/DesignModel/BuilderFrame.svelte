<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { pop } from "svelte-spa-router/Router.svelte";
  import type { DesignModel } from "../../data/schema";
  import BackButton from "../BackButton.svelte";
  import ContentFrame from "../layout/ContentFrame.svelte";
  import Header from "../type/Header.svelte";
  import Builder from "./Builder.svelte";
  import Chooser from "./Chooser.svelte";

  let startingPoint: DesignModel | null = null;
  export let designModel: DesignModel;

  export let showModal: boolean;
</script>

<div class="device-frame">
  <ContentFrame>
    <BackButton button={() => pop()} />
    {#if startingPoint === null}
      <Header>Create a Design Model</Header>
      <Chooser
        label="Starting point"
        withEmpty
        bind:selectedDesignModel={startingPoint}
      />
    {:else}
      <Builder {startingPoint} bind:designModel {showModal} />
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

<script lang="ts">
  import { push } from "svelte-spa-router";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import SegmentedComponentSelector from "../components/SegmentedComponentSelector.svelte";
  import TrackingModeOption from "../components/TrackingModeOption.svelte";
  import Header from "../components/type/Header.svelte";

  let option: "realtime" | "async" | null = null;

  function go() {
    push(`/new/${option}/`);
  }
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Choose a Tracking Mode</Header>
    <SegmentedComponentSelector
      component={TrackingModeOption}
      direction="vertical"
      options={[
        ["realtime", { type: "realtime" }],
        ["async", { type: "async" }],
      ]}
      bind:value={option}
    />
    <BottomActionBar label="Next" disabled={!option} on:click={go} />
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  .page {
    background-color: $background-color;
    min-height: 100%;
  }
</style>

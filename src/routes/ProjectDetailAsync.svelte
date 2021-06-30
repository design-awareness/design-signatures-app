<script lang="ts">
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import type { AsyncProject } from "../data/schema";

  export let project: AsyncProject;
</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
      <ProjectMenu bind:project />
    </div>
    <Header>{project.name || "No project here!"}</Header>
    <p>{project.description}</p>
    <SectionHeader>Tracking overview</SectionHeader>

    <!-- FIXME: add notes  -->
    <SectionHeader>Project comments</SectionHeader>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $background-color;
    min-height: 100%;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
  }
</style>

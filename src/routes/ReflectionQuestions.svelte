<script lang="ts">
    import BackButton from "../components/BackButton.svelte";
    import ContentFrame from "../components/layout/ContentFrame.svelte";
    import Header from "../components/type/Header.svelte";
    import { CollapsibleCard } from 'svelte-collapsible'

</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
    </div>
    <Header>Reflection Questions</Header>
    <p>Once you record your design process, you can use this page as a tool to reflect on your process.</p>
  </ContentFrame>
</main>

<style>
  @import "src/styles/tokens";
  @import "src/styles/type";

</style>
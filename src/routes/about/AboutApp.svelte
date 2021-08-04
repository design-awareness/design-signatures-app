<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>What’s the Point?</Header>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }
</style>

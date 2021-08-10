<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>About this Project</Header>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }
</style>

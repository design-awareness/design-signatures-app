<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import ActivityToggle from "../../../components/ActivityToggle.svelte";
  import BackButton from "../../../components/BackButton.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import Header from "../../../components/type/Header.svelte";
  import SectionHeader from "../../../components/type/SectionHeader.svelte";

  let lightColor = "#000000";
  let darkColor = "#ffffff";
  let checked = false;
  let name = "Activity";
</script>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>ActivityToggle</Header>
  <p style="--color-light: {lightColor}; --color-dark: {darkColor}" class="clr">
    <ActivityToggle bind:checked activityName={name} />
  </p>
  <p />
  <p>light color <input type="color" bind:value={lightColor} /></p>
  <p>dark color <input type="color" bind:value={darkColor} /></p>
  <hr />
  <SectionHeader>Bindings</SectionHeader>
  <p><code>checked</code> <input type="checkbox" bind:checked /></p>
  <SectionHeader>Props</SectionHeader>
  <p><code>activityName</code> <input type="text" bind:value={name} /></p>
</ContentFrame>

<style lang="scss">
  .clr {
    --activity-color: var(--color-light);
    @media (prefers-color-scheme: dark) {
      --activity-color: var(--color-dark);
    }
  }
</style>

<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
  // FIXME: can we get typings for this?
  import { Accordion } from "svelte-collapsible";
  import AccordionItem from "../../components/AccordionItem.svelte";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Tutorials</Header>

    <Accordion>
      <AccordionItem label="Realtime tracking">
        <p>
          Realtime tracking allows you to track your process in realtime as
          you’re designing. This mode is recommended for shorter-term projects.
        </p>
      </AccordionItem>
      <AccordionItem label="Asynchronous tracking">
        <p>
          Asynchronous tracking allows you to track your process by entering the
          times you spent in each design activity after you have engaged in that
          activity (asynchronously). You can choose to enter your data either
          daily or weekly. This mode is recommended for tracking more complex,
          long-term projects.
        </p>
      </AccordionItem>
      <AccordionItem label="Creating a design model">
        <p />
      </AccordionItem>
    </Accordion>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }
</style>

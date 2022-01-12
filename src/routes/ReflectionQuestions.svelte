<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { Accordion } from "svelte-collapsible";
  import AccordionItem from "../components/AccordionItem.svelte";
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Header from "../components/type/Header.svelte";
  import { reflectionQuestions } from "../data/reflection";
</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
    </div>
    <Header>Reflection Questions</Header>
    <p>
      Once you record your design process, you can use this page as a tool to
      reflect on your process.
    </p>

    <Accordion>
      {#each reflectionQuestions as { name, questions }}
        <AccordionItem label={name}>
          <ul>
            {#each questions as question}
              <li>{question}</li>
            {/each}
          </ul>
        </AccordionItem>
      {/each}
    </Accordion>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  ul {
    padding-inline-start: 1.5rem;
  }
  li {
    margin-bottom: 0.5rem;
  }
</style>

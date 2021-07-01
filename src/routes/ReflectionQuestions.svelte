<script lang="ts">
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Header from "../components/type/Header.svelte";
  // FIXME: can we get typings for this?
  import { Accordion, AccordionItem } from "svelte-collapsible";
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
        <AccordionItem key={name}>
          <h2 slot="header" class="cat-name">
            {name}
          </h2>
          <div slot="body" class="questions">
            <ul>
              {#each questions as question}
                <li>{question}</li>
              {/each}
            </ul>
          </div>
        </AccordionItem>
      {/each}
    </Accordion>
  </ContentFrame>
</main>

<style>
  @import "src/styles/tokens";
  @import "src/styles/type";

  .cat-name {
    border-radius: 1rem 1rem 0 0;
  }
  .questions {
    border-radius: 0 0 1rem 1rem;
  }
</style>

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
          <h4 slot="header" class="cat-name">
            {name}
          </h4>
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

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  :global(.accordion-item) {
    box-shadow: $collapse-card-boxshadow;
  }
  .cat-name {
    border-radius: .5rem .5rem 0 0;
    border: $collapse-card-border-color;
    background-color: $collapse-card-background;
    margin-bottom: 0;
    padding: $collapse-padding-vertical;
    color: $collapse-category-color;
    font-weight: 600;
  }
  .questions {
    border-radius: 0 0 .5rem .5rem;
    border: $collapse-card-border-color;
    background-color: $collapse-card-background;
    padding: $collapse-padding-vertical;
    padding-top: $collapse-padding-horizontal;
    color: $collapse-secondary-text;
  }
  ul{
    margin: 0;
    padding-inline-start: $collapse-padding-vertical;
  }
  li{
    padding-top: $collapse-padding-vertical;
  }
</style>

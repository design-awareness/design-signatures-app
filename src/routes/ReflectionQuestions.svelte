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
          <h3 slot="header" class="cat-name">
            {name}
          </h3>
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

  .cat-name {
    border-radius: .5rem .5rem 0 0;
    border: $collapse-card-border-color;
    background-color: $modal-background-color;
    margin-bottom: 0;
    padding: $collapse-padding-horizontal $collapse-padding-vertical;
  }
  .questions {
    border-radius: 0 0 .5rem .5rem;
    border: $collapse-card-border-color;
    background-color: $modal-background-color;
    padding: $collapse-padding-horizontal $collapse-padding-vertical;
  }
  li{
    list-style-type: decimal;
    line-height: 2rem;
  }
</style>

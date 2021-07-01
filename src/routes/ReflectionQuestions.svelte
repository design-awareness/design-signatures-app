<script lang="ts">
    import BackButton from "../components/BackButton.svelte";
    import ContentFrame from "../components/layout/ContentFrame.svelte";
    import Header from "../components/type/Header.svelte";
    import { CollapsibleCard } from 'svelte-collapsible';
    import { reflectionQuestions } from '../data/reflection.ts';

</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
    </div>
    <Header>Reflection Questions</Header>
    <p>Once you record your design process, you can use this page as a tool to reflect on your process.</p>

    <div class="ref-qs-container">
      {#each reflectionQuestions as {name, questions}}
        <CollapsibleCard>
            <p slot='header' class="cat-name">
              {name}
            </p>
            <div slot='body' class="qeustions">
              {questions}
            </div>
        </CollapsibleCard>
      {/each}
    </div>
  </ContentFrame>
</main>

<style>
  @import "src/styles/tokens";
  @import "src/styles/type";

  .cat-name{
    border-radius: 1rem 1rem 0 0;
  }
  .qeustions{
    border-radius: 0 0 1rem 1rem;
  }
</style>
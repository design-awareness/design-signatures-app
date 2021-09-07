<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  // FIXME: can we get typings for this?
  import { Accordion } from "svelte-collapsible";
  import AccordionItem from "../../components/AccordionItem.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import ActivityList from "../../components/DesignModel/ActivityList.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Header from "../../components/type/Header.svelte";
  import { presetDesignModels } from "../../data/designModelPresets";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Design Models</Header>

    <p>
      While designing, you engage in one or multiple design activities at a
      time. These activities can vary from model to model.
    </p>
    <Accordion>
      {#each presetDesignModels as [_, { name, description, activities }]}
        {#if description}
          <AccordionItem label={name}>
            {#each Array.isArray(description.imageURL) ? description.imageURL : [description.imageURL] as url}
              <img src={url} alt="Visualization of {name}" />
            {/each}
            {#if description.citation}
              {#each description.citation.split("\n\n") as citation}
                <p class="citation">{citation}</p>
              {/each}
            {/if}

            <div class="activities">
              <ActivityList {activities} small={false} />
            </div>

            {#each description.description.split("\n\n") as paragraph}
              <p>{paragraph}</p>
            {/each}

            {#if description.moreInfoURL}
              <a class="more-info" href={description.moreInfoURL}>
                Learn more about this model
              </a>
            {/if}
          </AccordionItem>
        {/if}
      {/each}
    </Accordion>

    <p>
      There are many versions of design models.
      <a href="http://www.dubberly.com/articles/how-do-you-design.html">
        <!-- avoid awkward break of first or last word -->
        A&nbsp;Compendium of&nbsp;Models
      </a>
      by Hugh Dubberly presents an inspirational collection of over 100 descriptions
      of design and development processes, from architecture, industrial design,
      mechanical engineering, quality management, and software development.
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    min-height: 100%;
  }

  img,
  .more-info {
    display: block;
    margin: 1rem auto;
    max-width: min(24rem, 100%);
  }

  .citation {
    @include type-style($type-detail);
    color: $text-secondary-color;
  }

  .activities {
    width: fit-content;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>

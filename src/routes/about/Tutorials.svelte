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
  import TutorialPanel, {
    tutorialPlaceholderMedia,
  } from "./TutorialPanel.svelte";
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
        <TutorialPanel
          tutorial={[
            [
              tutorialPlaceholderMedia,
              "Create a new project and select realtime tracking",
            ],
            [
              tutorialPlaceholderMedia,
              "Enter project details and select a design model",
            ],
            [
              tutorialPlaceholderMedia,
              "Start tracking and toggle the activities switches as you engage in them",
            ],
            [
              tutorialPlaceholderMedia,
              "When you're finished, stop tracking and see your design process represented as a timeline",
            ],
          ]}
        />
      </AccordionItem>
      <AccordionItem label="Asynchronous tracking">
        <p>
          Asynchronous tracking allows you to track your process by entering the
          times you spent in each design activity after you have engaged in that
          activity (asynchronously). You can choose to enter your data either
          daily or weekly. This mode is recommended for tracking more complex,
          long-term projects.
        </p>

        <TutorialPanel
          tutorial={[
            [
              tutorialPlaceholderMedia,
              "Create a new project and select asynchronous tracking",
            ],
            [
              tutorialPlaceholderMedia,
              "Enter project details, select a design model, and choose your logging frequency",
            ],
            [
              tutorialPlaceholderMedia,
              "Select a day or week to enter your time spent for each design activity",
            ],
            [
              tutorialPlaceholderMedia,
              "Save your entry and see your design process represented as a bubble timeline",
            ],
          ]}
        />
      </AccordionItem>
      <AccordionItem label="Creating a design model">
        <TutorialPanel
          tutorial={[
            [
              tutorialPlaceholderMedia,
              "While creating a new project, select ‘New model’",
            ],
            [
              tutorialPlaceholderMedia,
              "Start a new model from scratch or choose an existing model to build from",
            ],
            [
              tutorialPlaceholderMedia,
              "Choose a title for your model and enter names and colors for each activity of your model",
            ],
            [tutorialPlaceholderMedia, "Save and use!"],
          ]}
        />
      </AccordionItem>
    </Accordion>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }
</style>

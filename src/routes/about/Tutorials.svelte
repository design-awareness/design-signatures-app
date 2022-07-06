<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
  import { Accordion } from "svelte-collapsible";
  import AccordionItem from "../../components/AccordionItem.svelte";
  import TutorialPanel from "./TutorialPanel.svelte";
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
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/realtime/1.png",
              },
              "Create a new project and select realtime tracking",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/realtime/2.png",
              },
              "Enter project details and select a design model",
            ],
            [
              {
                type: "video",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/realtime/3.mp4",
              },
              "Start tracking and toggle the activities switches as you engage in them",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/realtime/4.png",
              },
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
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/async/1.png",
              },
              "Create a new project and select asynchronous tracking",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/async/2.png",
              },
              "Enter project details, select a design model, and choose your logging frequency",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/async/3.png",
              },
              "Select a day or week to enter your time spent for each design activity",
            ],
            [
              {
                type: "video",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/async/4.mp4",
              },
              "Enter the time spent on each activity",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/async/5.png",
              },
              "See your design process represented as a bubble timeline",
            ],
          ]}
        />
      </AccordionItem>
      <AccordionItem label="Creating a design model">
        <TutorialPanel
          tutorial={[
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/design-model/1.png",
              },
              "While creating a new project, select ‘New model’",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/design-model/2.png",
              },
              "Start a new model from scratch or choose an existing model to build from",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/design-model/3.png",
              },
              "Choose a title for your model and enter names and colors for each activity of your model",
            ],
            [
              {
                type: "image",
                url: "https://cdn.design-awareness.com/app-assets/tutorials/design-model/4.png",
              },
              "Save and use!",
            ],
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

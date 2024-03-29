<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import reflectIcon from "../../assets/reflectIcon";
  import BackButton from "../../components/BackButton.svelte";
  import Figure from "../../components/Figure.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import SectionHeader from "../../components/type/SectionHeader.svelte";
  import dotTimeline from "../../util/dotTimeline";
  import timeline from "../../util/timeline";
  import {
    signatureA,
    signatureB,
    signatureC,
    signatureD,
  } from "./exampleProjects";
  let fakeproject: any = null;
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>What’s the point?</Header>

    <p>
      We all have different personal signatures. We write our signatures in
      different ways day by day, and our signatures evolve over our lifetime.
      The same is true for the way we navigate through the design process in our
      various design projects.
    </p>
    <p>
      This app helps you create a “design signature” for your design projects.
      <strong>
        A design signature is a tracing of how you spend time across design
        activities as you engage in a design project.
      </strong>
      Our design signatures vary across different types of design projects, with
      different goals, constraints, deliverables, etc.
    </p>

    <Figure
      path="app/logo-secondary.svg"
      alt="simplified design timeline turning into a scribble with a pencil "
    />

    <p>
      With this app, you can input the design activities you engage in to
      document your process for your design projects. You can do this either in
      “realtime'' (as you engage in design), or “asynchronously” (by entering
      the data on how you spent your time at the end of the day). The app then
      displays how you allocated your time across the design activities in a
      timeline plot, or “design signature,” for that project. Here are some
      example signatures:
    </p>

    <SectionHeader>Example “Realtime” timelines</SectionHeader>

    <p>
      {#await signatureA() then signature}
        <canvas
          use:timeline={{
            project: signature,
            showNotes: false,
            showTime: false,
          }}
        />
      {/await}
      Signature A - Ideal project envelope pattern
    </p>

    <p>
      {#await signatureB() then signature}
        <canvas
          use:timeline={{
            project: signature,
            showNotes: false,
            showTime: false,
          }}
        />
      {/await}
      Signature B - Ideal project envelope pattern with variation and emphasis on
      modeling
    </p>

    <SectionHeader>Example “Asynchronous” bubble timelines</SectionHeader>
    <p>
      {#await signatureC() then signature}
        <div class="timeline-container">
          <canvas
            use:dotTimeline={{
              project: signature,
              showNotes: false,
              showDates: false,
              hideEmptyDays: true,
            }}
          />
        </div>
      {/await}
      Signature C - Ideal project envelope pattern
    </p>
    <p>
      {#await signatureD() then signature}
        <div class="timeline-container">
          <canvas
            use:dotTimeline={{
              project: signature,
              showNotes: false,
              showDates: false,
              hideEmptyDays: true,
            }}
          />
        </div>
      {/await}
      Signature D - Ideal project envelope pattern with variation
    </p>
    <p>
      You can compare the signatures that you create across your projects to
      better understand yourself as a designer. On the
      <Link href="/about/research">Explore Design Process Research</Link>
      page, we present results from research on the design process, including findings
      from how expert designers allocate their time across activities. Here you can
      find inspiration to compare your design signatures to expert design signatures.
      Signatures A and C above demonstrate signatures with an “ideal project envelope”,
      an effective design process pattern. Signatures B and D demonstrate variations
      on ideal project envelope patterns. On the
      <Link href="/reflect">Reflect <Icon icon={reflectIcon} inline /></Link>
      page, we present a list of reflection questions that can help you think more
      deeply about important aspects of your design process.
    </p>

    <p>
      Over time, the aspiration of this app is for you to develop “design
      awareness” about your personal design process. Enacting design awareness
      when you engage in design means that you…
    </p>

    <ol>
      <li>understand the design process in general</li>
      <li>
        stay aware of where you are in the process when you engage in a design
        project
      </li>
      <li>make informed choices for your next steps</li>
      <li>enact those choices</li>
      <li>continue the cycle</li>
    </ol>

    <p>
      We hope that you enjoy how this app helps you to think deeply about
      yourself as a designer.
    </p>

    <p>
      For more information about this work, visit
      <a href="https://design-awareness.com/">
        https://design-awareness.com/
      </a>
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }

  .timeline-container {
    max-width: 100%;
    overflow: auto;
  }
</style>

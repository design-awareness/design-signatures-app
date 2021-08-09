<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import loadingIcon from "@iconify-icons/ic/baseline-hourglass-empty";
  import notFoundIcon from "@iconify-icons/ic/baseline-search-off";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Link from "../components/Link.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import SelectField from "../components/SelectField.svelte";
  import SplashScreen from "../components/SplashScreen.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { getProjectOrFail, getRealtimeProject } from "../data/database";
  import type { AsyncProject, RealtimeProject } from "../data/schema";
  import download from "../util/download";

  export let params: { id: string };

  let projectPromise = getProjectOrFail(params.id);

  let project: RealtimeProject | AsyncProject;
  projectPromise.then(([_, p]) => (project = p));

  let exportType = "data";

  // FIXME: add support for exporting project visualizations

  // let imageSize = 500;

  // let timelineRef: HTMLElement;
  // function setTimeline(ref: HTMLElement) {
  //   timelineRef = ref;
  // }

  async function doExport() {
    /*if (exportType === "image") {
      download(
        "export.svg",
        "image/svg+xml",
        timelineRef
          .querySelector(".timeline-scrollable svg")
          ?.outerHTML?.replace(
            "</svg>",
            "<" +
              "style>svg{background-color:white;}.grid-line{fill:#bdbdbd;}text{font:500 0.8rem sans-serif;}</style></svg>"
          )
          .toString() as string
      );
    } else if (exportType === "data") {*/
    if (!project) await projectPromise;
    download(
      `${safeName(project.name)}.json`,
      "application/json",
      project.serialize()
    );
    //}
  }

  function safeName(name: string) {
    return name.trim().replace(/[\W\:\/\\]+/g, "-");
  }
</script>

{#await projectPromise}
  <SplashScreen icon={loadingIcon} label="Loading project…" delay={100} />
{:then [_, project]}
  <main class="device-frame page">
    <ContentFrame>
      <BackButton href="/" />
      {#await projectPromise}
        <p>loading…</p>
      {:then _}
        <Header>Export {project.name}</Header>
        <SelectField
          label="Type"
          bind:value={exportType}
          options={[
            // ["image", "Timeline image (SVG)"],
            ["data", "Project data (JSON)"],
          ]}
        />
        <!-- {#if exportType === "image"}
        <SelectField
          label="Size"
          bind:value={imageSize}
          options={[
            [200, "Super short"],
            [350, "Short"],
            [500, "Normal"],
            [750, "Long"],
            [1000, "Super long"],
          ]}
        />
        <SectionHeader>Preview</SectionHeader>
        <div use:setTimeline>
          <RichTimeline {project} width={imageSize} fixedCodes={false} />
        </div> -->
        <!-- {:else if exportType === "data"} -->
        <p>
          <a href="https://data.design-awareness.com/" target="_blank"
            >Learn more about the design awareness data export format</a
          >
        </p>
        <!-- {/if} -->
        <BottomActionBar label="Export" on:click={doExport} />
      {/await}
    </ContentFrame>
  </main>
{:catch}
  <SplashScreen icon={notFoundIcon} label="Project not found.">
    <Link href="/">Go home</Link>
    <Link href="/projects/">All projects</Link>
  </SplashScreen>
{/await}

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
</style>

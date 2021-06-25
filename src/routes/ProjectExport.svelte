<script lang="ts">
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import SelectField from "../components/SelectField.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { getRealtimeProject } from "../data/database";
  import type { RealtimeProject } from "../data/schema";
  import download from "../util/download";

  export let params: { id: string };

  // FIXME: handle exporting both project types
  let projectPromise: Promise<RealtimeProject>;
  projectPromise = getRealtimeProject(params.id);

  let project: RealtimeProject;
  projectPromise.then((p) => (project = p));

  let exportType = "image";

  let imageSize = 500;

  let timelineRef: HTMLElement;
  function setTimeline(ref: HTMLElement) {
    timelineRef = ref;
  }

  async function doExport() {
    if (exportType === "image") {
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
    } else if (exportType === "data") {
      if (!project) await projectPromise;
      download(
        // FIXME: use filename based on project name
        "export.json",
        "application/json",
        project.serialize()
      );
    }
  }
</script>

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
          ["image", "Timeline image (SVG)"],
          ["data", "Session data (JSON)"],
        ]}
      />
      {#if exportType === "image"}
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
        </div>
      {:else if exportType === "data"}
        <p>
          <a href="https://data.design-awareness.com/" target="_blank"
            >Learn more about the design awareness data export format</a
          >
        </p>
      {/if}
      <BottomActionBar label="Export" on:click={doExport} />
    {/await}
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
</style>

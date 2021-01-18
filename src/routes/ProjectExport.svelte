<script lang="ts">
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import SelectField from "../components/SelectField.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { getProject } from "../data/database";
  import type { Project } from "../data/schema";
  import download from "../util/download";

  export let params: { id: string };

  let projectPromise: Promise<Project>;
  projectPromise = getProject(params.id);

  let project: Project;
  projectPromise.then((p) => (project = p));

  let exportType = "image";

  let imageSize = 500;

  let appendSessions = 0;
  let dataFormat = 0;
  let timestampFormat = 0;

  $: if (appendSessions === 2 && timestampFormat === 0) {
    timestampFormat = 1;
  }

  let summary = "";
  $: if (exportType === "data") {
    summary = "Your data will have the shape:\n  ";
    if (appendSessions === 0) {
      summary += "SessionData[]";
    } else if (appendSessions === 1) {
      summary += `{
    data: SessionData,
    duration: number,
    startTime: string (ISO date)
  }[]`;
    } else if (appendSessions === 2) {
      summary += "SessionData";
    }
    summary += "\nwhere SessionData has the shape:\n  ";
    // [0, 'Raw (on/off pairs by activity)'], [1, 'Raw event timeline'], [2, 'State timeline (Boolean array)'], [3, 'State timeline (Boolean array with durations)'], [4, 'State timeline (Active activity list)'], [5, 'State timeline (Active activity list with durations)']
    if (dataFormat === 0) {
      summary += "[onTime: Timestamp, offTime: Timestamp][][]";
    } else if (dataFormat === 1) {
      summary += "[activity: number, time: Timestamp, onOrOff: boolean][]";
    } else if (dataFormat === 2) {
      summary += "[time: Timestamp, state: boolean[]][]";
    } else if (dataFormat === 3) {
      summary += `[
    [time: Timestamp, duration: number],
    state: boolean[]
  ][]`;
    } else if (dataFormat === 4) {
      summary += `[
    time: Timestamp,
    activeActivityIndexes: number[]
  ][]`;
    } else if (dataFormat === 5) {
      summary += `[
    [time: Timestamp, duration: number],
    activeActivityIndexes: number[]
  ][]`;
    }
    // [0, 'Session time (ms)'], [1, 'Project time (ms)'], [2, 'Absolute (ISO string)'], [3, 'Absolute (Unix ms)']
    summary += "\nwhere Timestamp is:\n  ";

    if (timestampFormat === 0) {
      summary += "number (session time, in ms)";
    } else if (timestampFormat === 1) {
      summary += "number (project time, in ms)";
    } else if (timestampFormat === 2) {
      summary += "string (ISO timestamp)";
    } else if (timestampFormat === 3) {
      summary += "number (ms since Unix epoch)";
    }
  }

  function transformTime(
    format: number,
    sessionEventTimestamp: number,
    sessionStartAbsolute: Date,
    projectPriorDuration: number
  ): number | string {
    if (format === 0) {
      return sessionEventTimestamp;
    } else if (format === 1) {
      return projectPriorDuration + sessionEventTimestamp;
    } else if (format === 2) {
      return new Date(
        sessionStartAbsolute.getTime() + sessionEventTimestamp
      ).toISOString();
    } else if (format === 3) {
      return sessionStartAbsolute.getTime() + sessionEventTimestamp;
    }
  }

  let timelineRef: HTMLElement;
  function setTimeline(ref: HTMLElement) {
    timelineRef = ref;
  }

  function doExport() {
    if (exportType === "image") {
      download(
        "export.svg",
        "image/svg+xml",
        timelineRef
          .querySelector(".timeline-scrollable svg")
          .outerHTML.replace(
            "</svg>",
            "<" +
              "style>svg{background-color:white;}.grid-line{fill:#bdbdbd;}text{font:500 0.8rem sans-serif;}</style></svg>"
          )
      );
    } else if (exportType === "data") {
    }
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  pre {
    white-space: pre-wrap;
  }
</style>

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
        options={[['image', 'Timeline image (SVG)'], ['data', 'Session data (JSON)']]} />
      {#if exportType === 'image'}
        <SelectField
          label="Size"
          bind:value={imageSize}
          options={[[200, 'Super short'], [350, 'Short'], [500, 'Normal'], [750, 'Long'], [1000, 'Super long']]} />
        <SectionHeader>Preview</SectionHeader>
        <div use:setTimeline>
          <RichTimeline {project} width={imageSize} fixedCodes={false} />
        </div>
      {:else if exportType === 'data'}
        <p>JSON export is coming soon!</p>
        <SelectField
          label="Session handling"
          bind:value={appendSessions}
          options={[[0, 'Separate (data only)'], [1, 'Separate (annotated)'], [2, 'Append']]} />
        <SelectField
          label="Format"
          bind:value={dataFormat}
          options={[[0, 'Raw (on/off pairs by activity)'], [1, 'Raw event timeline'], [2, 'State timeline (Boolean array)'], [3, 'State timeline (Boolean array with durations)'], [4, 'State timeline (Active activity list)'], [5, 'State timeline (Active activity list with durations)']]} />
        <SelectField
          label="Timestamps"
          bind:value={timestampFormat}
          options={appendSessions === 2 ? [[1, 'Project time (ms)'], [2, 'Absolute (ISO string)'], [3, 'Absolute (Unix ms)']] : [[0, 'Session time (ms)'], [1, 'Project time (ms)'], [2, 'Absolute (ISO string)'], [3, 'Absolute (Unix ms)']]} />
        <SectionHeader>Summary</SectionHeader>
        <pre>{summary}</pre>
      {/if}
      <BottomActionBar label="Export" on:click={doExport} />
    {/await}
  </ContentFrame>
</main>

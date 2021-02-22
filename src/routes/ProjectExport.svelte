<script lang="ts">
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import SelectField from "../components/SelectField.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { getProject } from "../data/database";
  import {
    toActiveActivitiesTimeline,
    toEventTimeline,
    toStateTimeline,
  } from "../data/dataTransformers";
  import type { Project, Session } from "../data/schema";
  import download from "../util/download";

  export let params: { id: string };

  let projectPromise: Promise<Project>;
  projectPromise = getProject(params.id);

  let project: Project;
  projectPromise.then((p) => (project = p));

  let exportType = "image";

  let imageSize = 500;

  let combineSessions = false;
  let annotateSessions = false;
  let projectTime = false;
  $: if (combineSessions) {
    annotateSessions = false;
    projectTime = true;
  }
  let dataFormat = 0;
  let asFormat = 0;

  /**
   * export full data
   */
  function createFullDataExport(): object {
    const sessionData = exportData();
    if (asFormat === 0) {
      return sessionData;
    } else {
      return {
        data: sessionData,
        activitySet: asExport(),
      };
    }
  }

  /**
   * export session data
   */
  function exportData(): object {
    if (combineSessions) {
      // TODO: combine sessions output
      return { error: "Combined sessions not available yet!" };
    } else {
      let data = [];
      let elapsedTime = 0;
      project.sessions.forEach((session) => {
        let sessionData = exportSession(session, elapsedTime);
        if (annotateSessions) {
          data.push({
            duration: session.duration,
            startTime: session.startTime.toISOString(),
            data: sessionData,
          });
        } else {
          data.push(sessionData);
        }
        elapsedTime += session.duration;
      });
      return data;
    }
  }

  function exportSession(session: Session, prevTime: number): readonly any[] {
    if (dataFormat === 0) {
      return session.data;
    } else if (dataFormat === 1) {
      return toEventTimeline(session.data, projectTime ? prevTime : 0);
    } else if (dataFormat === 2) {
      return toStateTimeline(session.data, 0, projectTime ? prevTime : 0);
    } else if (dataFormat === 3) {
      const stateTimeline = toStateTimeline(
        session.data,
        0,
        projectTime ? prevTime : 0
      );
      return toActiveActivitiesTimeline(stateTimeline);
    }
  }

  function asExport(): object {
    let as = project.activitySet;
    if (asFormat === 1) {
      // group by activity;
      let activities = [];
      as.activityCodes.forEach((code, i) => {
        activities.push({
          code,
          name: as.activityNames[i],
          description: as.activityDescriptions[i],
          color: as.colors[i],
        });
      });
      return {
        name: as.name,
        activities,
      };
    } else {
      return {
        name: as.name,
        activityCodes: as.activityCodes,
        activityNames: as.activityNames,
        activityDescriptions: as.activityDescriptions,
        colors: as.colors,
      };
    }
  }

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
          .outerHTML.replace(
            "</svg>",
            "<" +
              "style>svg{background-color:white;}.grid-line{fill:#bdbdbd;}text{font:500 0.8rem sans-serif;}</style></svg>"
          )
      );
    } else if (exportType === "data") {
      if (!project) await projectPromise;
      download(
        "export.json",
        "application/json",
        JSON.stringify(createFullDataExport())
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
        options={[['image', 'Timeline image (SVG)'], ['data', 'Session data (JSON)']]}
      />
      {#if exportType === 'image'}
        <SelectField
          label="Size"
          bind:value={imageSize}
          options={[[200, 'Super short'], [350, 'Short'], [500, 'Normal'], [750, 'Long'], [1000, 'Super long']]}
        />
        <SectionHeader>Preview</SectionHeader>
        <div use:setTimeline>
          <RichTimeline {project} width={imageSize} fixedCodes={false} />
        </div>
      {:else if exportType === 'data'}
        <SectionHeader>Sessions</SectionHeader>
        <label><input
            type="checkbox"
            bind:checked={combineSessions}
            disabled
          />Combine sessions</label>
        <label><input
            type="checkbox"
            bind:checked={annotateSessions}
            disabled={combineSessions}
          />Include session metadata</label>
        <SectionHeader>Timestamps</SectionHeader>
        <label><input
            type="checkbox"
            bind:checked={projectTime}
            disabled={combineSessions}
          />Use project time</label>
        <SelectField
          label="Format"
          bind:value={dataFormat}
          options={[[0, 'Raw on/off pairs'], [1, 'Raw event timeline'], [2, 'State timeline (all)'], [3, 'State timeline (active IDs)']]}
        />
        <SelectField
          label="Activity set"
          bind:value={asFormat}
          options={[[0, "Don't export Activity Set"], [1, 'Group by activity'], [2, 'Group by field']]}
        />
        <!--<SelectField
          label="Format"
          bind:value={dataFormat}
          options={[[0, 'Raw (on/off pairs by activity)'], [1, 'Raw event timeline'], [2, 'State timeline (Boolean array)'], [3, 'State timeline (Boolean array with durations)'], [4, 'State timeline (Active activity list)'], [5, 'State timeline (Active activity list with durations)']]}
        />
        <SelectField
          label="Timestamps"
          bind:value={timestampFormat}
          options={appendSessions === 2 ? [[1, 'Project time (ms)'], [2, 'Absolute (ISO string)'], [3, 'Absolute (Unix ms)']] : [[0, 'Session time (ms)'], [1, 'Project time (ms)'], [2, 'Absolute (ISO string)'], [3, 'Absolute (Unix ms)']]}
        /> -->
      {/if}
      <BottomActionBar label="Export" on:click={doExport} />
    {/await}
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  label {
    display: block;
  }
</style>

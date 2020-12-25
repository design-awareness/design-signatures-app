<script lang="ts">
  import { onDestroy, beforeUpdate, afterUpdate } from "svelte";
  import Button from "../components/Button.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Link from "../components/Link.svelte";
  import Modal from "../components/Modal.svelte";
  import TrackingTimer from "../components/TrackingTimer.svelte";
  import {
    getEntityOrFail,
    getProject,
    newNote,
    newSession,
  } from "../data/database";
  import { goUpSafe } from "../util/history";
  import useInterval from "../util/interval";
  import createIcon from "@iconify-icons/ic/baseline-create";
  import { pop, push } from "svelte-spa-router/Router.svelte";
  import Header from "../components/type/Header.svelte";
  import InputField from "../components/InputField.svelte";
  import DetailText from "../components/type/DetailText.svelte";
  import ButtonGroup from "../components/ButtonGroup.svelte";
  import { shortDuration } from "../util/time";
  import ActivitySlat from "../components/ActivitySlat.svelte";

  export let params: { id: string; wild: string };

  const TICK_INTERVAL = 250;

  const session = newSession();

  let projectTime = 0; // 12:41, for testing - get from project!

  let hasProject = false;
  let thenProject = getProject(params.id);
  thenProject.then((project) => {
    if (!project) return;
    hasProject = true;
    session.startTime = new Date();
    session.project = project;
    session.data = project.activitySet.activityNames.map((_) => []);
    projectTime = project.sessions
      .map((session) => session.duration)
      .reduce((a, b) => a + b, 0);
    project.sessions = [...project.sessions, session];
  });

  let activeSubsession = false;
  let pastSessionTime = 0;
  let thisSubsessionStart = 0;
  let subsessionTime = 0;

  function startTracking() {
    activeSubsession = true;
    thisSubsessionStart = Date.now();
    subsessionTime = 0;
  }

  function tick() {
    let tickTime = Date.now();
    subsessionTime = tickTime - thisSubsessionStart;
  }

  function stopTracking() {
    if (activeSubsession) {
      tick();
      pastSessionTime += subsessionTime;
      subsessionTime = 0;
      activeSubsession = false;
    }
  }

  const [enableInterval, destroyInterval] = useInterval(
    { start: startTracking, tick, stop: stopTracking },
    TICK_INTERVAL
  );

  // tracking is enabled when no modal is open
  $: enableInterval(hasProject && !params.wild);

  // bind this to a Modal's `visible` to enable closing it via tap on scrim
  // an inner Link[up] or closeModal() will also work!
  let bindModalOpen = true;
  let goingUp = false;

  async function closeModal() {
    goingUp = true;
    await goUpSafe(`/projects/${params.id}/track/`);
    bindModalOpen = true;
    goingUp = false;
  }

  const openModal = (modalName) => () => {
    push(`/projects/${params.id}/track/${modalName}`);
  };

  $: if (params.wild && !bindModalOpen && !goingUp) closeModal();

  onDestroy(async () => {
    destroyInterval();
    session.duration = pastSessionTime;
    let project = await thenProject;
    if (!project) return;
    project.lastModified = new Date();
    project.save();
  });

  function beforeUnload(evt: BeforeUnloadEvent) {
    if (localStorage["dev__suppressBeforeUnload"] !== "1") {
      evt.preventDefault();
      evt.returnValue = "You are currently tracking a project!";
      return "You are currently tracking a project!";
    }
  }

  async function stopTrackingButton() {
    if (params.wild) {
      await pop();
    }
    goUpSafe(`/projects/${params.id}/`);
  }

  /////// ADD NOTES
  let noteText = "";
  let noteSaving = false;
  async function saveNote() {
    noteSaving = true;
    const project = await thenProject;
    const note = newNote();
    note.contents = noteText;
    note.project = project;
    note.timed = true;
    note.timestamp = projectTime + pastSessionTime;
    project.notes = [...project.notes, note];
    await project.save();
    await closeModal();
    noteText = "";
    noteSaving = false;
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .device-frame {
    height: 100%;
    background-color: $tracking-background-color;
    display: flex;
    > :global(div) {
      flex: 1;
    }
  }

  .top-bar {
    display: flex;
    align-items: center;
    .flex-spacer {
      flex-grow: 1;
    }
  }

  .tracking-frame {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .tracking-summary-placeholder {
    height: 6rem;
    margin-top: $block-vertical-spacing;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.14);
  }

  .flexible-toggle-area {
    $negative-margin-pad: -1rem;
    margin: calc(#{$block-vertical-spacing} + #{$negative-margin-pad})
      $negative-margin-pad $negative-margin-pad $negative-margin-pad;
    padding: -$negative-margin-pad;
    flex: 1;
    overflow-x: visible;
    overflow-y: auto;
  }
</style>

<svelte:window on:beforeunload={beforeUnload} />
<main class="device-frame page">
  <ContentFrame>
    {#await getEntityOrFail(thenProject)}
      Project loading…
    {:then project}
      <div class="tracking-frame">
        <div class="top-bar">
          <TrackingTimer
            sessionTime={subsessionTime + pastSessionTime}
            {projectTime} />
          <div class="flex-spacer" />
          <Button small icon={createIcon} on:click={openModal('note')}>
            Add note
          </Button>
        </div>

        <div class="flexible-toggle-area">
          {#each project.activitySet.activityCodes as activityCode, i (i)}
            <ActivitySlat
              {activityCode}
              activityName={project.activitySet.activityNames[i]}
              activityColor={project.activitySet.colors[i]}
              activityDescription={project.activitySet.activityDescriptions[i]}
              index={i}
              time={subsessionTime + pastSessionTime}
              bind:sessionData={session.data} />
          {/each}
        </div>

        <div class="tracking-summary-placeholder" />

        <ButtonGroup fill>
          <Button on:click={openModal('paused')}>Pause</Button>
          <Button on:click={openModal('stop')}>Stop</Button>
        </ButtonGroup>
      </div>

      {#if params.wild === 'note'}
        <Modal maxWidth bind:visible={bindModalOpen} closeWithScrim={false}>
          <DetailText>Tracking is paused while adding a note.</DetailText>
          <InputField
            large
            xlarge
            bind:value={noteText}
            label="Note at {shortDuration(pastSessionTime + projectTime)}" />
          <ButtonGroup>
            <Button small on:click={closeModal} disabled={noteSaving}>
              Cancel
            </Button>
            <Button
              small
              on:click={saveNote}
              disabled={noteSaving || !noteText}>
              Save
            </Button>
          </ButtonGroup>
        </Modal>
      {:else if params.wild === 'paused'}
        <Modal bind:visible={bindModalOpen}>
          <DetailText>Tracking is paused.</DetailText>
          <ButtonGroup>
            <Button small on:click={closeModal}>Resume</Button>
          </ButtonGroup>
        </Modal>
      {:else if params.wild === 'stop'}
        <Modal bind:visible={bindModalOpen} title="Stop tracking?">
          <p>You can always resume tracking later.</p>

          <ButtonGroup>
            <Button small on:click={closeModal}>Cancel</Button>
            <Button small on:click={stopTrackingButton}>Stop tracking</Button>
          </ButtonGroup>
        </Modal>
      {/if}
    {:catch}
      This project does not exist.
      <Link href="/" up>Go home</Link>
    {/await}
  </ContentFrame>
</main>
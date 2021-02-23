<script lang="ts">
  import { pop, push } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PopupMenu from "../components/PopupMenu.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { getProject } from "../data/database";
  import {
    pushRecentProject,
    removeRecentProject,
  } from "../data/recentProjects";
  import type { Project } from "../data/schema";
  import { shortDuration } from "../util/time";

  import editIcon from "@iconify-icons/ic/baseline-edit";
  import compareIcon from "@iconify-icons/ic/baseline-compare-arrows";
  import archiveIcon from "@iconify-icons/ic/baseline-archive";
  import unarchiveIcon from "@iconify-icons/ic/baseline-unarchive";
  import exportIcon from "@iconify-icons/ic/baseline-share";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
  import Modal from "../components/Modal.svelte";
  import InputField from "../components/InputField.svelte";

  export let params: { id: string };

  let projectPromise: Promise<Project>;
  projectPromise = getProject(params.id);

  let project: Project;
  projectPromise.then((p) => (project = p));

  let active = true;
  async function remove() {
    active = false;
    let project = await projectPromise;
    const toRemove = [];
    toRemove.push(removeRecentProject(project.id));
    project.notes.forEach((note) => toRemove.push(note.remove()));
    project.sessions.forEach((session) => toRemove.push(session.remove()));
    toRemove.push(project.remove());
    await Promise.all(toRemove);
    pop();
  }

  function startTracking() {
    push(`/projects/${params.id}/track/`);
  }

  let showProjectTimestamps = false;

  let editProjectOpen = false;
  let toggleProjectCompleteOpen = false;
  let otherOpen = false;
  let deleteProjectOpen = false;

  const menuDescriptor = () => [
    { label: "Edit", icon: editIcon, action: () => (editProjectOpen = true) },
    { label: "Compare", icon: compareIcon, action: () => (otherOpen = true) },
    {
      label: "Export",
      icon: exportIcon,
      action: () => push(`/projects/${params.id}/export`),
    },
    { separator: true, label: null, action: null },
    {
      label: project.active ? "Archive" : "Unarchive",
      icon: project.active ? archiveIcon : unarchiveIcon,
      action: () => (toggleProjectCompleteOpen = true),
    },
    {
      label: "Delete",
      icon: deleteIcon,
      class: "danger",
      action: () => (deleteProjectOpen = true),
    },
  ];

  let editName: string;
  let editDescription: string;
  projectPromise.then(() => {
    editName = project.name;
    editDescription = project.description;
  });
  function saveInfo() {
    editName = editName.trim();
    if (!editName) editName = project.name;
    project.name = editName;
    project.description = editDescription;
    editProjectOpen = false;
    project.save();
  }

  async function toggleProjectComplete() {
    toggleProjectCompleteOpen = false;
    if (project.active) {
      project.active = false;
      removeRecentProject(project.id);
      project.save();
    } else {
      project.active = true;
      pushRecentProject(project.id);
      project.save();
    }
  }
</script>

<main class="device-frame page">
  <ContentFrame>
    {#await projectPromise}
      <BackButton href="/" />
      <p>loading…</p>
    {:then _}
      <div class="top-bar">
        <BackButton href="/" />
        <PopupMenu
          label="Options"
          descriptor={menuDescriptor()}
          alignment="right"
        />
      </div>
      <Header>{project.name || "No project here!"}</Header>
      <p>{project.description}</p>
      <SectionHeader>Tracking overview</SectionHeader>
      <RichTimeline {project} scalable />

      <SectionHeader>Project comments</SectionHeader>

      {#each project.notes as note}
        <div
          class="note-meta"
          on:click={() => (showProjectTimestamps = !showProjectTimestamps)}
        >
          {#if showProjectTimestamps}
            {note.timed ? shortDuration(note.timestamp) : "—"}
          {:else}
            {note.created.toLocaleDateString(undefined, {
              day: "numeric",
              month: "numeric",
              year: "2-digit",
            })}
            {note.created.toLocaleString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}
          {/if}
        </div>
        <div class="content">{note.contents}</div>
      {/each}

      {#if project.active}
        <BottomActionBar
          label={project.sessions?.length
            ? "Resume tracking"
            : "Start tracking"}
          on:click={startTracking}
        />
      {/if}

      <Modal
        bind:visible={editProjectOpen}
        title="Edit project"
        buttons={[{ label: "Close", onClick: saveInfo }]}
      >
        <InputField label="Name" placeholder="" bind:value={editName} />
        <InputField label="Description" large bind:value={editDescription} />
      </Modal>

      <Modal
        bind:visible={deleteProjectOpen}
        title="Delete project"
        buttons={[
          {
            label: "Cancel",
            onClick: () => (deleteProjectOpen = false),
            disabled: !active,
          },
          { label: "Delete", onClick: remove, disabled: !active },
        ]}
      >
        <p>
          The project
          <strong>{project.name}</strong>
          and all its data will be removed.
        </p>
        <p>You can’t undo this action.</p>
      </Modal>

      <Modal
        bind:visible={toggleProjectCompleteOpen}
        title="{project.active ? 'Archive' : 'Unarchive'} this project?"
        buttons={[
          {
            label: "Cancel",
            onClick: () => (toggleProjectCompleteOpen = false),
          },
          { label: "OK", onClick: toggleProjectComplete },
        ]}
      >
        {#if project.active}
          This project will be removed from your recent projects and you won't
          be able to track for this project anymore. You can stil find it under
          "All projects" on the home screen.
        {:else}
          This project will move back to your recent projects and you'll be able
          to continue tracking.
        {/if}
      </Modal>

      <Modal
        bind:visible={otherOpen}
        title="Not available"
        buttons={[{ label: "Close", onClick: () => (otherOpen = false) }]}
      >
        This feature isn't ready yet. Hold tight!
      </Modal>
    {/await}
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $background-color;
    min-height: 100%;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
  }

  .note-meta {
    white-space: nowrap;
    padding-right: 0.5rem;
    @include type-style($type-note-meta);
    color: $text-secondary-color;
  }
  .content {
    margin-bottom: 1rem;
  }
</style>

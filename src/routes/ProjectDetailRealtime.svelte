<script lang="ts">
  import archiveIcon from "@iconify-icons/ic/baseline-archive";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
  import editIcon from "@iconify-icons/ic/baseline-edit";
  import exportIcon from "@iconify-icons/ic/baseline-share";
  import unarchiveIcon from "@iconify-icons/ic/baseline-unarchive";
  import { pop, push } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import InputField from "../components/InputField.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Modal from "../components/Modal.svelte";
  import type { PopupMenuDescriptor } from "../components/PopupMenu.svelte";
  import PopupMenu from "../components/PopupMenu.svelte";
  import RichTimeline from "../components/RichTimeline.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import {
    pushRecentProject,
    removeRecentProject,
  } from "../data/recentProjects";
  import type { RealtimeProject } from "../data/schema";
  import { shortDuration } from "../util/time";

  export let project: RealtimeProject;

  let active = true;
  async function remove() {
    active = false;
    const toRemove = [];
    toRemove.push(removeRecentProject(project.id));
    project.notes.forEach((note) => toRemove.push(note.remove()));
    project.sessions.forEach((session) => toRemove.push(session.remove()));
    toRemove.push(project.remove());
    await Promise.all(toRemove);
    pop();
  }

  function startTracking() {
    push(`/projects/${project.id}/track/`);
  }

  let showProjectTimestamps = false;

  let editProjectOpen = false;
  let toggleProjectCompleteOpen = false;
  let deleteProjectOpen = false;

  const menuDescriptor = (): PopupMenuDescriptor => [
    { label: "Edit", icon: editIcon, action: () => (editProjectOpen = true) },
    {
      label: "Export",
      icon: exportIcon,
      action: () => push(`/projects/${project.id}/export`),
    },
    { separator: true },
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

  let editName = project.name;
  let editDescription = project.description;
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

    <!-- FIXME: This should have both project and session-level notes?  -->
    <SectionHeader>Project comments</SectionHeader>

    {#each project.sessions.flatMap((session) => session.notes) as note}
      <div
        class="note-meta"
        on:click={() => (showProjectTimestamps = !showProjectTimestamps)}
      >
        {#if showProjectTimestamps}
          {shortDuration(note.time)} [WRONG!]
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
      <div class="content">{note.content}</div>
    {/each}

    {#if project.active}
      <BottomActionBar
        label={project.sessions?.length ? "Resume tracking" : "Start tracking"}
        on:click={startTracking}
      />
    {/if}

    <Modal
      bind:visible={editProjectOpen}
      title="Edit project"
      buttons={[{ label: "Save", onClick: saveInfo }]}
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
        This project will be removed from your recent projects and you won't be
        able to track for this project anymore. You can stil find it under "All
        projects" on the home screen.
      {:else}
        This project will move back to your recent projects and you'll be able
        to continue tracking.
      {/if}
    </Modal>
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

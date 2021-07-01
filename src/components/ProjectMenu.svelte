<script lang="ts">
  import archiveIcon from "@iconify-icons/ic/baseline-archive";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
  import editIcon from "@iconify-icons/ic/baseline-edit";
  import exportIcon from "@iconify-icons/ic/baseline-share";
  import unarchiveIcon from "@iconify-icons/ic/baseline-unarchive";
  import { pop, push } from "svelte-spa-router/Router.svelte";
  import {
    pushRecentProject,
    removeRecentProject,
  } from "../data/recentProjects";
  import type { AsyncProject, RealtimeProject } from "../data/schema";
  import { hasOwnProperty } from "../types/utility";
  import InputField from "./InputField.svelte";
  import Modal from "./Modal.svelte";
  import type { PopupMenuDescriptor } from "./PopupMenu.svelte";
  import PopupMenu from "./PopupMenu.svelte";

  export let project: AsyncProject | RealtimeProject;

  let editProjectOpen = false;
  let toggleProjectCompleteOpen = false;
  let deleteProjectOpen = false;

  let menuDescriptor: PopupMenuDescriptor;
  function createMenuDescriptor() {
    menuDescriptor = [
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
  }
  createMenuDescriptor();

  // edit
  let editName = project.name;
  let editDescription = project.description;
  function saveInfo() {
    editName = editName.trim();
    editDescription = editDescription.trim();
    if (editName === project.name && editDescription === project.description) {
      return;
    }
    if (!editName) editName = project.name;
    project.name = editName;
    project.description = editDescription;
    project.modified = new Date();
    editProjectOpen = false;
    project.save();
    if (project.active) {
      pushRecentProject(project.id);
    }
    project = project;
  }

  // archive
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
    project = project;
    createMenuDescriptor();
  }

  // delete
  let active = true;
  async function remove() {
    active = false;
    const toRemove = [];
    toRemove.push(removeRecentProject(project.id));
    project.notes.forEach((note) => toRemove.push(note.remove()));
    if (hasOwnProperty(project, "entries")) {
      project.entries.forEach((entry) => toRemove.push(entry.remove()));
    } else {
      project.sessions.forEach((session) => toRemove.push(session.remove()));
    }
    toRemove.push(project.remove());
    await Promise.all(toRemove);
    pop();
  }
</script>

<PopupMenu label="Options" descriptor={menuDescriptor} alignment="right" />

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
    This project will be removed from your recent projects and you won't be able
    to add entries to this project anymore. You can stil find it under "All
    projects" on the home screen.
  {:else}
    This project will move back to your recent projects and you'll be able to
    add entries.
  {/if}
</Modal>

<script lang="ts">
  import add from "@iconify-icons/ic/baseline-add";
  import type { ActivitySet } from "../../data/schema";
  import BottomActionBar from "../BottomActionBar.svelte";
  import InputField from "../InputField.svelte";
  import Header from "../type/Header.svelte";
  import ActivityEditor from "./ActivityEditor.svelte";
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
  import Button from "../Button.svelte";
  import colorPresets from "../../data/colorPresets";
  import { newActivitySet } from "../../data/database";

  export let activitySet: ActivitySet;
  export let visible: boolean;

  type Activity = {
    name: string;
    code: string;
    description: string;
    color: string;
    id: number;
  };

  const nextId = (function () {
    let lastId = 0;
    return () => lastId++;
  })();

  export let startingPoint: ActivitySet;
  let name = startingPoint.name;
  let activities = startingPoint.activityNames.map<Activity>((name, i) => ({
    name,
    code: startingPoint.activityCodes[i],
    description: startingPoint.activityDescriptions[i],
    color: startingPoint.colors[i],
    id: nextId(),
  }));

  function addItem() {
    const id = nextId();
    activities = [
      ...activities,
      {
        name: "",
        code: "",
        description: "",
        color: colorPresets[id % colorPresets.length],
        id,
      },
    ];
  }

  while (activities.length < 2) addItem();

  function remove(i: number) {
    activities = activities.filter((_, _i) => _i !== i);
  }

  let ok: boolean;
  $: ok =
    name !== "" &&
    activities.length >= 2 &&
    activities.every((activity) => activity.name && activity.code);

  let saving = false;
  async function build() {
    let as = newActivitySet();
    as.name = name;
    as.description = "";
    as.activityNames = activities.map((act) => act.name.trim());
    as.activityCodes = activities.map((act) => act.code.trim());
    as.activityDescriptions = activities.map((act) => act.description.trim());
    as.colors = activities.map((act) => act.color);
    as.wellKnown = false;
    saving = true;
    await as.save();
    activitySet = as;
    visible = false; // bye!
  }

  let dragDisabled = true;
  function handleDragConsider(e) {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;
    activities = newItems;
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }
  function handleDragFinalize(e) {
    const {
      items: newItems,
      info: { source },
    } = e.detail;
    activities = newItems;
    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .label {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  li {
    margin: 0;
    padding: $input-spacing-inner/2;
    background-color: $background-color;
    border-radius: 0.01px;
    &:focus {
      // z-index: 20;
      position: relative;
    }
  }
  .add-button {
    margin: $input-spacing-inner 0;
  }
</style>

<Header>Create a Design Activity Set</Header>
{#if !saving}
  <InputField label="Title" bind:value={name} />
  <div class="label">Activities</div>
  <ul
    use:dndzone={{ items: activities, dragDisabled, dropTargetStyle: {} }}
    on:consider={handleDragConsider}
    on:finalize={handleDragFinalize}>
    {#each activities as activity, i (activity.id)}
      <li>
        <ActivityEditor
          bind:activity
          bind:dragDisabled
          remove={() => remove(i)} />
      </li>
    {/each}
  </ul>

  {#if activities.length < 10}
    <div class="add-button">
      <Button small on:click={addItem} icon={add}>Add activity</Button>
    </div>
  {/if}
{:else}
  <p>Saving…</p>
{/if}

<BottomActionBar label="Save and use" disabled={!ok} on:click={build} />

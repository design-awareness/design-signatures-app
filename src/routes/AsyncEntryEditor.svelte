<script lang="ts">
  import ActivityEntrySlat from "../components/ActivityEntrySlat.svelte";
  import BottomActionBar from "../components/BottomActionBar.svelte";
  import InputField from "../components/InputField.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import RichLabel from "../components/RichLabel.svelte";
  import SegmentedSelector from "../components/SegmentedSelector.svelte";
  import type { AsyncEntry, AsyncProject, DesignModel } from "../data/schema";
  import { fromDate, MONTH_NAME } from "../util/date";

  export let project: AsyncProject;
  export let entry: AsyncEntry;
  export let label: string;
  export let save: () => Promise<void>;
  export let designModel: DesignModel;

  if (!label) {
    let date = fromDate(entry.period);
    label = `${MONTH_NAME[date.month]} ${date.day}, ${date.year}`;
  }

  let values = entry.data.map((data) => roundD2(data.value / 60));
  let notes = entry.data.map((data) => data.note);

  type EntryMode = "raw" | "percent";
  let entryMode = project.getMeta("entryUnit", "raw");
  let lastEntryMode: EntryMode = "raw";
  let total = 0;
  calculateTotal();
  $: if (lastEntryMode !== entryMode) {
    lastEntryMode = entryMode;
    project.setMeta("entryUnit", entryMode);
    project.save();
    if (entryMode === "percent") {
      values = values.map((value) => value && roundD2((value * 100) / total));
    } else {
      values = values.map((value) => value && roundD2((value * total) / 100));
      calculateTotal();
    }
  }

  function roundD2(v: number) {
    return Math.round(100 * v) / 100;
  }
  function calculateTotal() {
    total = roundD2(values.reduce((a, b) => a + b, 0));
  }

  function beforeUnload(evt: BeforeUnloadEvent) {
    evt.preventDefault();
    evt.returnValue = "Changes may not be saved.";
    return "Changes may not be saved.";
  }

  const update = (i: number) => () => {
    if (i >= 0) {
      values[i] = Math.max(values[i], 0);
    }
    calculateTotal();
    entry.data = values.map((value, i) => ({
      value:
        entryMode === "raw"
          ? Math.round(value * 60)
          : total && Math.round((value / 100) * total * 60),
      note: notes[i],
    }));
  };
  const updateNote = () => {
    entry.note = entry.note.trim();
  };
</script>

<svelte:window on:beforeunload={beforeUnload} />
<div class="header">{label}</div>
<div class="spacer" role="presentation" />
<ContentFrame>
  <RichLabel label="Activity times">
    <SegmentedSelector
      inlabel
      options={[
        ["raw", "Absolute"],
        ["percent", "Percent"],
      ]}
      bind:value={entryMode}
    />
  </RichLabel>

  {#each designModel.activities as activity, i}
    <ActivityEntrySlat
      {activity}
      bind:value={values[i]}
      bind:note={notes[i]}
      {entryMode}
      on:blur={update(i)}
    />
  {/each}
  <ActivityEntrySlat
    activity={designModel.activities[0]}
    bind:value={total}
    on:blur={update(-1)}
    note=""
    entryMode="raw"
    isTotalRow
    isTotalDisabled={entryMode === "raw"}
  />

  <div class="note">
    <InputField
      on:blur={updateNote}
      large
      xlarge
      bind:value={entry.note}
      label="Entry note"
      placeholder="Add a note to this entry"
    />
  </div>
</ContentFrame>
<BottomActionBar label="Save" on:click={save} />

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: $action-bar-background-color;
    color: $text-opposing-color;
    @include type-style($type-section-header);
    text-align: center;
    padding: 0.5rem;
    z-index: 1;
  }
  .spacer {
    height: 1rem + rem(map-get($type-section-header, height));
  }
</style>

<script lang="ts">
  import addIcon from "@iconify-icons/ic/baseline-add";
  import leftChevron from "@iconify-icons/ic/baseline-chevron-left";
  import rightChevron from "@iconify-icons/ic/baseline-chevron-right";
  import clearIcon from "@iconify-icons/ic/baseline-clear";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
  import editIcon from "@iconify-icons/ic/baseline-edit";
  import infoIcon from "@iconify-icons/ic/baseline-info";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import { tick } from "svelte";
  import { pop, push, querystring } from "svelte-spa-router";
  import BackButton from "../components/BackButton.svelte";
  import Button from "../components/Button.svelte";
  import DotGridCell from "../components/DotGridCell.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Modal from "../components/Modal.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import SegmentedSelector from "../components/SegmentedSelector.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { newAsyncEntry } from "../data/database";
  import type { AsyncEntry, AsyncProject } from "../data/schema";
  import {
    insertIntoEntryTable,
    makeEntryTable,
    removeFromEntryTable,
    sumActivityTimes,
  } from "../util/asyncEntry";
  import type { SimpleDate } from "../util/date";
  import {
    addDays,
    floorDateToWeekday,
    fromDate,
    getToday,
    makeDate,
    MONTH_NAME,
    MONTH_SHORT_NAME,
    toDateString,
  } from "../util/date";
  import { expressiveDurationM } from "../util/time";
  import AsyncEntryEditor from "./AsyncEntryEditor.svelte";

  export let project: AsyncProject;

  let { reportingPeriod, periodAlignment } = project;
  let entryTable = makeEntryTable(project);

  type ViewMode = "day" | "week" | "month";
  let viewOptions: [ViewMode, string][] = [
    ["week", "Week"],
    ["month", "Month"],
  ];
  if (reportingPeriod === "day") viewOptions.unshift(["day", "Day"]);
  let view: ViewMode = viewOptions[1][0];
  let viewMonthDisplay: string = "";
  let viewYearDisplay: string = "";
  let viewContextDisplay: string = "";
  let viewDate: Date = getToday();
  let columns: SimpleDate[] = [];
  let columnData: (AsyncEntry["data"] | undefined)[] = [];
  let activeEntry: AsyncEntry | null = null;
  let pointMax: number = 0;

  let projectTotals: number[];
  function updateProjectTotals() {
    projectTotals = sumActivityTimes(
      project.entries,
      project.designModel.activities.length
    ).map(({ value }) => value);
  }
  updateProjectTotals();

  let selectedActivity = -1;

  let userDate: string = toDateString(viewDate);
  let userDateField: HTMLInputElement;
  let showUserDate = false;

  /**
   * Change to a particular date. If not given, recalculates based on the
   * currently set date.
   * @param date
   */
  function recalculate() {
    let date = viewDate;
    let simpleDate = fromDate(date);
    let { day, month, year } = simpleDate;
    let dateString = toDateString(simpleDate);
    userDate = dateString;

    if (view === "day") {
      viewContextDisplay = `${MONTH_NAME[month]} ${day}`;
      viewMonthDisplay = MONTH_NAME[month];
      viewYearDisplay = year.toString();
      let weekString = toDateString(floorDateToWeekday(date, periodAlignment));
      activeEntry = entryTable.get(weekString)?.get(dateString) ?? null;
      calculateEntryGraph();
    } else if (view === "week") {
      date = floorDateToWeekday(date, periodAlignment);
      let startDate = fromDate(date);
      let endDate = startDate;
      columns = [startDate];
      for (let i = 0; i < 6; i++) {
        addDays(date, 1);
        endDate = fromDate(date);
        columns.push(endDate);
      }
      viewContextDisplay = `Week of ${startDate.day}–${endDate.day}`;
      if (startDate.month === endDate.month) {
        viewMonthDisplay = MONTH_NAME[startDate.month];
        viewYearDisplay = startDate.year.toString();
      } else {
        viewMonthDisplay = `${MONTH_SHORT_NAME[startDate.month]}–${
          MONTH_SHORT_NAME[endDate.month]
        }`;
        if (startDate.year === endDate.year) {
          viewYearDisplay = startDate.year.toString();
        } else {
          viewYearDisplay = `${startDate.year}–${endDate.year}`;
        }
      }
      if (reportingPeriod === "week") {
        let activeDateString = toDateString(startDate);
        activeEntry =
          entryTable.get(activeDateString)?.get(activeDateString) ?? null;
        calculateEntryGraph();
      } else {
        let weekString = toDateString(startDate);
        let weekTable = entryTable.get(weekString);
        columnData = columns.map(
          (columnDate) => weekTable?.get(toDateString(columnDate))?.data
        );
        getPointMax();
      }
    } else {
      viewMonthDisplay = MONTH_NAME[month];
      viewContextDisplay = viewMonthDisplay;
      viewYearDisplay = year.toString();
      let movingDate = new Date(date);
      movingDate.setUTCDate(1);
      movingDate = floorDateToWeekday(movingDate, periodAlignment);
      columns = [];
      do {
        columns.push(fromDate(movingDate));
        addDays(movingDate, 7);
      } while (movingDate.getUTCMonth() === month);

      columnData = columns.map((columnDate) => {
        let columnDateString = toDateString(columnDate);
        if (reportingPeriod === "week") {
          return entryTable.get(columnDateString)?.get(columnDateString)?.data;
        } else {
          let weekEntries = entryTable.get(columnDateString)?.values();
          return weekEntries
            ? sumActivityTimes(
                weekEntries,
                project.designModel.activities.length
              )
            : undefined;
        }
      });
      getPointMax();
    }
  }
  recalculate();

  function getPointMax() {
    pointMax = 0;
    columnData.forEach((column) =>
      column?.forEach(({ value }) => {
        if (value > pointMax) pointMax = value;
      })
    );
  }

  let lastView = view;
  $: if (lastView !== view) {
    lastView = view;
    if (view === "day") {
      selectedActivity = -1;
    }
    recalculate();
  }

  function updateFromUserDate() {
    let date: Date;
    if (!userDate) {
      date = getToday();
    } else {
      date = new Date(userDate);
      if (!date) return;
    }
    viewDate = date;
    recalculate();
  }

  function nudgeDateDown() {
    if (view === "day") {
      addDays(viewDate, -1);
    } else if (view === "week") {
      addDays(viewDate, -7);
    } else {
      viewDate.setUTCDate(1);
      viewDate.setUTCMonth(viewDate.getUTCMonth() - 1);
    }
    recalculate();
  }
  function nudgeDateUp() {
    if (view === "day") {
      addDays(viewDate, 1);
    } else if (view === "week") {
      addDays(viewDate, 7);
    } else {
      viewDate.setUTCDate(1);
      viewDate.setUTCMonth(viewDate.getUTCMonth() + 1);
    }
    recalculate();
  }

  const drillDown = (to: SimpleDate) => () => {
    viewDate = makeDate(to);
    if (view === "month") {
      view = "week";
    } else if (view === "week") {
      view = "day";
    }
    recalculate();
  };

  function getColumnHeader(date: SimpleDate): string {
    let result: string = date.day.toString();
    if (view === "month") {
      result += "–" + getWeekLastDayNumber(date);
    }
    return result;
  }

  function getWeekLastDay(date: SimpleDate): SimpleDate {
    let mutDate = makeDate(date);
    addDays(mutDate, 6);
    return fromDate(mutDate);
  }
  function getWeekLastDayNumber(date: SimpleDate): number {
    let mutDate = makeDate(date);
    addDays(mutDate, 6);
    return mutDate.getUTCDate();
  }

  let showEntry: boolean;
  let wasShowingEntry = false;
  $: {
    showEntry = $querystring === "entry";
    if (showEntry && !activeEntry) pop();
    if (wasShowingEntry && !showEntry && activeEntry && activeEntry.dirty) {
      project.save();
      updateProjectTotals();
    }
    wasShowingEntry = showEntry;
  }
  let entryLabel: string;

  function addEntry() {
    entryGraphMax = 0;
    let entry = newAsyncEntry();
    entry.period = new Date(viewDate);
    entry.data = project.designModel.activities.map((_) => ({
      value: 0,
      note: "",
    }));
    project.entries = [...project.entries, entry];
    insertIntoEntryTable(entryTable, entry, reportingPeriod, periodAlignment);
    activeEntry = entry;

    editEntry();
  }

  function editEntry() {
    let entryDate = fromDate(viewDate);
    if (reportingPeriod === "day") {
      entryLabel = `${MONTH_NAME[entryDate.month]} ${entryDate.day}, ${
        entryDate.year
      }`;
    } else {
      let endDate = getWeekLastDay(entryDate);
      if (entryDate.month === endDate.month) {
        entryLabel = `${MONTH_NAME[entryDate.month]} ${entryDate.day}–${
          endDate.day
        }, ${entryDate.year}`;
      } else if (entryDate.year === endDate.year) {
        entryLabel = `${MONTH_NAME[entryDate.month]} ${entryDate.day}–${
          MONTH_NAME[endDate.month]
        } ${endDate.day}, ${entryDate.year}`;
      } else {
        entryLabel = `${MONTH_NAME[entryDate.month]} ${entryDate.day}, ${
          entryDate.year
        }–${MONTH_NAME[endDate.month]} ${endDate.day}, ${endDate.year}`;
      }
    }

    push(`/projects/${project.id}/?entry`);
  }

  async function saveEntry() {
    if (!activeEntry) return;
    activeEntry.modified = new Date();
    project.modified = new Date();
    await project.save();
    calculateEntryGraph();
    updateProjectTotals();
    wasShowingEntry = false;
    await pop();
  }

  function showDelete() {
    push(`/projects/${project.id}/?delete`);
  }

  let isDeletingEntry = false;
  async function deleteEntry() {
    if (isDeletingEntry) return;
    isDeletingEntry = true;
    if (activeEntry) {
      project.entries = project.entries.filter(
        (entry) => entry !== activeEntry
      );
      let entryToDelete = activeEntry;
      removeFromEntryTable(
        entryTable,
        entryToDelete,
        reportingPeriod,
        periodAlignment
      );
      activeEntry = null;
      await entryToDelete.remove();
      await project.save();
      updateProjectTotals();
    }
    await pop();
    isDeletingEntry = false;
  }

  let entryGraphMax = 0;
  function calculateEntryGraph() {
    if (!activeEntry) {
      entryGraphMax = 0;
    } else {
      entryGraphMax = Math.max(...activeEntry.data.map((d) => d.value));
    }
  }

  function getEntryTotal() {
    if (!activeEntry) return 0;
    return activeEntry.data.reduce((a, b) => a + b.value, 0);
  }

  const selectActivity = (i: number) => () => {
    if (selectedActivity === i) {
      selectedActivity = -1;
    } else {
      selectedActivity = i;
    }
  };
</script>

<main class="device-frame page">
  {#if showEntry && activeEntry}
    <AsyncEntryEditor
      entry={activeEntry}
      label={entryLabel}
      save={saveEntry}
      designModel={project.designModel}
    />
  {:else}
    <ContentFrame>
      <div class="top-bar">
        <BackButton href="/" />
        <ProjectMenu bind:project />
      </div>
      <Header>{project.name || "No project here!"}</Header>
      <p class="description">{project.description}</p>

      <PageSeparator />

      <div class="dotgrid-header">
        <h2><strong>{viewMonthDisplay}</strong> {viewYearDisplay}</h2>
        <SegmentedSelector inlabel bind:value={view} options={viewOptions} />
      </div>

      <div class="dotgrid-body">
        <button class="dotgrid-activities">
          <div class="dotgrid-column-header">
            <Icon icon={infoIcon} />
          </div>
          {#each project.designModel.activities as activity}
            <div
              class="dotgrid-activity choose-theme-color"
              style="--activity-color-light: #{activity
                .color[0]}; --activity-color-dark: #{activity.color[1]}"
            >
              <i>{activity.code}</i>
            </div>
          {/each}
        </button>

        <div class="dotgrid-column-area">
          <div class="dotgrid-context-controls">
            <button on:click={nudgeDateDown} class="dotgrid-control-nudge"
              ><Icon icon={leftChevron} /></button
            >
            {#if showUserDate}
              <input
                class="grow dotgrid-control-context"
                type="date"
                bind:this={userDateField}
                bind:value={userDate}
                on:change={updateFromUserDate}
                on:blur={() => (showUserDate = false)}
              />
            {:else}
              <button
                class="grow dotgrid-control-context"
                on:click={async () => {
                  showUserDate = true;
                  await tick();
                  userDateField?.focus();
                  userDateField?.click();
                }}>{viewContextDisplay}</button
              >
            {/if}
            <button on:click={nudgeDateUp} class="dotgrid-control-nudge"
              ><Icon icon={rightChevron} /></button
            >
          </div>

          <div class="dotgrid-columns">
            {#if view === reportingPeriod || view === "day"}
              <div class="dotgrid-chart">
                {#if !activeEntry}
                  <div class="dotgrid-chart-banner">
                    No data for this period.
                    <Button small icon={addIcon} on:click={addEntry}
                      >Add new entry</Button
                    >
                  </div>
                {/if}
                <div class="dotgrid-chart-header">
                  {#if activeEntry}
                    {#if selectedActivity !== -1}
                      <button
                        class="tiny clear"
                        on:click={() => (selectedActivity = -1)}
                      >
                        <Icon icon={clearIcon} />
                      </button>
                    {/if}
                    <div class="label">
                      {#if selectedActivity === -1}
                        Total time: {expressiveDurationM(getEntryTotal())}
                      {:else}
                        {project.designModel.activities[selectedActivity].name}:
                        {expressiveDurationM(
                          activeEntry.data[selectedActivity].value
                        )}
                      {/if}
                    </div>
                    <button class="tiny edit" on:click={editEntry}>
                      <Icon icon={editIcon} />
                      Edit entry
                    </button>
                    <button
                      class="tiny delete"
                      aria-label="delete entry"
                      on:click={showDelete}
                    >
                      <Icon icon={deleteIcon} />
                    </button>
                  {/if}
                </div>
                {#each project.designModel.activities as activity, i}
                  <button
                    class="dotgrid-chart-row choose-theme-color"
                    on:click={selectActivity(i)}
                    style="--activity-color-light: #{activity
                      .color[0]}; --activity-color-dark: #{activity.color[1]}"
                  >
                    {#if activeEntry && activeEntry.data[i].value}
                      <div
                        class="dotgrid-chart-bar"
                        class:highlight={selectedActivity === -1 ||
                          selectedActivity === i}
                        style="width: {entryGraphMax &&
                          (activeEntry.data[i].value / entryGraphMax) * 100}%"
                      >
                        <span
                          >{expressiveDurationM(
                            activeEntry.data[i].value
                          )}</span
                        >
                      </div>
                    {/if}
                  </button>
                {/each}
              </div>
            {:else}
              {#each columns as column, columnIdx}
                <button class="dotgrid-column" on:click={drillDown(column)}>
                  <div class="dotgrid-column-header">
                    {getColumnHeader(column)}
                  </div>
                  {#each project.designModel.activities as activity, i}
                    <div
                      class="dotgrid-cell choose-theme-color"
                      style="--activity-color-light: #{activity
                        .color[0]}; --activity-color-dark: #{activity.color[1]}"
                    >
                      <DotGridCell
                        data={columnData[columnIdx]?.[i]}
                        max={pointMax}
                      />
                    </div>
                  {/each}
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </div>

      <PageSeparator />

      <!-- FIXME: add notes  -->
      <SectionHeader>Project comments</SectionHeader>
    </ContentFrame>
    <Modal
      visible={$querystring === "delete"}
      title="Delete entry?"
      closeWithScrim={false}
      buttons={[
        { label: "Cancel", onClick: pop, disabled: isDeletingEntry },
        { label: "Delete", onClick: deleteEntry, disabled: isDeletingEntry },
      ]}
    >
      <p>You can't undo this action.</p>
    </Modal>
  {/if}
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $alt-background-color;
    min-height: 100%;
  }

  .description {
    color: $text-secondary-color;
  }

  .dotgrid-header {
    margin: $block-vertical-spacing 0 $block-vertical-spacing 0;
    display: flex;
    h2 {
      @include type-style($type-input-label);
      font-weight: 400;
      flex-grow: 1;
      margin: 0;
    }
    strong {
      font-weight: 600;
    }
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
  }

  .choose-theme-color {
    --activity-color: var(--activity-color-light);
    @media (prefers-color-scheme: dark) {
      --activity-color: var(--activity-color-dark);
    }
  }

  $context-control-height: 2rem;
  $column-header-height: 1.5rem;
  $controls-vertical-space: 0.25rem;
  $horizontal-gap: 0.25rem;
  $vertical-cell-gap: 0.25rem;

  $cell-height: 2.5rem;
  $bar-height: 2rem;

  .dotgrid {
    &-body {
      display: flex;
      align-items: flex-end;
    }
    &-activities {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      border: 0;
      appearance: none;
      -webkit-appearance: none;
      background-color: transparent;
      border-right: 1px solid $text-ghost-color;
      border-radius: 0.01px;
      gap: $vertical-cell-gap;
      padding: $vertical-cell-gap $horizontal-gap $vertical-cell-gap 0;
      .dotgrid-column-header {
        font-size: 1rem;
        color: $text-ghost-color;
      }
    }
    &-activity {
      height: $cell-height;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      i {
        @include type-style($type-token);
        font-style: normal;
        color: var(--activity-color);
      }
    }
    &-column-area {
      flex-grow: 1;
      gap: $controls-vertical-space;
      display: flex;
      flex-direction: column;
    }
    &-context-controls {
      display: flex;
      height: $context-control-height;
      gap: $horizontal-gap;
      button,
      input {
        border: 0;
        appearance: none;
        -webkit-appearance: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $text-primary-color;
        padding: 0 0.5rem;
      }
    }
    &-control-nudge {
      background-color: transparent;
      border-radius: 0.01px;
      font-size: 1.5rem;
    }
    &-control-context {
      background-color: $button-background-color;
      border-radius: 4px;
      text-transform: uppercase;
    }
    &-columns {
      display: flex;
    }
    &-column {
      flex-grow: 1;
      flex-basis: 0;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: $vertical-cell-gap;
      border: 0;
      appearance: none;
      -webkit-appearance: none;
      background-color: transparent;
      border-right: 1px solid $text-ghost-color;
      border-radius: 0.01px;
      padding: $vertical-cell-gap 0;
    }
    &-column-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: $column-header-height;
      text-align: center;
      @include type-style($type-detail);
      color: $text-secondary-color;
    }
    &-cell {
      height: $cell-height;
    }
    &-chart {
      flex-grow: 1;
      display: flex;
      position: relative;
      flex-direction: column;
      gap: $vertical-cell-gap;
      padding: $vertical-cell-gap 0;
    }
    &-chart-banner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      padding: 2rem;
      gap: 1rem;
      background: $modal-background-color;
      border-radius: $modal-border-radius;
      box-shadow: $modal-shadow;
    }
    &-chart-header {
      @include type-style($type-detail);
      height: $column-header-height;
      display: flex;
      align-items: center;
      padding: 0 0 0 0.5rem;

      .label {
        flex-grow: 1;
      }
      .tiny {
        appearance: none;
        -webkit-appearance: none;
        border: 0;
        background-color: transparent;
        border-radius: 2px;
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 0.5rem;
        gap: 0.25rem;
        color: $text-secondary-color;
        :global(svg) {
          font-size: 1rem;
        }
        &.clear {
          padding: 0 0.25rem;
          margin-right: 0.25rem;
        }
        &:hover {
          background-color: $background-color;
        }
        &.edit {
          color: $text-actionable-color;
        }
        &.delete:hover {
          color: $accent-danger-color;
        }
      }
    }
    &-chart-row {
      height: $cell-height;
      border: 0;
      appearance: none;
      -webkit-appearance: none;
      background-color: transparent;
      border-radius: 0.01px;
      padding: 0;
    }
    &-chart-bar {
      height: $bar-height;
      line-height: $bar-height;
      box-sizing: border-box;
      border-radius: 0 4px 4px 0;
      background-color: var(--activity-color);
      opacity: 0.5;
      text-align: right;
      &.highlight {
        opacity: 1;
      }
      span {
        color: $text-opposing-color;
        padding-right: 0.25rem;
      }
    }
  }
  .grow {
    flex-grow: 1;
  }
</style>

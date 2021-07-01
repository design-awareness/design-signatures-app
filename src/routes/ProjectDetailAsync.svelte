<script lang="ts">
  import addIcon from "@iconify-icons/ic/baseline-add";
  import leftChevron from "@iconify-icons/ic/baseline-chevron-left";
  import rightChevron from "@iconify-icons/ic/baseline-chevron-right";
  import infoIcon from "@iconify-icons/ic/baseline-info";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import { tick } from "svelte";
  import BackButton from "../components/BackButton.svelte";
  import Button from "../components/Button.svelte";
  import DotGridCell from "../components/DotGridCell.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import SegmentedSelector from "../components/SegmentedSelector.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import type { AsyncEntry, AsyncProject } from "../data/schema";
  import { makeEntryTable, sumActivityTimes } from "../util/asyncEntry";
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

  let totals = sumActivityTimes(
    project.entries,
    project.designModel.activities.length
  ).map(({ value }) => value);

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
      result += "–" + getWeekLastDay(date);
    }
    return result;
  }

  function getWeekLastDay(date: SimpleDate): number {
    let mutDate = makeDate(date);
    addDays(mutDate, 6);
    return mutDate.getUTCDate();
  }
</script>

<main class="device-frame page">
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
                  <Button small icon={addIcon}>Add new entry</Button>
                </div>
              {/if}
              <div class="dotgrid-chart-header">
                {#if activeEntry}
                  Entry
                {/if}
              </div>
              {#each project.designModel.activities as activity, i}
                <button class="dotgrid-chart-row">
                  {#if activeEntry}
                    <div class="dotgrid-chart-bar" />
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
      height: $column-header-height;
      display: flex;
    }
    &-chart-row {
      height: $cell-height;
      border: 0;
      appearance: none;
      background-color: transparent;
      border-radius: 0.01px;
      padding: 0;
    }
  }
  .grow {
    flex-grow: 1;
  }
</style>

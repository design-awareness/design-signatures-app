<script lang="ts">
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import ProjectMenu from "../components/ProjectMenu.svelte";
  import SegmentedSelector from "../components/SegmentedSelector.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import type { AsyncProject } from "../data/schema";
  import {
    floorDateToWeekday,
    getToday,
    makeDate,
    addDays,
    fromDate,
    MONTH_NAME,
    MONTH_SHORT_NAME,
    toDateString,
  } from "../util/date";
  import type { SimpleDate } from "../util/date";
  import { tick } from "svelte";

  export let project: AsyncProject;

  let { reportingPeriod, periodAlignment } = project;

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

  let userDate: string = toDateString(viewDate);
  let userDateField: HTMLInputElement;
  let showUserDate = false;

  /**
   * Change to a particular date. If not given, recalculates based on the
   * currently set date.
   * @param date
   */
  function calculateDateView() {
    viewDate = viewDate; // FIXME: probably won't be necessary once grid is done
    let date = viewDate;
    let simpleDate = fromDate(date);
    let { day, month, year } = simpleDate;
    userDate = toDateString(simpleDate);

    if (view === "day") {
      viewContextDisplay = `${MONTH_NAME[month]} ${day}`;
      viewMonthDisplay = MONTH_NAME[month];
      viewYearDisplay = year.toString();
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
    }
  }
  calculateDateView();

  function getWeekLastDay(date: SimpleDate): SimpleDate {
    let working = makeDate(date);
    addDays(working, 6);
    return fromDate(working);
  }

  let lastView = view;
  $: if (lastView !== view) {
    lastView = view;
    calculateDateView();
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
    calculateDateView();
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
    calculateDateView();
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
    calculateDateView();
  }

  const drillDown = (to: SimpleDate) => () => {
    viewDate = makeDate(to);
    if (view === "month") {
      view = "week";
    } else if (view === "week") {
      view = "day";
    }

    calculateDateView();
  };
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

    <div class="dotgrid-context-controls">
      <button on:click={nudgeDateDown}>&lt;-</button>
      {#if showUserDate}
        <input
          class="grow"
          type="date"
          bind:this={userDateField}
          bind:value={userDate}
          on:change={updateFromUserDate}
          on:blur={() => (showUserDate = false)}
        />
      {:else}
        <button
          class="grow"
          on:click={async () => {
            showUserDate = true;
            await tick();
            userDateField?.focus();
            userDateField?.click();
          }}>{viewContextDisplay}</button
        >
      {/if}
      <button on:click={nudgeDateUp}>-&gt;</button>
    </div>
    {#if view !== reportingPeriod}
      <ul>
        {#each columns as column}
          <li>
            <button on:click={drillDown(column)}>
              {toDateString(column)}
              {#if view === "month"}
                – {toDateString(getWeekLastDay(column))}
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>viewing {toDateString(viewDate)}</p>
    {/if}

    <PageSeparator />

    <!-- FIXME: add notes  -->
    <SectionHeader>Project comments</SectionHeader>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $background-color;
    min-height: 100%;
  }

  .description {
    color: $text-secondary-color;
  }

  .dotgrid-header {
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
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

  .dotgrid-context-controls {
    display: flex;
    gap: 0.5rem;
    .grow {
      flex-grow: 1;
    }
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
  }
</style>

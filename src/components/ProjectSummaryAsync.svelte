<script lang="ts">
  import type { AsyncProject } from "../data/schema";
  import { sumActivityTimes } from "../util/asyncEntry";
  import { fromDate, MONTH_SHORT_NAME } from "../util/date";
  import ProjectSummary from "./ProjectSummary.svelte";

  export let project: AsyncProject;

  let activityTotals: number[];
  function updateActivityTotals() {
    activityTotals = sumActivityTimes(
      project.entries,
      project.designModel.activities.length
    ).map(({ value }) => value);
  }

  let firstLast: [string, string];
  function updateFirstLast() {
    if (project.entries.length === 0) {
      firstLast = ["—", "—"];
      return;
    }
    let first = project.entries[0].period;
    let last = first;
    project.entries.forEach((entry) => {
      let date = entry.period;
      if (date < first) {
        first = date;
      }
      if (date > last) {
        last = date;
      }
    });
    firstLast = [shortDateStr(first), shortDateStr(last)];
  }

  export let update;
  update = function () {
    updateActivityTotals();
    updateFirstLast();
  };
  update();

  function shortDateStr(date: Date): string {
    let { month, day } = fromDate(date);
    return `${MONTH_SHORT_NAME[month]} ${day}`;
  }
</script>

<ProjectSummary
  {project}
  chartData={activityTotals}
  count={project.entries.length}
  countLabel="Total entries"
  {firstLast}
  firstLastType="entry"
/>

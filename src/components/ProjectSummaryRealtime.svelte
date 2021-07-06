<script lang="ts">
  import data from "@iconify-icons/ic/baseline-arrow-back";

  import type { RealtimeProject } from "../data/schema";
  import { sumActivityTimes } from "../util/asyncEntry";
  import { fromDate, MONTH_SHORT_NAME } from "../util/date";
  import ProjectSummary from "./ProjectSummary.svelte";

  export let project: RealtimeProject;

  let sums: number[] = new Array(project.designModel.activities.length);
  sums.fill(0);
  project.sessions.forEach((session) =>
    session.data.forEach((data, i) =>
      data.forEach(([on, off]) => (sums[i] += off - on))
    )
  );
  let activityTotals = sums.map((v) => v / 1000 / 60);

  let firstLast: [string, string];
  if (project.sessions.length === 0) {
    firstLast = ["—", "—"];
  } else {
    let first = project.sessions[0].start;
    let last = first;
    project.sessions.forEach((session) => {
      let date = session.start;
      if (date < first) {
        first = date;
      }
      if (date > last) {
        last = date;
      }
    });
    firstLast = [shortDateStr(first), shortDateStr(last)];
  }

  function shortDateStr(date: Date): string {
    let month = date.getMonth();
    let day = date.getDate();
    return `${MONTH_SHORT_NAME[month]} ${day}`;
  }
</script>

<ProjectSummary
  designModel={project.designModel}
  chartData={activityTotals}
  count={project.sessions.length}
  countLabel="Total sessions"
  {firstLast}
  firstLastType="session"
/>

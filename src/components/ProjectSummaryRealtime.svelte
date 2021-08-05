<script lang="ts">
  import type { RealtimeProject } from "../data/schema";
  import { MONTH_SHORT_NAME } from "../util/date";
  import { expressiveDurationM } from "../util/time";
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

  let totalDuration = project.sessions.reduce(
    (acc, session) => acc + session.duration,
    0
  );

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
  {project}
  chartData={activityTotals}
  count={project.sessions.length}
  countLabel="Total sessions"
  {firstLast}
  firstLastType="session"
/>
<p>Total time logged: {expressiveDurationM(totalDuration / 60 / 1000)}</p>

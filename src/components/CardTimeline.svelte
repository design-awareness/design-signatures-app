<script lang="ts">
  import type { Project, Session } from "../data/schema";

  const MAX_DURATION = 60 * 60 * 1000; // one hour

  export let project: Project;

  let colors = project.activitySet.colors;

  let duration = 0;
  let sessions: Session[] = [];
  let i = project.sessions.length - 1;
  while (duration < MAX_DURATION && i >= 0) {
    sessions.unshift(project.sessions[i]);
    duration += project.sessions[i].duration;
    i--;
  }

  let priorDuration = 0;
  let priorDurations: number[] = [];
  sessions.forEach((session) => {
    priorDurations.push(priorDuration);
    priorDuration += session.duration;
  });

  let renderData = sessions.map((session, i) => ({
    data: session.data,
    priorDuration: priorDurations[i],
  }));
  console.log(renderData);
</script>

<style lang="scss">
  .timeline,
  svg {
    width: 100%;
    height: 100%;
  }
</style>

<div class="timeline">
  {#if project.sessions?.length}
    <svg
      preserveAspectRatio="none"
      viewBox="{Math.max(0, duration - MAX_DURATION) / 1000} 0 {duration / 1000} {colors.length}"
      xmlns="http://www.w3.org/2000/svg">
      {#each renderData as { data, priorDuration }}
        {#each data as points, i}
          {#each points as [start, end]}
            <rect
              x={(priorDuration + start - 1) / 1000}
              width={(end - start) / 1000}
              y={i}
              height={1}
              fill="#{colors[i]}" />
          {/each}
        {/each}
      {/each}
    </svg>
  {/if}
</div>

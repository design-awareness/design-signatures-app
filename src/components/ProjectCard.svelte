<script lang="ts">
  import { getProject } from "../data/database";
  import type { Project } from "../data/schema";

  export let newProjectPlaceholder = false;
  export let loadingPlaceholder = false;
  export let id: string = null;

  let loading = true;
  let project: Project = null;

  if (newProjectPlaceholder) {
    loading = false;
  } else if (!loadingPlaceholder) {
    (async function load() {
      project = await getProject(id);
      loading = false;
    })();
  }
</script>

<style lang="scss">
  $card-width: 8rem;
  $card-height: 12rem;
  $card-border-radius: 4px;
  .card {
    width: $card-width;
    height: $card-height;
    background: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: $card-border-radius;
  }
  .link {
    $link-right-pad: 1rem;
    margin-top: 0.5rem;
    line-height: 1rem;
    width: $card-width;
    display: block;
    font-size: 0.875rem;

    span {
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: calc(#{$card-width} - #{$link-right-pad});
      vertical-align: bottom;
    }

    &.loading {
      width: 6rem;
      background-color: grey;
      height: 1rem;
    }
    &::after {
      content: "›";
      display: inline-block;
      transform: translateX(0.5rem);
    }
  }
  .card {
    &.new {
      $plus-color: #4f4f4f;
      $plus-size: 4rem;

      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        fill: $plus-color;
        stroke: $plus-color;
        width: $plus-size;
        height: $plus-size;
      }
    }
  }
</style>

<div class="project-card" class:loading>
  {#if newProjectPlaceholder}
    <div class="card new">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 62 62"><circle
          cx="31"
          cy="31"
          r="30.75"
          fill="none"
          stroke-width=".5" />
        <path
          d="M31.5312 30.125h13.5626v2.5625H31.5312v13.5h-2.5624v-13.5h-13.5V30.125h13.5V16.5625h2.5624V30.125z"
          stroke="none" /></svg>
    </div>
  {:else}
    <div class="card" />
  {/if}

  <div class="link" class:loading class:new={newProjectPlaceholder}>
    {#if !loading && !newProjectPlaceholder}
      <span>{project.name}</span>
    {:else if !loading}New project{/if}
  </div>
</div>

<script lang="ts">
  import type { Project } from "../data/schema";
  import { serialize } from "../data/serialize";
  import download from "../util/download";

  export let project: Project;

  function exportProject() {
    download(
      `${safeName(project.name)}.json`,
      "application/json",
      serialize(project)
    );
  }
  function safeName(name: string) {
    return name.trim().replace(/[\W\:\/\\]+/g, "-");
  }
</script>

<div class="slat">
  <p>{project.name}</p>
  <button on:click={exportProject}>Export</button>
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .slat {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  p {
    flex-grow: 1;
    margin: 0;
  }
  button {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: transparent;
    @include type-style($type-token);
    color: $link-color;
  }
</style>

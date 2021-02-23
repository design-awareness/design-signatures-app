<script lang="ts">
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import BackButton from "../components/BackButton.svelte";
  import Header from "../components/type/Header.svelte";
  import { getAll } from "../data/database";

  let getProjects = () => getAll("Project");
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>All projects</Header>
    <ul>
      {#await getProjects()}
        <!-- loading placeholder? -->
        {#each [1, 2, 3, 4] as _}
          <li>
            <ProjectCard loadingPlaceholder />
          </li>
        {/each}
      {:then projects}
        {#each projects as id}
          <li>
            <a href={"#/projects/" + id}>
              <ProjectCard {id} />
            </a>
          </li>
        {/each}
      {/await}
    </ul>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  .page {
    background-color: $background-color;
    min-height: 100%;
  }
  ul {
    list-style-type: none;
    margin: 4rem 0 0 0;
    padding: 0;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }
  li {
    margin: 1rem;
    a {
      color: inherit;
      text-decoration: none;
      display: block;
      // TODO: This needs to come from the same place as wherever we get them
      // from in components/ProjectCard.
      border-radius: 3px;
      height: 12rem;
      margin-bottom: 1.5rem;
    }
  }
</style>

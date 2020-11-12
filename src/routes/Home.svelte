<script lang="ts">
  import { push } from "svelte-spa-router/Router.svelte";
  import Button from "../components/Button.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import HorizontalScrollArea from "../components/layout/HorizontalScrollArea.svelte";
  import Link from "../components/Link.svelte";
  import PageHeader from "../components/PageHeader.svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import Header from "../components/type/Header.svelte";
  import { getAll } from "../data/database";

  let projects: string[] = null;
  let loading = true;

  async function load() {
    projects = await getAll("Project");
    loading = false;
  }
  load();
</script>

<style lang="scss">
  .home {
    background-color: #e5e5e5;
    min-height: 100%;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
  }
  li {
    margin-right: 1rem;
    &:last-child {
      margin-right: 0;
    }
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

<main class="device-frame home">
  <PageHeader />

  <ContentFrame>
    <Header>Recent projects</Header>

    <HorizontalScrollArea>
      <ul>
        <li>
          <a href="#/projects/new">
            <ProjectCard newProjectPlaceholder />
          </a>
        </li>
        {#if !loading}
          {#each projects as id}
            <li>
              <a href={'#/projects/' + id}>
                <ProjectCard {id} />
              </a>
            </li>
          {/each}
        {:else}
          <li>
            <ProjectCard loadingPlaceholder />
          </li>
        {/if}
      </ul>
    </HorizontalScrollArea>

    <Button on:click={async () => console.log(await push('/projects/'))}>
      All Projects
    </Button>

    <Header>About Design Awareness</Header>
    <p>
      <Link>What does this app do?</Link>
    </p>
    <p>
      <Link>Atman's Model</Link>
    </p>
    <p>
      <Link>Design Awareness App Tutorials</Link>
    </p>
  </ContentFrame>
</main>

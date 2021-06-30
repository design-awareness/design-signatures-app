<script lang="ts">
  import { push } from "svelte-spa-router/Router.svelte";
  import Button from "../components/Button.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import HorizontalScrollArea from "../components/layout/HorizontalScrollArea.svelte";
  import Link from "../components/Link.svelte";
  import PageHeader from "../components/PageHeader.svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import Header from "../components/type/Header.svelte";
  import { getRecentProjects } from "../data/recentProjects";
</script>

<main class="device-frame home">
  <PageHeader />

  <ContentFrame>
    <Header>Recent projects</Header>

    <HorizontalScrollArea>
      <ul>
        <li>
          <a href="#/new/">
            <ProjectCard newRealtimeProjectPlaceholder />
          </a>
        </li>
        {#await getRecentProjects()}
          <li>
            <ProjectCard loadingPlaceholder />
          </li>
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
    </HorizontalScrollArea>

    <Button on:click={async () => await push("/projects/")}>
      All Projects
    </Button>

    {#if location.hostname.indexOf("design") === -1}
      <Header>Developer</Header>
      <p>
        <Link href="/dev/">Developer tools and configuration ›</Link>
      </p>
    {/if}

    <Header>About Design Awareness</Header>
    <p>
      <Link href="/about/appdo">What does this app do? ›</Link>
    </p>
    <p>
      <Link href="/about/atmans">Atman's Model ›</Link>
    </p>
    <!-- <p>
      <Link href="/">Design Awareness App Tutorials</Link>
    </p> -->
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  .home {
    background-color: $background-color;
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

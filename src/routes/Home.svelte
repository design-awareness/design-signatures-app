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
    <Header>Recent Projects</Header>

    <HorizontalScrollArea>
      <ul>
        <li>
          <a href="#/new/">
            <ProjectCard newProjectPlaceholder />
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

    <div class="button-holder">
      <Button on:click={async () => await push("/projects/")}>
        All projects
      </Button>

      <div class="reflect-button">
        <Button on:click={async () => await push("/reflect/")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440.7 470.4" class="reflect-icon">
            <path d="M84.3 334.5C-68 183.8 49.5 12.8 205.1 15.7c125.2 2.3 175 90.7 178.6 140.6.8 11.5-.8 34.2-4.5 38.3l46.6 97.2-37.2.9s4 45.4 3.2 53.8c-3.3 34-11.1 42.5-81.5 40.4l1.5 66.9H104.1v-72.9" fill="none" stroke-width="25" stroke-linecap="square" stroke-linejoin="round" stroke-miterlimit="10"/>
            <g stroke-miterlimit="10"><path d="M145.4 316.1L62.6 446 24 412.6l91-117.8c-61.5-60-42.9-140.7.3-187.2s117.2-51.3 175.1 1.3c64.1 58.3 42.2 135.5 13.7 174.1-28.8 39.1-84.5 64.8-158.7 33.1z" fill="none" stroke-width="33" stroke-linejoin="round"/>
              <path d="M121.011 279.458l36.054 26.086-99.01 136.843L22.003 416.3z" stroke-width="1.00003"/>
            </g>
          </svg>
          Reflect
        </Button>
      </div>
    </div>

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
  .button-holder {
    display: flex;
    justify-content: space-between;
  }

  .reflect-button {
    display: flex;
    justify-content: flex-end;

    .reflect-icon{
      height: 1.2rem;
      stroke: $text-primary-color;
    }
  }
</style>

<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { push } from "svelte-spa-router/Router.svelte";
  import reflectIcon from "../assets/reflectIcon";
  import Button from "../components/Button.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import HorizontalScrollArea from "../components/layout/HorizontalScrollArea.svelte";
  import Link from "../components/Link.svelte";
  import PageHeader from "../components/PageHeader.svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import Header from "../components/type/Header.svelte";
  import { getRecentProjects } from "../data/recentProjects";
  import { canInstall, isInstalled, showInstallPrompt } from "../util/pwa";

  async function install() {
    if (canInstall()) {
      if (await showInstallPrompt()) {
        location.reload();
      }
    } else {
      // TODO: direct to installation instructions page
    }
  }
</script>

<main class="device-frame home">
  <PageHeader />

  <ContentFrame>
    {#if !$isInstalled}
      <Header>Install app</Header>
      <Button on:click={install}>Install</Button>
    {/if}

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

      <Button on:click={async () => await push("/reflect/")} icon={reflectIcon}>
        Reflect
      </Button>
    </div>

    {#if location.hostname.indexOf("design") === -1}
      <Header>Developer</Header>
      <p>
        <Link href="/dev/">Developer tools and configuration ›</Link>
      </p>
    {/if}

    <Header>About Design Awareness</Header>
    <p>
      <Link href="/about/tutorials">Tutorials ›</Link>
    </p>
    <p>
      <Link href="/about/the-point">What's the point? ›</Link>
    </p>
    <p>
      <Link href="/about/research">Explore design process research ›</Link>
    </p>
    <p>
      <Link href="/about/models">Design models ›</Link>
    </p>
    <p>
      <Link href="/about/project">About this project ›</Link>
    </p>
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
</style>

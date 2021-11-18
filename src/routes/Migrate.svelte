<script lang="ts">
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Header from "../components/type/Header.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import { NEW_APP_INSTALL_URL, NEW_APP_NAME } from "../data/buildData";
  import { getAll, getProject } from "../data/database";
  import ProjectExportSlat from "../components/ProjectExportSlat.svelte";
  import Link from "../components/Link.svelte";
</script>

<main class="migrate">
  <ContentFrame>
    <Header>App Migration</Header>
    <p>
      Thank you for helping us test our app! The full version is now available
      and will need to be installed separately. We'll help you migrate your
      projects so you don't lose anything. Feel free to reach out if you're
      having trouble migrating by <a
        href="https://github.com/design-awareness/design-awareness-app/issues"
        target="_blank">opening an issue in our github repository</a
      >.
    </p>
    <p>
      <Link href="/home">Keep using this app -&gt;</Link>
    </p>
    <PageSeparator />
    <Header>Download Your Projects</Header>
    <p>
      If you want to keep any projects from this app, export them now so you can
      import them into the new app.
    </p>
    <p class="small">
      After clicking Export, you may need to choose "Save" or "Save to files" to
      save your project on your device.
    </p>
    {#await getAll("Project")}
      Loading projects…
    {:then projects}
      {#each projects as id}
        {#await getProject(id) then project}
          <ProjectExportSlat {project} />
        {/await}
      {/each}
    {/await}
    <PageSeparator />
    <Header>Install the New App</Header>
    <p>
      Install the new app, <strong>{NEW_APP_NAME}</strong>, by clicking this
      link and following the instructions:
    </p>
    <p>
      <a href={NEW_APP_INSTALL_URL} target="_blank">Install {NEW_APP_NAME}</a>
    </p>
    <PageSeparator />
    <Header>Import your Projects</Header>
    <p>
      In the new app, click the settings cog at the top right, then choose
      <em>Import a project</em>. Select one of the projects you exported in the
      earlier step, click import, and repeat for each project you want to
      import.
    </p>
    <PageSeparator />
    <Header>Delete This App</Header>
    <p>
      Once all your projects are imported into the new app, you're ready to
      delete this one! Delete the app in the usual way for your device (usually
      by long-pressing on the app icon).
    </p>
    <p>
      Make sure you're deleting this app (<strong>Design Awareness</strong>) and
      not the new one you just installed (<strong>{NEW_APP_NAME}</strong>).
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .migrate {
    background-color: $background-color;
    min-height: 100%;
    padding-top: 2rem;
  }
  .small {
    @include type-style($type-detail);
    color: $text-secondary-color;
  }
  a {
    color: $link-color;
  }
</style>

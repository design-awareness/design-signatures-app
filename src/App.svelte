<script lang="ts">
  import Router from "svelte-spa-router/Router.svelte";
  import Home from "./routes/Home.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import DBEditor from "./routes/dev/DBEditor.svelte";
  import NewProject from "./routes/NewProject.svelte";
  import ProjectDetail from "./routes/ProjectDetail.svelte";
  import AllProjects from "./routes/AllProjects.svelte";
  import AppDo from "./routes/about/AppDo.svelte";
  import Atmans from "./routes/about/Atmans.svelte";

  // create preset activity sets!
  import { presetReady } from "./data/activitySetPresets";
  import ProjectTracking from "./routes/ProjectTracking.svelte";
  import ComponentLibrary from "./routes/dev/ComponentLibrary.svelte";
  presetReady; // noop, but keeps the linter happy :)

  const routes: object = {
    "/": Home, // Home

    "/projects/": AllProjects, // Projects
    "/projects/new/": NewProject, // New project
    "/projects/:id/": ProjectDetail, // Project detail
    "/projects/:id/track/*": ProjectTracking, // Project tracking

    "/about/": NotFound, // About design awareness
    "/about/appdo": AppDo, // What does this app do?
    "/about/atmans": Atmans,

    "/dev/component-library/": ComponentLibrary, // Component library
    "/dev/dbeditor/": DBEditor, // Database editor

    "*": NotFound, // Not found
  };
</script>

<style lang="scss">
  @import "styles/colors";
  @import "styles/tokens";
  @import "styles/type";

  :global(:root) {
    @include color-theme-light;
    @media (prefers-color-scheme: dark) {
      @include color-theme-dark;
    }
  }

  :global(body) {
    @include type-style($type-body);
    background-color: $background-color;
    color: $text-primary-color;
  }
</style>

<Router {routes} />

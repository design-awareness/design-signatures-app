<script lang="ts">
  import AllProjects from "./routes/AllProjects.svelte";
  import AppDo from "./routes/about/AppDo.svelte";
  import Atmans from "./routes/about/Atmans.svelte";
  import ComponentLibrary from "./routes/dev/ComponentLibrary.svelte";
  import DBEditor from "./routes/dev/DBEditor.svelte";
  import DevTools from "./routes/dev/DevTools.svelte";
  import Home from "./routes/Home.svelte";
  import NewProject from "./routes/NewProject.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import ProjectDetail from "./routes/ProjectDetail.svelte";
  import ProjectExport from "./routes/ProjectExport.svelte";
  import ProjectTracking from "./routes/ProjectTracking.svelte";
  import RedirectAddPath from "./routes/RedirectAddPath.svelte";
  import Router from "svelte-spa-router/Router.svelte";
  import Settings from "./routes/Settings.svelte";
  import Update from "./routes/Update.svelte";
  import { createPresets } from "./data/activitySetPresets";
  import { awaitObjectUpgradeIfNeeded } from "./data/upgradeObjects";

  awaitObjectUpgradeIfNeeded();
  createPresets(); // noop, but keeps the linter happy :)

  const routes: object = {
    "/": Home, // Home

    "/projects/": AllProjects, // Projects
    "/projects/new/*": NewProject, // New project
    "/projects/new": RedirectAddPath,
    "/projects/:id/": ProjectDetail, // Project detail
    "/projects/:id/export": ProjectExport,
    "/projects/:id/track/*": ProjectTracking, // Project tracking
    "/projects/:id/track": RedirectAddPath,

    "/about/": NotFound, // About design awareness
    "/about/appdo": AppDo, // What does this app do?
    "/about/atmans": Atmans,

    "/settings/": Settings, // Settings

    "/update/:n": Update,

    "/dev/": DevTools,
    "/dev/dbeditor/": DBEditor, // Database editor
    "/dev/component-library/*": ComponentLibrary, // Component library
    "/dev/component-library": RedirectAddPath,

    "*": NotFound, // Not found
  };
</script>

<Router {routes} />

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

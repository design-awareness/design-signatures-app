<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Router from "svelte-spa-router/Router.svelte";
  import { createPresets } from "./data/designModelPresets";
  import { awaitObjectUpgradeIfNeeded } from "./data/upgradeObjects";
  import AboutProject from "./routes/about/AboutProject.svelte";
  import AllProjects from "./routes/AllProjects.svelte";
  import ComponentLibrary from "./routes/dev/ComponentLibrary.svelte";
  import DBEditor from "./routes/dev/DBEditor.svelte";
  import DevTools from "./routes/dev/DevTools.svelte";
  import Home from "./routes/Home.svelte";
  import Import from "./routes/Import.svelte";
  import Models from "./routes/about/Models.svelte";
  import NewAsyncProject from "./routes/NewAsyncProject.svelte";
  import NewProjectType from "./routes/NewProjectType.svelte";
  import NewRealtimeProject from "./routes/NewRealtimeProject.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Project from "./routes/ProjectDetail.svelte";
  import ProjectExport from "./routes/ProjectExport.svelte";
  import ProjectTracking from "./routes/ProjectTracking.svelte";
  import RedirectAddPath from "./routes/RedirectAddPath.svelte";
  import ReflectionQuestions from "./routes/ReflectionQuestions.svelte";
  import Research from "./routes/about/Research.svelte";
  import Settings from "./routes/Settings.svelte";
  import ThePoint from "./routes/about/ThePoint.svelte";
  import Tutorials from "./routes/about/Tutorials.svelte";
  import Update from "./routes/Update.svelte";

  awaitObjectUpgradeIfNeeded();
  createPresets(); // noop, but keeps the linter happy :)

  const routes: object = {
    "/": Home, // Home

    "/new/realtime/*": NewRealtimeProject,
    "/new/realtime": RedirectAddPath,
    "/new/async/*": NewAsyncProject,
    "/new/async": RedirectAddPath,
    "/new/": NewProjectType,
    "/new": RedirectAddPath,

    "/projects/": AllProjects, // Projects
    "/projects": RedirectAddPath, // Projects
    "/projects/:id/": Project, // Project detail
    "/projects/:id": RedirectAddPath,
    "/projects/:id/export": ProjectExport,
    "/projects/:id/track/*": ProjectTracking, // Project tracking
    "/projects/:id/track": RedirectAddPath,

    "/reflect/": ReflectionQuestions, //Reflection Qs
    "/reflect": RedirectAddPath,

    "/import/": Import,
    "/import": RedirectAddPath,

    "/about/": NotFound, // About design awareness
    "/about/tutorials": Tutorials, // Tutorials
    "/about/thepoint": ThePoint, // Whats the point?
    "/about/research": Research, // Explore design process research
    "/about/models": Models, //Design Models
    "/about/project": AboutProject, //About this Project (+ team bio)

    "/settings/": Settings, // Settings
    "/settings": RedirectAddPath, // Settings

    "/update/:n": Update,

    "/dev/": DevTools,
    "/dev": RedirectAddPath,
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

  :global(:focus) {
    outline: none;
    box-shadow: 0 0 0 2px rgb(34, 154, 235);
  }

  @supports #{"selector(:focus-visible)"} {
    :global(:focus) {
      box-shadow: none;
    }
    :global(:focus-visible) {
      outline: none;
      box-shadow: 0 0 0 2px rgb(34, 154, 235);
    }
  }
</style>

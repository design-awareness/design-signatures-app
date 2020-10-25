<script lang="ts">
  import Router from "svelte-spa-router/Router.svelte";

  import Home from "./routes/Home.svelte";
  import NotFound from "./routes/NotFound.svelte";

  import DBEditor from "./routes/dev/DBEditor.svelte";

  const routes: object = {
    "/": Home, // Home

    "/projects/": Home, // Projects
    "/projects/new/": Home, // New project
    "/projects/:id/": Home, // Project detail
    "/projects/:id/track/": Home, // Project tracking

    "/about/": Home, // About design awareness

    "/dev/component-library/": Home, // Component library
    "/dev/dbeditor/": DBEditor, // Database editor
    "/dev/codethemes/": Home, // Theme preview

    "*": NotFound, // Not found
  };
</script>

<Router {routes} />

<script lang="ts">
  import { replace } from "svelte-spa-router/Router.svelte";

  import BackButton from "../components/BackButton.svelte";
  import Button from "../components/Button.svelte";
  import InvisibleButton from "../components/InvisibleButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Link from "../components/Link.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import { ACTIVITY_SET_WELL_KNOWN_PREFIX } from "../data/activitySetPresets";
  import { BRANCH, BUILD_ENV, BUILD_TIME, VERSION } from "../data/buildData";
  import { getDesignModel, getAll, getRealtimeProject } from "../data/database";
  import type { DesignModel } from "../data/schema";

  async function resetWKAS() {
    if (confirm("Are you sure? Built-in activity sets will be recreated.")) {
      const activitySets = await getAll("DesignModel");
      await Promise.all(
        activitySets.map(async (asid) => {
          if (asid.startsWith(ACTIVITY_SET_WELL_KNOWN_PREFIX)) {
            const as = await getDesignModel(asid);
            if (as) await as.remove();
          }
        })
      );
      alert("Reset complete.");
      location.reload();
    }
  }

  async function deleteUnusedAS() {
    const setsToRemove = new Set<DesignModel>(
      await getAll("DesignModel").then((ids) =>
        Promise.all(ids.map((id) => getDesignModel(id)))
      )
    );
    const projects = await getAll("RealtimeProject").then((ids) =>
      Promise.all(ids.map((id) => getRealtimeProject(id)))
    );
    projects.forEach(({ designModel }) => setsToRemove.delete(designModel));
    const sets = Array.from(setsToRemove.values());
    if (!sets.length) {
      alert("No unused activity sets to delete.");
    }
    if (
      confirm(
        "The following unused activity sets will be deleted:\n" +
          sets.map((set) => " - " + set.name).join("\n") +
          "\nBuilt-in activity sets will be restored."
      )
    ) {
      await Promise.all(sets.map((set) => set.remove()));
      alert("Done.");
      location.reload();
    }
  }

  async function update() {
    if (!navigator.onLine) {
      alert(
        "Your device doesn't seem to be online.\nConnect to a network and try again."
      );
    } else {
      await replace("/update/3");
    }
  }

  let tapCount = 0;
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Settings</Header>

    <SectionHeader>Activity sets</SectionHeader>
    <p>
      <Button small on:click={deleteUnusedAS}>
        Remove unused activity sets
      </Button>
    </p>
    <p>
      <Button small on:click={resetWKAS}>Reset built-in activity sets</Button>
    </p>

    {#if BUILD_ENV !== "prod" || tapCount > 4}
      <SectionHeader>Developer</SectionHeader>
      <p>
        <Link href="/dev/">Developer tools</Link>
      </p>
    {/if}

    <SectionHeader>About app</SectionHeader>
    <p class="small">
      <strong>Version:</strong>
      <InvisibleButton on:click={() => tapCount++}>{VERSION}</InvisibleButton>
      <br /><strong>Last built:</strong>
      {new Date(BUILD_TIME).toLocaleString()}
      <br /><strong>Build environment:</strong>
      {{ dev: "Development", stage: "Staging", prod: "Production" }[BUILD_ENV]}
      {#if BUILD_ENV !== "prod" && BRANCH}
        <br /><strong>Branch:</strong>
        {BRANCH}
      {/if}
    </p>
    <p>
      <Button small on:click={update}>Force update and reload</Button>
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  .page {
    background-color: $background-color;
    min-height: 100%;
  }
  .small {
    font-size: 0.8em;
    :global(button) {
      display: inline-block;
      width: auto;
    }
  }
</style>

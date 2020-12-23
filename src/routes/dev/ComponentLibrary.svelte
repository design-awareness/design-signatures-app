<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import ActivityToggleDemo from "./ComponentLibrary/ActivityToggleDemo.svelte";

  export let params: { wild: string };

  let components = {
    "activity-toggle": ActivityToggleDemo,
  };
</script>

{#if !params.wild}
  <ContentFrame>
    <BackButton href="/dev/" />
    <Header>Component library</Header>
    <ul>
      <li>
        <Link href="/dev/component-library/activity-toggle">
          ActivityToggle
        </Link>
      </li>
    </ul>
  </ContentFrame>
{:else}
  <svelte:component this={components[params.wild.replace('/', '')]} />
{/if}

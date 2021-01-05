<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import ActivityToggleDemo from "./ComponentLibrary/ActivityToggleDemo.svelte";
  import PopupMenuDemo from "./ComponentLibrary/PopupMenuDemo.svelte";

  export let params: { wild: string };

  let components = {
    "activity-toggle": ActivityToggleDemo,
    "popup-menu": PopupMenuDemo,
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
      <li>
        <Link href="/dev/component-library/popup-menu">PopupMenu</Link>
      </li>
    </ul>
  </ContentFrame>
{:else}
  <svelte:component this={components[params.wild.replace('/', '')]} />
{/if}

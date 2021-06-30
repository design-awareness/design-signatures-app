<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import ActivityToggleDemo from "./ComponentLibrary/ActivityToggleDemo.svelte";
  import CanvasDemo from "./ComponentLibrary/CanvasDemo.svelte";
  import CheckboxDemo from "./ComponentLibrary/CheckboxDemo.svelte";
  import ModalDemo from "./ComponentLibrary/ModalDemo.svelte";
  import PopupMenuDemo from "./ComponentLibrary/PopupMenuDemo.svelte";
  import SegmentedSelectorDemo from "./ComponentLibrary/SegmentedSelectorDemo.svelte";

  export let params: { wild: string };

  let components: Record<string, any> = {
    "activity-toggle": ActivityToggleDemo,
    canvas: CanvasDemo,
    checkbox: CheckboxDemo,
    modal: ModalDemo,
    "popup-menu": PopupMenuDemo,
    "segmented-selector": SegmentedSelectorDemo,
  };
</script>

{#if !params.wild}
  <ContentFrame>
    <BackButton href="/dev/" />
    <Header>Component library</Header>
    <ul>
      {#each Object.entries(components) as [slug, component]}
        <li>
          <Link href="/dev/component-library/{slug}">
            {component.name.replace("Demo", "")} ({slug})
          </Link>
        </li>
      {/each}
    </ul>
  </ContentFrame>
{:else}
  <svelte:component this={components[params.wild.replace("/", "")]} />
{/if}

<script lang="ts">
  import type { null_to_empty } from "svelte/internal";
  import ActivityEditor from "../../../components/ActivitySet/ActivityEditor.svelte";
  import BackButton from "../../../components/BackButton.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import PopupMenu from "../../../components/PopupMenu.svelte";
  import Header from "../../../components/type/Header.svelte";
  import SectionHeader from "../../../components/type/SectionHeader.svelte";

  import editIcon from "@iconify-icons/ic/baseline-edit";
  import compareIcon from "@iconify-icons/ic/baseline-compare-arrows";
  import completeIcon from "@iconify-icons/ic/baseline-check";
  import exportIcon from "@iconify-icons/ic/baseline-share";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
</script>

<style lang="scss">
  .right {
    display: flex;
    justify-content: flex-end;
  }
</style>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>PopupMenu</Header>
  <p>
    <PopupMenu
      label="Actions"
      descriptor={[{ label: 'Option 1', action: () => alert('option 1!') }, { label: 'Option 2', action: () => alert('option 2!') }, { label: 'Option 3, then a separator:', action: () => alert('option 3!') }, { label: null, action: null, separator: true }, { label: 'Danger option', action: () => alert('danger!'), class: 'danger' }, { label: "Long label that's really, really long", action: () => alert('long label!') }]} />
  </p>
  <p class="right">
    <PopupMenu
      label="Right aligned"
      alignment="right"
      descriptor={[{ label: 'Long long item with a long title', action: () => alert('long item') }]} />
  </p>
  <p>
    <PopupMenu
      label="With icons"
      descriptor={[{ label: 'Edit', icon: editIcon, action: () => {} }, { label: 'Compare', icon: compareIcon, action: () => {} }, { label: 'Mark as completed', icon: completeIcon, action: () => {} }, { label: 'Export', icon: exportIcon, action: () => {} }, { separator: true, label: null, action: null }, { label: 'Delete', icon: deleteIcon, class: 'danger', action: () => {} }]} />
  </p>
  <!-- <hr />
  <SectionHeader>Bindings</SectionHeader>
  <p><code>checked</code> <input type="checkbox" bind:checked /></p>
  <SectionHeader>Props</SectionHeader>
  <p><code>color</code> <input type="color" bind:value={color} /></p>
  <p><code>activityName</code> <input type="text" bind:value={name} /></p> -->
</ContentFrame>

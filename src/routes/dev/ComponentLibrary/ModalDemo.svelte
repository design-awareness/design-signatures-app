<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import BackButton from "../../../components/BackButton.svelte";
  import Button from "../../../components/Button.svelte";
  import InvisibleButton from "../../../components/InvisibleButton.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import Modal from "../../../components/Modal.svelte";
  import Header from "../../../components/type/Header.svelte";
  import SectionHeader from "../../../components/type/SectionHeader.svelte";

  let title = "Title";
  let status = "Status";
  let visible = false;
  let closeWithScrim = true;
  let maxWidth = false;
  let h = 100;
  let twoButtons = false;

  let button = { label: "Button", onClick: () => alert("clicked button") };
</script>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>Modal</Header>
  <p>
    <Button on:click={() => (visible = true)}>Show modal</Button>
  </p>
  <p>content height <input type="number" bind:value={h} /></p>
  <p>two buttons <input type="checkbox" bind:checked={twoButtons} /></p>
  <hr />
  <SectionHeader>Bindings</SectionHeader>
  <p><code>visible</code> <input type="checkbox" bind:checked={visible} /></p>
  <SectionHeader>Props</SectionHeader>
  <p><code>title</code> <input type="text" bind:value={title} /></p>
  <p><code>status</code> <input type="text" bind:value={status} /></p>
  <p>
    <code>closeWithScrim</code>
    <input type="checkbox" bind:checked={closeWithScrim} />
  </p>
  <p><code>maxWidth</code> <input type="checkbox" bind:checked={maxWidth} /></p>
  <Modal
    bind:visible
    {status}
    {title}
    {closeWithScrim}
    {maxWidth}
    buttons={twoButtons ? [button, button] : [button]}
  >
    <div style="height: {h}px; background-color:lightgrey; padding: 1rem;">
      content
      <InvisibleButton on:click={() => (visible = false)}>
        <span style="color:blue;">close</span>
      </InvisibleButton>
    </div>
  </Modal>
</ContentFrame>

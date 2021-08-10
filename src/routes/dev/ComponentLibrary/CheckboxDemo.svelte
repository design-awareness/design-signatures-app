<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script type="ts">
  import BackButton from "../../../components/BackButton.svelte";
  import Checkbox from "../../../components/Checkbox.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import Header from "../../../components/type/Header.svelte";
  import SectionHeader from "../../../components/type/SectionHeader.svelte";
</script>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>Checkbox</Header>

  <SectionHeader>Label only</SectionHeader>
  <Checkbox label="Toggleable option" />

  <SectionHeader>Label and help text</SectionHeader>
  <Checkbox
    label="Single activity mode"
    helptext="In this mode, only one activity can be active at a time. This help text is super long so it wraps around to the next line."
  />
</ContentFrame>

<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script type="ts">
  import ActivityToken from "../../../components/ActivityToken.svelte";

  import BackButton from "../../../components/BackButton.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import SegmentedSelector from "../../../components/SegmentedSelector.svelte";
  import SegmentedComponentSelector from "../../../components/SegmentedComponentSelector.svelte";
  import Header from "../../../components/type/Header.svelte";
  import RichLabel from "../../../components/RichLabel.svelte";

  let value1: string | null = null;
  let value2: string | null = null;
  let value3: string | null = null;
  let value4: string | null = null;
</script>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>SegmentedSelector</Header>

  <p>
    <SegmentedSelector
      label="text only (horizontal)"
      options={[
        [0, "option 0"],
        [1, "option 1"],
        [2, "option 2"],
      ]}
      bind:value={value1}
    />
    <button on:click={() => (value1 = null)}>clear</button>
    <strong>Value: {value1}</strong>
  </p>

  <p>
    <SegmentedSelector
      label="text only (vertical)"
      direction="vertical"
      options={[
        [0, "option 0"],
        [1, "option 1"],
        [2, "option 2"],
      ]}
      bind:value={value2}
    />
    <button on:click={() => (value2 = null)}>clear</button>
    <strong>Value: {value2}</strong>
  </p>

  <p>
    <SegmentedComponentSelector
      label="component content"
      component={ActivityToken}
      options={[
        ["token0", { code: "OPT0", color: ["000000", "FFFFFF"] }],
        ["token1", { code: "OPT1", color: ["000000", "FFFFFF"] }],
        ["token2", { code: "OPT2", color: ["000000", "FFFFFF"] }],
      ]}
      bind:value={value3}
    />
    <button on:click={() => (value3 = null)}>clear</button>
    <strong>Value: {value3}</strong>
  </p>

  <p>
    <RichLabel label="small (in label)">
      <SegmentedSelector
        options={[
          [0, "option 0"],
          [1, "option 1"],
          [2, "option 2"],
        ]}
        bind:value={value4}
        inlabel
      />
    </RichLabel>
    <button on:click={() => (value4 = null)}>clear</button>
    <strong>Value: {value4}</strong>
  </p>
</ContentFrame>

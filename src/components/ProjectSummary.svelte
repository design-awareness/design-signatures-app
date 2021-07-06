<script lang="ts">
  import type { DesignModel } from "../data/schema";
  import { expressiveDurationM } from "../util/time";
  import type { Bar } from "./BarChart.svelte";
  import BarGraph from "./BarChart.svelte";
  import RichLabel from "./RichLabel.svelte";
  import SegmentedSelector from "./SegmentedSelector.svelte";
  import Header from "./type/Header.svelte";

  export let designModel: DesignModel;
  export let chartData: number[];
  export let count: number;
  export let countLabel: string;
  export let firstLast: [string, string];
  export let firstLastType: string;

  let chartMode: "raw" | "percent" = "raw";

  let bars: Bar[];
  let total: number;
  $: {
    if (chartMode === "percent") {
      total = chartData.reduce((a, b) => a + b, 0);
    }
    bars = chartData.map((value, i) => ({
      value,
      color: designModel.activities[i].color,
      label: designModel.activities[i].code,
      valueStr:
        chartMode === "raw"
          ? expressiveDurationM(value)
          : `${Math.round((100 * value) / total)}%`,
    }));
  }
</script>

<Header>Project Summary</Header>
<RichLabel label="Overview" />

<div class="overview">
  <div class="overview-stat total">
    <div class="overview-value">{count}</div>
    <div class="overview-label">{countLabel}</div>
  </div>
  <div class="overview-stat">
    <div class="overview-value">{firstLast[0]}</div>
    <div class="overview-label">First {firstLastType}</div>
  </div>
  <div class="overview-stat">
    <div class="overview-value">{firstLast[1]}</div>
    <div class="overview-label">Last {firstLastType}</div>
  </div>
</div>

<RichLabel label="Total activity times">
  <SegmentedSelector
    inlabel
    options={[
      ["raw", "Absolute"],
      ["percent", "Percent"],
    ]}
    bind:value={chartMode}
  />
</RichLabel>
<BarGraph {bars} />

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .overview {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    &-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
    }
    &-value {
      @include type-style($type-header);
      color: $text-primary-color;
    }
    &-label {
      @include type-style($type-detail);
      color: $text-secondary-color;
    }
  }
</style>

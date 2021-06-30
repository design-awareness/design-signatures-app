<script lang="ts">
  import SegmentedComponentSelector from "./SegmentedComponentSelector.svelte";
  import TextRenderer from "./TextRenderer.svelte";

  type Options = string | number;

  export let direction: "horizontal" | "vertical" = "horizontal";
  export let options: [Options, string][];
  export let value: Options | null;
  export let label: string | undefined = undefined;
  export let inlabel: boolean | undefined = undefined;
  export let fullWidth: boolean | undefined = undefined;
</script>

<SegmentedComponentSelector
  component={TextRenderer}
  bind:value
  options={options.map(([option, text]) => [option, { text }])}
  {direction}
  {label}
  {inlabel}
  {fullWidth}
/>

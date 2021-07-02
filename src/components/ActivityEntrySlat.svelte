<script lang="ts">
  import infoIcon from "@iconify-icons/ic/baseline-info";
  import editIcon from "@iconify-icons/ic/baseline-edit";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import type { DesignModel } from "../data/schema";
  import InvisibleButton from "./InvisibleButton.svelte";
  import InputField from "./InputField.svelte";

  export let activity: DesignModel["activities"][0];
  export let value: number;
  export let note: string;
  export let entryMode: "raw" | "percent";

  let inputUnit: string;
  $: inputUnit = entryMode === "raw" ? "hrs" : "%";

  let showInfo = false;
  let showNote = false;

  export let isTotalRow = false;
  export let isTotalDisabled = false;
</script>

<div
  class="slat"
  class:totalRow={isTotalRow}
  style="--activity-color-light: #{activity
    .color[0]}; --activity-color-dark: #{activity.color[1]}"
>
  <div class="slat-row">
    {#if !isTotalRow}
      <InvisibleButton on:click={() => (showInfo = !showInfo)}>
        <div class="icon infoIcon">
          <Icon icon={infoIcon} />
        </div>
      </InvisibleButton>
      <div class="name">{activity.name}</div>
    {:else}
      <div class="name totalLabel">Total time:</div>
    {/if}

    <input
      type="number"
      bind:value
      on:blur
      disabled={isTotalDisabled}
      min={0}
    />
    <div class="inputUnit">{inputUnit}</div>
    {#if !isTotalRow}
      <InvisibleButton on:click={() => (showNote = !showNote)}>
        <div class="icon editIcon" class:active={showNote || note}>
          <Icon icon={editIcon} />
        </div>
      </InvisibleButton>
    {/if}
  </div>
  {#if showInfo}
    <div class="slat-row description">
      <p>{activity.description || "No description for this activity."}</p>
    </div>
  {/if}
  {#if showNote}
    <div class="slat-row note">
      <InputField
        on:blur
        large
        bind:value={note}
        label=""
        placeholder={`Add a note about "${activity.name}"`}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";
  @import "src/styles/type";

  .slat {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    width: 100%;
    box-sizing: border-box;

    &-row {
      display: flex;
      align-items: center;
    }

    --activity-color: var(--activity-color-light);
    @media (prefers-color-scheme: dark) {
      --activity-color: var(--activity-color-dark);
    }

    position: relative;
    border-left: 8px solid var(--activity-color);
    margin-bottom: math.div($activity-slat-spacing, 2);
    padding: $activity-slat-padding-vertical $activity-slat-right-padding
      $activity-slat-padding-vertical $activity-slat-accent-spacing;

    &.totalRow {
      border-left-color: transparent;
      padding-right: 2rem + $activity-slat-right-padding;
    }

    :global(button) {
      flex: 0;
      display: flex;
      padding: 0.25rem;
      &:not(:last-child) {
        margin-right: $activity-slat-icon-text-spacing;
      }
    }

    .name {
      flex: 1;
      width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin: 0 0.5rem 0 0;
    }
    .totalLabel {
      text-align: right;
    }

    .icon {
      font-size: 1.5rem;
      display: contents;
      color: var(--activity-color);
    }
    .editIcon:not(.active) {
      color: $text-secondary-color;
    }
    input {
      width: 2.5rem;
      @include type-style($type-input);
      appearance: none;
      color: $text-primary-color;
      background: $input-background-color;
      border: $input-border-size solid $input-border-color;
      border-radius: $input-border-radius;
      padding: math.div($input-padding-vertical, 2)
        math.div($input-padding-horizontal, 2);
      text-align: right;
      &:disabled {
        border-color: transparent;
        background-color: transparent;
      }
    }
    .inputUnit {
      @include type-style($type-input);
      color: $text-secondary-color;
      margin: 0 0.25rem;
      width: 1.5rem;
    }
  }
  .note {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .description p {
    color: $text-secondary-color;
    @include type-style($type-detail);
    margin: 0;
  }
</style>

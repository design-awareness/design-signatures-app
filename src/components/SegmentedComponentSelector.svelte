<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import type { ComponentConstructor } from "../types/ComponentConstructor";
  import { randomID } from "../util/id";

  type InnerComponentType = $$Generic<SvelteComponent>;
  type Options = string | number;

  export let component: ComponentConstructor<InnerComponentType>;
  export let direction: "horizontal" | "vertical" = "horizontal";
  export let options: [Options, InnerComponentType["$$"]["props"]][];
  export let value: Options | null;
  export let label: string = "";
  export let inlabel: boolean = false;
  export let fullWidth: boolean = false;

  let idPrefix = randomID();
</script>

{#if label}
  <div class="label">{label}</div>
{/if}
<div class="selector dir-{direction}" class:inlabel class:fullWidth>
  {#each options as [optionValue, optionProps], i}
    <input
      id="{idPrefix}__{i}"
      name={idPrefix}
      type="radio"
      bind:group={value}
      value={optionValue}
    />
    <label for="{idPrefix}__{i}">
      <svelte:component this={component} {...optionProps} />
    </label>
  {/each}
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .label {
    @include type-style($type-input-label);
    margin: $block-vertical-spacing 0 $input-spacing-inner 0;
  }
  .selector {
    display: flex;

    > label {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.01px;
      border: $segmented-selector-border-size solid
        $segmented-selector-border-color;
      background-color: $segmented-selector-background-color;
      padding: $segmented-selector-padding;
      @include type-style($type-segmented-selector);
    }
    &.inlabel > label {
      @include type-style($type-segmented-selector-inlabel);
      $height: rem(map-get($type-segmented-selector-inlabel, height));
      line-height: calc(#{$height} - #{2 * $segmented-selector-border-size});
      padding: 0 $segmented-selector-padding-inlabel-horizontal;
    }
    > input:checked + label {
      background-color: $segmented-selector-selected-color;
    }

    &.fullWidth > label {
      flex-grow: 1;
    }

    &.dir-horizontal {
      flex-direction: row;
      > label {
        border-right-width: 0;
        &:first-of-type {
          border-top-left-radius: $input-border-radius;
          border-bottom-left-radius: $input-border-radius;
        }
        &:last-of-type {
          border-right-width: $segmented-selector-border-size;
          border-top-right-radius: $input-border-radius;
          border-bottom-right-radius: $input-border-radius;
        }
      }
      // include all borders when focused
      > input:focus + label {
        border-right-width: $segmented-selector-border-size;
        + input + label {
          border-left-width: 0;
        }
      }
    }
    &.dir-vertical {
      flex-direction: column;
      > label {
        border-bottom-width: 0;
        &:first-of-type {
          border-top-left-radius: $input-border-radius;
          border-top-right-radius: $input-border-radius;
        }
        &:last-of-type {
          border-bottom-width: $segmented-selector-border-size;
          border-bottom-left-radius: $input-border-radius;
          border-bottom-right-radius: $input-border-radius;
        }
      }
      // include all borders when focused
      > input:focus + label {
        border-bottom-width: $segmented-selector-border-size;
        + input + label {
          border-top-width: 0;
        }
      }
    }

    > input {
      width: 0;
      height: 0;
      margin: 0;
      outline: 0;

      &:focus,
      &:focus-visible {
        box-shadow: none;
      }

      &:focus + label {
        box-shadow: $focus-ring;
        z-index: 2;
      }

      @supports #{"selector(:focus-visible)"} {
        &:focus + label {
          box-shadow: none;
        }
        &:focus-visible + label {
          box-shadow: $focus-ring;
        }
      }
    }
  }
</style>

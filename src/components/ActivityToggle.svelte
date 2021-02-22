<script lang="ts">
  export let checked: boolean;
  export let activityName: string;

  const id = Math.random().toString(36).substr(2, 8);
</script>

<div class="container">
  <!-- svelte-ignore empty-block -->
  {#if true}{/if}
  <input type="checkbox" bind:checked {id} />
  <label for={id} aria-label="Toggle {activityName}">
    <div role="presentation" class="toggle">
      <div class="thumb" />
      <div class="background" />
    </div>
  </label>
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .container {
    display: block;
    width: $activity-toggle-width;
    height: $activity-toggle-height;
    position: relative;
  }

  input {
    pointer-events: none;
    width: 0;
    height: 0;
    opacity: 0;
  }

  .toggle {
    position: absolute;
    left: 0;
    top: 0;
    width: $activity-toggle-width;
    height: $activity-toggle-height;
    box-sizing: border-box;
    border-radius: $activity-toggle-height/2;
    border: $activity-toggle-border-width solid;
    box-shadow: 0 0 0 0 getvar(activity-color);
    transition: box-shadow $activity-toggle-transition-speed/2;
    z-index: 1;
    &::before,
    &::after {
      position: absolute;
      top: calc(50% - #{rem(map-get($type-activity-toggle-on, size)) / 2});
      transition: opacity $activity-toggle-transition-speed;
    }
    &::before {
      content: "on";
      @include type-style($type-activity-toggle-on);
      left: $activity-toggle-text-padding;
      color: $text-opposing-color;
      opacity: 0;
    }
    &::after {
      content: "off";
      @include type-style($type-activity-toggle-off);
      right: $activity-toggle-text-padding;
      color: $text-primary-color;
      opacity: 1;
    }
    .background {
      position: absolute;
      left: -$activity-toggle-border-width;
      top: -$activity-toggle-border-width;
      width: $activity-toggle-width;
      height: $activity-toggle-height;
      border-radius: $activity-toggle-height/2;
      background: getvar(activity-color);
      opacity: 0;
      transition: opacity $activity-toggle-transition-speed;
      pointer-events: none;
      z-index: -1;
    }
    .thumb {
      $size: calc(
        #{$activity-toggle-height} - #{2 * $activity-toggle-border-width} - #{2 *
          $activity-toggle-thumb-padding}
      );
      $offset: $activity-toggle-thumb-padding;
      width: $size;
      height: $size;
      border-radius: calc(#{$size}/ 2);
      position: absolute;
      left: $offset;
      top: $offset;
      background-color: $activity-toggle-neutral-color;
      transform: translateX(0);
      transition: transform $activity-toggle-transition-speed;
    }
  }

  input:focus + label .toggle {
    box-shadow: 0 0 0 2px getvar(activity-color);
  }
  // @supports with selectors is pretty new, but will
  // avoid showing focus rings without keyboard focus
  // (native focus behavior) in modern browsers.
  // preferring this over using :focus-visible
  // unconditionally to avoid no focus rings in old
  // browsers that don't support :focus-visible
  // (how likely is this?)
  @supports #{"selector(:focus-visible)"} {
    input:focus + label .toggle {
      box-shadow: 0 0 0 0 getvar(activity-color);
    }
    input:focus-visible + label .toggle {
      box-shadow: 0 0 0 2px getvar(activity-color);
    }
  }

  input:checked + label .toggle {
    &::before {
      opacity: 1;
    }
    &::after {
      opacity: 0;
    }
    border-color: getvar(activity-color);
    .thumb {
      transform: translateX(
        calc(#{$activity-toggle-width} - #{$activity-toggle-height})
      );
      background-color: $text-opposing-color;
      opacity: 0.85;
    }
    .background {
      opacity: 1;
    }
  }
</style>

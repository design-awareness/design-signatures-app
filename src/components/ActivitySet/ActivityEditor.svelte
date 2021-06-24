<script type="ts">
  import down from "@iconify-icons/ic/baseline-arrow-drop-down";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
  import dragIcon from "@iconify-icons/ic/baseline-drag-indicator";
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import type { DesignModel } from "../../data/schema";
  import abbreviateActivityName from "../../util/activityCode";
  import ActivityToken from "../ActivityToken.svelte";
  import InputField from "../InputField.svelte";
  import InvisibleButton from "../InvisibleButton.svelte";
  import Modal from "../Modal.svelte";
  import ColorPicker from "./ColorPicker.svelte";

  // FIXME: it would be nice to expose this Activity type directly in schema
  // with necessary modifications for convenience, instead of getting it like
  // this.
  type Activity = DesignModel["activities"][0];

  export let activity: Activity;
  export let remove: () => void;
  export let isModalOpen: boolean;
  export let openModal: () => void;
  export let closeModal: () => void;

  function setCode(e: Event) {
    activity.code = abbreviateActivityName(
      (e.target as HTMLInputElement).value
    );
  }

  $: if (activity.code.length > 5) {
    activity.code = activity.code.substr(0, 5);
  }

  // dragging!
  export let dragDisabled: boolean;
  function startDrag(e: Event) {
    // preventing default to prevent lag on touch devices
    // (because of the browser checking for screen scrolling)
    e.preventDefault();
    dragDisabled = false;
  }
  function handleKeyDown(e: KeyboardEvent) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled) {
      dragDisabled = false;
    }
  }
</script>

<div class="item">
  <div
    class="drag-handle"
    tabindex={dragDisabled ? 0 : -1}
    aria-label="drag-handle"
    style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
    on:mousedown={startDrag}
    on:touchstart={startDrag}
    on:keydown={handleKeyDown}
  >
    <Icon icon={dragIcon} />
  </div>
  <input bind:value={activity.name} on:input={setCode} />
  <InvisibleButton on:click={openModal}>
    <ActivityToken fixWidth color={activity.color} code={activity.code} />
    <Icon icon={down} />
  </InvisibleButton>
  <InvisibleButton on:click={remove}>
    <div class="remove">
      <Icon icon={deleteIcon} />
    </div>
  </InvisibleButton>

  <Modal
    visible={isModalOpen}
    title={activity.name}
    buttons={[{ label: "Done", onClick: closeModal }]}
    on:close={closeModal}
  >
    <InputField
      label="Activity code"
      bind:value={activity.code}
      maxlength="5"
      style="text-transform: uppercase"
    />
    <ColorPicker bind:color={activity.color} />
    <InputField large label="Description" bind:value={activity.description} />
  </Modal>
</div>

<style lang="scss">
  @use "sass:math";
  @import "src/styles/tokens";
  @import "src/styles/type";

  %flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @function h($n) {
    @return math.div($n, 2);
  }

  .item {
    display: flex;
    align-items: stretch;
    width: 100%;
    .drag-handle {
      $m: -(h($input-spacing-inner));
      margin: $m 0 $m $m;
      width: 2rem;
      flex: 0 0 2rem;
      position: relative;
      font-size: 1.25rem;
      @extend %flex-center;
      color: $text-ghost-color;
    }
    input {
      @include type-style($type-input);
      min-width: 0;
      flex: 1 0 2rem;
      padding: h($input-padding-vertical) h($input-padding-horizontal)
        calc(#{h($input-padding-vertical)} - #{$input-border-size})
        h($input-padding-horizontal);
      border: 0 solid $input-border-color;
      border-width: 0 0 $input-border-size 0;
      border-radius: 0.01px;

      // a forced fix for input field bg and text color for dark mode - idk if this is best practice - KJ
      background-color: $input-background-color;
      color: $text-primary-color;
    }
    :global(button) {
      flex: 0 0;
      margin: 0 0 0 $input-spacing-inner;
      @extend %flex-center;
      color: $text-ghost-color;
    }
    .remove {
      @extend %flex-center;
      padding: 0 0.25rem;
    }
  }
</style>

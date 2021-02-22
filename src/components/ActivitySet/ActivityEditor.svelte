<script type="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import dragIcon from "@iconify-icons/ic/baseline-drag-indicator";
  import down from "@iconify-icons/ic/baseline-arrow-drop-down";
  import deleteIcon from "@iconify-icons/ic/baseline-delete";
  import ActivityToken from "../ActivityToken.svelte";
  import InvisibleButton from "../InvisibleButton.svelte";
  import Modal from "../Modal.svelte";
  import InputField from "../InputField.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import abbreviateActivityName from "../../util/activityCode";

  type Activity = {
    name: string;
    code: string;
    description: string;
    color: [string, string];
  };

  export let activity: Activity;
  export let remove: () => void;

  let editorVisible = false;

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
    style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
    on:mousedown={startDrag}
    on:touchstart={startDrag}
    on:keydown={handleKeyDown}
  >
    <Icon icon={dragIcon} />
  </div>
  <input bind:value={activity.name} on:input={setCode} />
  <InvisibleButton on:click={() => (editorVisible = true)}>
    <ActivityToken fixWidth color={activity.color} code={activity.code} />
    <Icon icon={down} />
  </InvisibleButton>
  <InvisibleButton on:click={remove}>
    <div class="remove">
      <Icon icon={deleteIcon} />
    </div>
  </InvisibleButton>

  <Modal
    bind:visible={editorVisible}
    title={activity.name}
    buttons={[{ label: 'Done', onClick: () => (editorVisible = false) }]}
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
  @import "src/styles/tokens";
  @import "src/styles/type";

  %flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item {
    display: flex;
    align-items: stretch;
    width: 100%;
    .drag-handle {
      $m: -$input-spacing-inner/2;
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
      padding: $input-padding-vertical/2 $input-padding-horizontal/2
        calc(#{$input-padding-vertical/2} - #{$input-border-size})
        $input-padding-horizontal/2;
      border: 0 solid $input-border-color;
      border-width: 0 0 $input-border-size 0;
      border-radius: 0.01px;
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

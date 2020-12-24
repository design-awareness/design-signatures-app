<script lang="ts">
  import ActivityToggle from "./ActivityToggle.svelte";
  import ActivityToken from "./ActivityToken.svelte";
  import Button from "./Button.svelte";
  import ButtonGroup from "./ButtonGroup.svelte";
  import InvisibleButton from "./InvisibleButton.svelte";
  import Modal from "./Modal.svelte";

  export let activityCode: string;
  export let activityName: string;
  export let activityColor: string;
  export let activityDescription: string;
  export let index: number;
  export let time: number;
  export let sessionData: readonly [number, number][][];

  let modalOpen = false;

  let lastToggleTime = 0;
  let lastActivityOn = false;
  let activityOn = false;
  $: if (lastActivityOn !== activityOn) {
    if (activityOn) {
      // turn activity on
      lastActivityOn = true;
    } else {
      // turn activity off
      // less than one second - don't track
      if (time - lastToggleTime >= 1000) {
        let newDataRow = [
          ...sessionData[index],
          [lastToggleTime, time] as [number, number],
        ];
        let newSessionData = sessionData.slice();
        newSessionData[index] = newDataRow;

        // bound prop: push new session data back up to Session object
        sessionData = newSessionData;
      }
      lastActivityOn = false;
    }
    lastToggleTime = time;
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .slat {
    display: flex;
    width: 100%;
    align-items: center;
    :global(button) {
      width: fit-content;
    }
    padding: $activity-slat-padding-vertical 0;
    border-bottom: $activity-slat-separator-width solid
      $activity-slat-separator-color;

    &:first-child {
      border-top: $activity-slat-separator-width solid
        $activity-slat-separator-color;
    }
  }
  .name {
    flex: 1;
    width: 0;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<div class="slat">
  <InvisibleButton on:click={() => (modalOpen = true)}>
    <ActivityToken fixWidth code={activityCode} color={activityColor} />
  </InvisibleButton>
  <div class="name">{activityName}</div>
  <ActivityToggle
    color={activityColor}
    {activityName}
    bind:checked={activityOn} />
  <Modal bind:visible={modalOpen} title={activityName}>
    <p>{activityDescription || 'No description available.'}</p>
    <ButtonGroup>
      <Button small on:click={() => (modalOpen = false)}>Close</Button>
    </ButtonGroup>
  </Modal>
</div>

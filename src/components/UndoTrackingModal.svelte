<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import type { IconifyIcon } from "../types/IconifyIcon";
  import type SessionTracker from "../util/track";
  import InputNumberField from "./InputNumberField.svelte";
  import Modal from "./Modal.svelte";

  export let visible: boolean;
  export let closeModal: () => void;
  export let undoIcon: IconifyIcon;
  export let time: number;
  export let tracker: SessionTracker;

  let max = Math.floor(time / 1000);
  let rewindSeconds: number = Math.min(30, max);

  function commitUndo() {
    rewindSeconds = Math.min(max, Math.max(1, rewindSeconds));
    time -= rewindSeconds * 1000;
    tracker.rewindTo(time);
    closeModal();
  }

  function format(seconds: number): string {
    if (seconds < 60) {
      return `Undo ${seconds} sec`;
    } else {
      return `Undo ${Math.floor(seconds / 60)}:${("0" + (seconds % 60)).substr(
        -2
      )}`;
    }
  }
</script>

<Modal
  bind:visible
  status="Tracking is paused"
  title="Undo Tracking"
  buttons={[
    { label: "Cancel", onClick: closeModal },
    {
      label: format(rewindSeconds),
      onClick: commitUndo,
      icon: undoIcon,
      disabled: rewindSeconds < 1,
    },
  ]}
>
  <InputNumberField
    bind:value={rewindSeconds}
    {max}
    min={1}
    label="Seconds to undo"
  />
</Modal>

<style lang="scss">
</style>

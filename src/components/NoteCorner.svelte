<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
</script>

<div class="note-indicator" aria-label="This has a note."></div>

<style lang="scss">
  @use "src/styles/tokens" as *;
  .note-indicator {
    position: absolute;
    top: 0;
    right: 0;
    border: 3px solid transparent;
    border-top-color: $accent-note-color;
    border-right-color: $accent-note-color;
  }
</style>

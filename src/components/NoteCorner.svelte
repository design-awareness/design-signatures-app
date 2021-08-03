<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->

<div class="note-indicator" aria-label="This has a note." />

<style lang="scss">
  @import "src/styles/tokens";
  .note-indicator {
    position: absolute;
    top: 0;
    right: 0;
    border: 3px solid transparent;
    border-top-color: $accent-note-color;
    border-right-color: $accent-note-color;
  }
</style>

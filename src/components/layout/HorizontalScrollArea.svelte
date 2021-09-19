<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->

<div class="outer">
  <div class="inner">
    <slot />
  </div>
</div>

<style lang="scss">
  .outer {
    margin: 0 -1rem;
    overflow-y: auto;
  }

  .inner {
    padding: 1rem;
    width: max-content;
  }
</style>

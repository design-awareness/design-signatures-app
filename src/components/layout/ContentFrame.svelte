<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->

<div class="content-frame">
  <slot />
</div>

<style lang="scss">
  @import "src/styles/tokens";
  .content-frame {
    margin: 0;
    padding: $content-frame-pad;
  }
</style>

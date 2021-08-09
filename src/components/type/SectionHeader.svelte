<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->

<h3>
  <slot />
</h3>

<style lang="scss">
  @import "src/styles/type";
  @import "src/styles/tokens";
  h3 {
    @include type-style($type-section-header);
    margin: 1rem 0;
    text-transform: uppercase;
    &:first-child {
      margin-top: 0;
    }
  }
</style>

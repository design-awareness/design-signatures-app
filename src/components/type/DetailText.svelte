<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
</script>

<p>
  <slot />
</p>

<style lang="scss">
  @use "src/styles/type" as *;
  @use "src/styles/tokens" as *;
  p {
    text-align: center;
    margin: 2.5rem 0 1rem 0;
    @include type-style($type-detail);
    color: $text-secondary-color;
    &:first-child {
      margin-top: 0;
    }
  }
</style>

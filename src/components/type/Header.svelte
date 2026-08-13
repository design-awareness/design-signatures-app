<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
</script>

<h1>
  <slot />
</h1>

<style lang="scss">
  @use "src/styles/type" as *;
  @use "src/styles/tokens" as *;
  h1 {
    margin: 2.5rem 0 1rem 0;
    @include type-style($type-header);
    &:first-child {
      margin-top: 0;
    }
  }
</style>

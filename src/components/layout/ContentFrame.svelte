<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
</script>

<div class="content-frame">
  <slot />
</div>

<style lang="scss">
  @use "src/styles/tokens" as *;
  .content-frame {
    margin: 0;
    padding: $content-frame-pad;
  }
</style>

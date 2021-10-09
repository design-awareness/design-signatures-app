<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import Logo from "../assets/Logo.svelte";
  import settingsIcon from "@iconify/icons-ic/baseline-settings";
  import Link from "./Link.svelte";
</script>

<header>
  <Logo width="8rem" />
  <div class="btn">
    <Link href="/settings/">
      <Icon icon={settingsIcon} />
    </Link>
  </div>
</header>

<style lang="scss">
  header {
    $header-spill-top: 3rem;
    $padding-h: 2rem;
    $padding-v: 1rem;
    height: 4rem;
    box-sizing: content-box;
    margin: 0 0 (-$header-spill-top) 0;
    transform: translateY(-$header-spill-top);
    padding: ($header-spill-top + $padding-v) $padding-h $padding-v $padding-h;
    background: #4f4f4f;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 2rem 2rem;
    color: white;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  }

  .btn {
    font-size: 1.5rem;
    :global(a) {
      color: inherit;
      display: block;
      padding: 0.5rem;
      border-radius: 2px;
    }
    :global(svg) {
      vertical-align: bottom;
    }
  }
</style>

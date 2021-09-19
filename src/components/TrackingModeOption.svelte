<!--
  Copyright (c) 2021, Design Signatures Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import realtimeIcon from "@iconify-icons/ic/baseline-access-time";
  import asyncIcon from "@iconify-icons/ic/baseline-list";
  import helpIcon from "@iconify-icons/ic/baseline-help-outline";
  import Icon from "@iconify/svelte/dist/Icon.svelte";

  export let type: "realtime" | "async";

  const data = {
    realtime: {
      icon: realtimeIcon,
      label: "Realtime",
      description: "Track your process while you're designing",
    },
    async: {
      icon: asyncIcon,
      label: "Asynchronous",
      description: "Track your process after designing or between sessions",
    },
  };

  let { icon, label, description } = data[type];
</script>

<div class="mode-container">
  <div class="icon"><Icon {icon} /></div>
  <h2>{label}</h2>
  <p>{description}</p>
</div>
<button class="info">
  <Icon icon={helpIcon} />
</button>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .mode-container {
    text-align: center;
    color: $text-primary-color;
    max-width: 16rem;
    padding: 2rem;
  }

  .icon {
    font-size: 3rem;
    color: $text-secondary-color;
  }

  .info {
    $info-button-spacing: 1rem;
    position: absolute;
    display: flex;
    border-radius: 100%;
    top: $info-button-spacing;
    right: $info-button-spacing;
    font-size: 1.5rem;
    color: $text-secondary-color;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    border: 0;
    padding: 0.25rem;

    &:hover,
    &:active {
      background: $transparent-dim-color;
    }
  }

  h2 {
    @include type-style($type-header);
    margin: 1.5rem;
  }
  p {
    @include type-style($type-body);
    margin: 0;
  }
</style>

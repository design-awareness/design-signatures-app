<!--
  Copyright (c) 2021-2022, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import moreIconAndroid from "@iconify/icons-ic/baseline-more-vert";

  import { onDestroy } from "svelte";

  import BackButton from "../components/BackButton.svelte";
  import Button from "../components/Button.svelte";
  import InputField from "../components/InputField.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import PageSeparator from "../components/PageSeparator.svelte";
  import Header from "../components/type/Header.svelte";
  import SectionHeader from "../components/type/SectionHeader.svelte";
  import {
    canInstall,
    copyURL,
    isAndroid as getIsAndroid,
    isInstalled,
    isIOS as getIsIOS,
    isNonInstallableBrowser,
    showInstallPrompt,
  } from "../util/pwa";

  let copied = false;
  async function doCopy() {
    copied = await copyURL();
  }

  let isAndroid = getIsAndroid();
  let isIOS = getIsIOS();
</script>

<main class="device-frame page">
  <ContentFrame>
    <div class="top-bar">
      <BackButton href="/" />
    </div>
    <Header>Install app</Header>
    {#if $isInstalled}
      <p>This app is already installed.</p>
    {:else}
      {#if isNonInstallableBrowser() && !$canInstall}
        <p>
          <strong>
            Your current browser does not seem to support installing apps.
          </strong>
        </p>
        <p>
          Copy the url below and paste it into
          {#if isAndroid}
            Chrome
          {:else if isIOS}
            Safari
          {:else}
            your device's default browser
          {/if}
          before continuing.
        </p>
        <InputField value={location.href} label="URL" readonly />
        <div class="center-button">
          <Button on:click={doCopy} small>
            {copied ? "Copied." : "Copy"}
          </Button>
        </div>

        <PageSeparator />
      {/if}

      {#if $canInstall}
        <p>
          <strong>
            Your browser may be able to install this app automatically.
          </strong>
        </p>
        <Button on:click={showInstallPrompt}>Install</Button>
        <p>If the button above does not work, follow the instructions below.</p>
        <PageSeparator />
      {/if}

      {#if isAndroid || !isIOS}
        <SectionHeader>Android installation</SectionHeader>
        <ol>
          <li>
            Press the <Icon icon={moreIconAndroid} /> menu icon in the address bar.
          </li>
          <li>
            Choose <strong>Install app</strong> or
            <strong>Add to home screen</strong>
          </li>
        </ol>
      {/if}
      {#if isIOS || !isAndroid}
        <SectionHeader>iOS installation</SectionHeader>
        <ol>
          <li>
            Press the share icon in Safari's toolbar at the bottom or top of the
            screen.
          </li>
          <li>
            Choose <strong>Add to Home Screen</strong>.
          </li>
        </ol>
      {/if}
    {/if}
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .center-button {
    display: flex;
    justify-content: center;
    margin: 0.25rem 0;
  }
</style>

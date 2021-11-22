<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts" context="module">
  const SPLASH_OVERLAY_DELAY_TIME = 2000;
  const SPLASH_OVERLAY_FADE_TIME = 500;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { Carousel, CarouselItem } from "svelte-snappy-carousel";

  import { fade } from "svelte/transition";

  import Logo from "../assets/Logo.svelte";
  import Button from "../components/Button.svelte";
  import CarouselControls from "../components/CarouselControls.svelte";
  import Header from "../components/type/Header.svelte";
  import { delay } from "../util/delay";

  let showOverlay = true;

  onMount(async () => {
    await delay(SPLASH_OVERLAY_DELAY_TIME);
    showOverlay = false;
  });
</script>

<main class="device-frame page">
  {#if showOverlay}
    <div
      class="overlay"
      out:fade={{ duration: SPLASH_OVERLAY_FADE_TIME }}
      on:click={() => (showOverlay = false)}
    >
      <Logo width="12rem" />
      <div class="splash-welcome">
        <h1>Welcome!</h1>
      </div>
    </div>
  {/if}
  <Carousel>
    <CarouselItem>
      <div class="slide">
        <Header>Discover your design signature</Header>
        <p>
          <strong>Document</strong> your design process and create a
          <strong>design signature</strong>
          to help you visualize that process. Use it as a tool to
          <strong>reflect</strong> on and improve your design processes.
        </p>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>Break down your process with design models</Header>
        <p />
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>Choose a pace that works for you</Header>
        <p />
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>See your process represented visually</Header>
        <p />
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>Become a better designer!</Header>
        <p />
      </div>
    </CarouselItem>
    <div
      class="controls"
      slot="outer-controls"
      let:next
      let:previous
      let:nextAvailable
      let:previousAvailable
      let:count
      let:position
    >
      {#if position !== count - 1}
        <div class="skip-button" transition:fade={{ duration: 150 }}>
          <Button small on:click={() => console.log("skip")}>Skip</Button>
        </div>
      {/if}
      <CarouselControls
        {next}
        {previous}
        {nextAvailable}
        {previousAvailable}
        {count}
        {position}
      />
    </div>
  </Carousel>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .overlay {
    z-index: 100;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6rem 2rem;
    box-sizing: border-box;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $splash-background-color;
    color: $splash-foreground-color;
  }
  .splash-welcome {
    display: flex;
    flex: 1;
    padding-bottom: 6rem;
    align-items: center;
    justify-content: center;
    h1 {
      font-size: 3rem;
      font-weight: 400;
      line-height: 1;
    }
  }
  .skip-button {
    position: fixed;
    z-index: 1;
    right: $content-frame-pad;
    top: $content-frame-pad;
  }
  .slide {
    box-sizing: border-box;
    min-height: 100vh;
    padding: $content-frame-pad;
    padding-top: 2.5rem + $content-frame-pad;
  }
  .controls {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: $content-frame-pad;
    padding-top: 2 * $content-frame-pad;
    background: linear-gradient(
      to bottom,
      rgba(96, 124, 224, 0) 0%,
      rgba(96, 124, 224, 0.85) 66%,
      #607ce0 100%
    );

    --carousel-controls--indicator-inactive: white;
    --carousel-controls--indicator-active: #2d2b6f;
    --carousel-controls--button-inactive: transparent;
    --carousel-controls--button-active: white;
  }
  p {
    @include type-style($type-body);
    strong {
      font-weight: 600;
    }
  }
</style>

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
  import { spring } from "svelte/motion";
  import { fade } from "svelte/transition";
  import Logo from "../assets/Logo.svelte";
  import OnboardingSwoosh, {
    swooshWidth,
  } from "../assets/OnboardingSwoosh.svelte";
  import Button from "../components/Button.svelte";
  import CarouselControls from "../components/CarouselControls.svelte";
  import DeviceOutline from "../components/DeviceOutline.svelte";
  import Figure, { CDN_PREFIX } from "../components/Figure.svelte";
  import { goHorizontal } from "../components/Link.svelte";
  import Header from "../components/type/Header.svelte";
  import TypedMedia from "../components/TypedMedia.svelte";
  import CONFIG from "../data/config";
  import { delay } from "../util/delay";

  let showOverlay = true;

  onMount(async () => {
    await delay(SPLASH_OVERLAY_DELAY_TIME);
    showOverlay = false;
  });

  let swooshPos = spring(0, {
    stiffness: 0.03,
    damping: 0.95,
  });
  const updatePosition = (position: number) => {
    const totalWidth = swooshWidth - window.innerWidth;
    swooshPos.set(totalWidth * position);
  };
  const updatePosEffect = (_: HTMLElement, pos: number) => {
    updatePosition(pos);
    return {
      update: (pos: number) => updatePosition(pos),
      destroy: () => {},
    };
  };

  function exitOnboarding() {
    CONFIG.setHasSeenOnboarding(true);
    goHorizontal("/");
  }
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
        <div class="illustration-pane">
          <h2>Document</h2>
          <img
            src="{CDN_PREFIX}onboarding/document.svg"
            alt="Document illustration"
          />
          <h2>Visualize</h2>
          <img
            src="{CDN_PREFIX}onboarding/visualize.svg"
            alt="Visualize illustration"
          />
          <h2>Reflect</h2>
          <img
            src="{CDN_PREFIX}onboarding/reflect.svg"
            alt="Reflect illustration"
          />
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>Break down your process with design models</Header>
        <p>
          <strong>Design models</strong> are collections of design activities that
          let you describe a design process.
        </p>
        <Figure path="models/hcde.svg" alt="Design models illustration">
          UW HCDE's design model
        </Figure>
        <p>
          Choose from several <strong>design models</strong> to document your design
          process.
        </p>
        <div class="media">
          <DeviceOutline>
            <TypedMedia
              media={{
                type: "image",
                url: {
                  light: `${CDN_PREFIX}onboarding/design-models-light.png`,
                  dark: `${CDN_PREFIX}onboarding/design-models-dark.png`,
                },
              }}
            />
          </DeviceOutline>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>Choose a pace that works for you</Header>
        <p>
          Document your process in <strong>real-time</strong> or
          <strong>asynchronously</strong>.
        </p>
        <p class="device-caption">Documenting in real-time</p>
        <div class="media">
          <DeviceOutline>
            <TypedMedia
              media={{
                type: "image",
                url: {
                  light: `${CDN_PREFIX}onboarding/realtime-light.png`,
                  dark: `${CDN_PREFIX}onboarding/realtime-dark.png`,
                },
              }}
            />
          </DeviceOutline>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>See your process represented visually</Header>
        <p>
          We’ll create visualizations based on your design data to help you view
          and reflect on your design process.
        </p>
        <p class="device-caption">Design timeline visualization</p>
        <div class="media">
          <DeviceOutline>
            <TypedMedia
              media={{
                type: "image",
                url: {
                  light: `${CDN_PREFIX}onboarding/visualization-light.png`,
                  dark: `${CDN_PREFIX}onboarding/visualization-dark.png`,
                },
              }}
            />
          </DeviceOutline>
        </div>
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>Become a better designer!</Header>
        <p>
          Use your design signature to help you better understand and improve
          your design habits.
        </p>

        <img
          class="reflect-illustration"
          src="{CDN_PREFIX}onboarding/reflect.svg"
          alt="Reflect illustration"
        />
      </div>
    </CarouselItem>
    <CarouselItem>
      <div class="slide">
        <Header>So you know:</Header>

        <p>
          The projects you create are only stored on your device. Before you
          delete the app, make sure you back up any projects you want to keep
          using the "Export" feature.
        </p>

        <p>
          By using this app, you accept the terms of the BSD 3-Clause License,
          as described in the <a href="/legal/tos.html" target="_blank"
            >Terms of Service</a
          >.
        </p>
        <p>
          This app doesn't track you or collect any personal data. For more
          information, please review our <a
            href="/legal/privacy.html"
            target="_blank">Privacy Information</a
          >.
        </p>
        <p>
          If you'd like to play this onboarding again, you can do so from the
          app settings.
        </p>

        <div class="cta-button">
          <Button on:click={exitOnboarding}>Let’s go!</Button>
        </div>
      </div>
    </CarouselItem>
    <div
      class="controls"
      slot="inner-controls"
      let:next
      let:previous
      let:nextAvailable
      let:previousAvailable
      let:count
      let:position
      let:goTo
    >
      {#if position !== count - 1}
        <div class="skip-button" transition:fade={{ duration: 150 }}>
          <Button small on:click={() => goTo(count - 1)}>Skip</Button>
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
    <div
      class="swoosh"
      slot="outer-controls"
      style="transform: translateX(-{$swooshPos}px);"
      let:position
      let:count
      use:updatePosEffect={position / count}
    >
      <OnboardingSwoosh />
    </div>
  </Carousel>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";
  .page {
    background-color: $alt-background-color;
    > :global(.carousel-container) {
      z-index: 1;
    }
  }

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
    height: 100vh;
    overflow: auto;
    padding: $content-frame-pad;
    padding-top: 2.5rem + $content-frame-pad;
    padding-bottom: 4rem + $content-frame-pad;
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
  .illustration-pane {
    background: $alt-background-color;
    border-radius: 2rem;
    display: grid;
    grid-auto-flow: row;
    grid-template: repeat(3, 1fr) / repeat(2, auto);
    align-items: center;
    gap: 1rem 2rem;
    padding: 1rem 3rem;
    width: fit-content;
    margin: 0 auto;
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      text-align: right;
    }
    img {
      height: 7rem;
    }
  }

  .media {
    padding: 0 2rem;
    margin: 1rem auto;
    width: fit-content;
    max-width: 16rem;
    :global(img),
    :global(video) {
      max-width: 100%;
    }
  }

  .device-caption {
    @include type-style($type-caption);
    color: $text-secondary-color;
    font-style: italic;
    text-align: center;
  }

  .reflect-illustration {
    display: block;
    margin: 3rem auto;
    max-width: 15rem;
  }

  .cta-button {
    display: flex;
    justify-content: center;
  }

  .swoosh {
    position: fixed;
    bottom: -40px;
    left: 0;
    width: 100%;
    z-index: 0;
  }
</style>

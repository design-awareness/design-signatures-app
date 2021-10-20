<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
  import Masonry from "svelte-masonry/Masonry.svelte";

  import team from "./team";
  import ProfileCard from "./ProfileCard.svelte";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>About this Project</Header>

    <p>
      This project was created by a team of researchers at the University of
      Washington in the
      <a href="https://www.hcde.washington.edu/">
        Human Centered Design and Engineering
      </a> department. The Design Signatures App is part of our larger ecosystem
      of work where we strive to help ourselves and others learn more about Design
      Awareness.
    </p>

    <p>
      We hope to share our research findings and tools to ultimately impact
      designers around the world. We believe that design awareness can help lead
      to a more intentional, empathetic and sustainable design field!
    </p>

    <Header>Who We Are</Header>

    <Masonry colWidth={"minmax(10rem, 1fr)"} gridGap={"1rem"}>
      {#each team as profile}
        <ProfileCard {profile} />
      {/each}
    </Masonry>

    <p>
      This work was supported by the Center for Engineering Learning & Teaching
      at the University of Washington, the Mitchell T. and Lella Blanche Bowie
      Endowment, and the Mark and Carolyn Guidry Foundation. We would like to
      thank the students in the Design Awareness seminar for their invaluable
      feedback on the first iteration of the app, and we would like to thank
      Aaron Joya, Alison Gray and Jennifer Turns for their insights and
      contributions.
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }
</style>

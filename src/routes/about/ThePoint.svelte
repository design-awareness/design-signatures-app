<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Whats the point?</Header>
    <p>
      The design awareness app helps designers monitor their own design
      processes with a goal of modifying their process when they think they are
      going astray. We allow you to caputure and reflect on your design process.
    </p>
    <table>
      <tr>
        <th><img src="images/videoholder.png" alt="not found" /></th>
      </tr>
    </table>
    <br />

    <h4>Reflecting on your process</h4>
    <p>
      Once you record your design process, you can compare your process to those
      of high qualites by industry experts. Depending on the
      <a href="/">design model</a>
      you choose, we create visualisations to allow you to compare and reflect on
      your process. You can also compare your process between different projects
      of yours
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  .page {
    min-height: 100%;
  }

  img {
    list-style-type: none;
    padding: 0;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-items: flex-start;
    justify-content: space-around;
  }

  a {
    color: black;
    text-decoration: none;
    font-weight: 700;
    background-color: #f1c258;
  }
</style>

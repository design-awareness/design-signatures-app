<script lang="ts">
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import Link from "../components/Link.svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import BackButton from "../components/BackButton.svelte";
  import Header from "../components/type/Header.svelte";
  import type { ActivitySet } from "../data/schema";
  import BuilderFrame from "../components/ActivitySet/BuilderFrame.svelte";

  let activitySet: ActivitySet = null;
  let newSetOverlay = false;
</script>

<style lang="scss">
  .page {
    background-image: url("/images/bg.png");
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
</style>

<main class="device-frame page">
  {#if !newSetOverlay}
    <ContentFrame>
      <BackButton href="/" />
      <Header>What does this app do?</Header>
      <p>
        The design awareness app helps designers monitor their own design
        processes with a goal of modifying their process when they think they
        are going astray. We allow you to caputure and reflect on your design
        process.
      </p>
      <table>
        <tr>
          <th><img src="images/videoholder.png" alt="not found" /></th>
        </tr>
      </table>
      <br />

      <h4>Reflecting on your process</h4>
      <p>
        Once you record your design process, you can compare your process to
        those of high qualites by industry experts. Depending on the
        <a href="/">design activity set</a>
        you choose, we create visualisations to allow you to compare and reflect
        on your process. You can also compare your process between different
        projects of yours
      </p>
    </ContentFrame>
  {:else}
    <!-- newSetOverlay -->
    <BuilderFrame bind:visible={newSetOverlay} bind:activitySet />
  {/if}
</main>

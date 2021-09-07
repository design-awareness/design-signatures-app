<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/Icon.svelte";
  import { link } from "svelte-spa-router";
  import { CDN_PREFIX } from "../../components/Figure.svelte";

  import type { TeamMemberProfile } from "./team";

  export let profile: TeamMemberProfile;
</script>

<div class="card">
  <div class="image-holder">
    <img src="{CDN_PREFIX}{profile.photo}" alt="Photo of {profile.name}" />
  </div>
  <div class="body">
    <h4>{profile.name}</h4>
    <p class="pronouns">{profile.pronouns}</p>
    <p class="title">{profile.title}</p>
    {#each profile.links as { url, type, icon }}
      <a href={url}>
        <Icon {icon} />
        {type}
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .card {
    display: flex;
    flex-direction: column;
    border: 1px solid $input-border-color;
    background-color: $alt-background-color;
    border-radius: 2px;
    overflow: hidden;
    align-items: stretch;
  }
  .body {
    padding: 0.5rem;
  }
  .image-holder {
    // 1:1 aspect ratio hack!
    width: 100%;
    height: 0;
    box-sizing: content-box;
    padding: 100% 0 0 0;

    position: relative;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  h4,
  p {
    @include type-style($type-input);
    margin: 0;
    color: $text-primary-color;
  }
  h4 {
    font-weight: 600;
  }

  a {
    @include type-style($type-input);
    display: flex;
    margin: 0.25rem 0 0 0;
    gap: 0.5rem;
    align-items: center;
    :global(svg) {
      font-size: 1.25rem;
    }
  }
</style>

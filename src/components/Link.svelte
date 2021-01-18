<script lang="ts">
  import { push, replace } from "svelte-spa-router/Router.svelte";
  import { goUpSafe } from "../util/history";

  export let href: string;
  export let up = false;
  export let enforce = false;
  export let horizontal = false;

  function click(evt: MouseEvent) {
    evt.preventDefault();
    navigate({ href, up, enforce, horizontal });
  }

  function navigate({ href, up = false, enforce = false, horizontal = false }) {
    if (up) {
      goUpSafe(href, enforce);
    } else if (horizontal) {
      replace(href);
    } else {
      push(href);
    }
  }

  export function goUp(href: string, enforce = false) {
    navigate({ href, enforce, up: true });
  }

  export function goHorizontal(href: string) {
    navigate({ href, horizontal: true });
  }

  export function goDown(href: string) {
    navigate({ href });
  }
</script>

<style lang="scss">
  @import "src/styles/colors";
  a {
    color: $neutral-60;
    text-decoration: none;
  }
</style>

<a href={'#' + href} on:click={click}>
  <slot />
</a>

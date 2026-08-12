/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

// `svelte-masonry` (github:yoonbuck/svelte-masonry) ships only a bare
// `Masonry.svelte` file with no accompanying type declarations or package
// exports map, so TypeScript cannot resolve its deep import path. This shim
// types our usage of that import without modifying the vendored library.
declare module "svelte-masonry/Masonry.svelte" {
  import type { SvelteComponent } from "svelte";

  interface MasonryProps {
    stretchFirst?: boolean;
    gridGap?: string;
    colWidth?: string;
    items?: unknown[];
  }
  interface MasonrySlots {
    default: {};
  }

  export default class Masonry extends SvelteComponent<
    MasonryProps,
    any,
    MasonrySlots
  > {}
}

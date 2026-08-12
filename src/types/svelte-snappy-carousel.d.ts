/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Local type shim for the protected `svelte-snappy-carousel` dependency.
//
// The library ships its type declarations as the original (Svelte 3)
// `.svelte` source files, which svelte-check re-derives on the fly using
// whatever Svelte/svelte2tsx version the consuming project has installed.
// Its `Carousel.svelte` declares an explicit `$$Slots` interface that lists
// only the named `inner-controls`/`outer-controls` slots (omitting
// `default`), which the current toolchain now takes literally instead of
// also inferring the unnamed `<slot />` used in the markup. That makes the
// default-slot (children) content passed by consumers fail to type-check.
//
// This shim does not modify, patch, or upgrade the library itself — it only
// (re)declares the public API shape for our own usage so consumers of
// `Carousel`/`CarouselItem` type-check correctly.
declare module "svelte-snappy-carousel" {
  import { SvelteComponent } from "svelte";

  export interface CarouselSlotProps {
    position: number;
    count: number;
    previous: () => void;
    next: () => void;
    previousAvailable: boolean;
    nextAvailable: boolean;
    goTo: (key: number) => void;
  }

  export interface CarouselProps {
    visibleItem?: number;
  }

  export interface CarouselSlots {
    default: {};
    "inner-controls": CarouselSlotProps;
    "outer-controls": CarouselSlotProps;
  }

  export class Carousel extends SvelteComponent<
    CarouselProps,
    any,
    CarouselSlots
  > {}

  export interface CarouselItemSlots {
    default: {};
  }

  export class CarouselItem extends SvelteComponent<
    {},
    any,
    CarouselItemSlots
  > {}
}

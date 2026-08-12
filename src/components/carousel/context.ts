/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Vendored from svelte-snappy-carousel (MIT, Jordan Yoon-Buck). See ./LICENSE.
 */

export const key = Symbol("svelte-snappy-carousel");

export interface CarouselContext {
  register(): number;
  provideDOMElement(index: number, el: HTMLDivElement): void;
  destroy(index: number): void;
}

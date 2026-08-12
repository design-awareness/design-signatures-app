/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const key = Symbol("carousel");

export interface CarouselContext {
  register(): number;
  provideDOMElement(index: number, el: HTMLDivElement): void;
  destroy(index: number): void;
}

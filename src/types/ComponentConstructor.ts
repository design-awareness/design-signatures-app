/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { SvelteComponent } from "svelte";

export type ComponentConstructor<C extends SvelteComponent> = new (
  ...args: any[]
) => C;

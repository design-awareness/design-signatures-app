/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { Component } from "svelte";

export type ComponentConstructor<
  Props extends Record<string, unknown> = Record<string, unknown>,
> = Component<Props>;

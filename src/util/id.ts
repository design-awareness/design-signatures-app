/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const randomID = () =>
  Math.random().toString(36).substr(2, 8) +
  Math.random().toString(36).substr(2, 8);

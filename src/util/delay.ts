/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export function delay(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

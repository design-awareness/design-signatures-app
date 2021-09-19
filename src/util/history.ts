/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { tick } from "svelte";

export async function goUpSafe(href: string, enforce = false) {
  function handler() {
    setTimeout(() => (window.location.href = "#" + href), 50);
  }
  window.addEventListener("beforeunload", handler);

  await tick();
  window.history.back();

  if (enforce) {
    history.replaceState({}, "", "#" + href);
  }
  window.removeEventListener("beforeunload", handler);
}

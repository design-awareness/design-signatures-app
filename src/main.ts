/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import App from "./App.svelte";

import * as db from "./data/database";
import { BUILD_ENV } from "./data/buildData";

if (BUILD_ENV !== "prod") {
  // in non production environments, expose db on the window object!
  Object.assign(window, { db });
}

const app = new App({
  target: document.body,
});

// install service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

export default app;

/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { mount } from "svelte";
import App from "./App.svelte";

import * as db from "./data/database";
import { BUILD_ENV } from "./data/buildData";
import { triggerOnboardingIfFirstTime } from "./util/onboard";

if (BUILD_ENV !== "prod") {
  // in non production environments, expose db on the window object!
  Object.assign(window, { db });
}

const app = mount(App, {
  target: document.body,
});

// install service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const serviceWorkerUrl = import.meta.env.DEV
      ? "/src/service-worker.ts"
      : "/service-worker.js";

    navigator.serviceWorker.register(serviceWorkerUrl, { type: "module" });
  });
}

triggerOnboardingIfFirstTime();

export default app;

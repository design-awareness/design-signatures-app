/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { readable } from "svelte/store";

let initial =
  window.matchMedia("(display-mode: standalone)").matches ||
  // @ts-ignore
  navigator.standalone;

export const isInstalled = readable<boolean>(initial, (set) => {
  let query = window.matchMedia("(display-mode: standalone)");
  set(
    query.matches ||
      // @ts-ignore
      navigator.standalone
  );
  function setScheme(queryList: MediaQueryListEvent) {
    set(queryList.matches);
  }
  query.addEventListener("change", setScheme);
  return function stop() {
    query.removeEventListener("change", setScheme);
  };
});

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
  prompt(): Promise<void>;
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

let setCanInstall: (canInstall: boolean) => void = (_) => {};
export const canInstall = readable<boolean>(
  deferredInstallPrompt !== null,
  (set) => {
    setCanInstall = set;
    return () => {
      setCanInstall = (_) => {};
    };
  }
);

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e as BeforeInstallPromptEvent;
  setCanInstall(true);
});

export async function showInstallPrompt() {
  if (!deferredInstallPrompt) return false;

  deferredInstallPrompt?.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  setCanInstall(false);

  return outcome === "accepted";
}

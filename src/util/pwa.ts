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

window.addEventListener("appinstalled", () => {
  // alert("installed!");
  setCanInstall(false);
});

export function isNonInstallableBrowser() {
  if (isChromeAndroid()) {
    return false;
  }
  // other browsers on Android: likely not supported
  if (navigator.userAgent.match(/Android/)) {
    return true;
  }

  // chrome and firefox on iOS: not supported
  if (
    navigator.userAgent.match(/CriOS/) ||
    navigator.userAgent.match(/FxiOS/)
  ) {
    return true;
  }

  return false;
}

export function isChromeAndroid() {
  // try user agent data first - high confidence for
  // installability on android
  let uad: undefined | { platform?: string; brands?: { brand: string }[] } =
    // @ts-ignore
    navigator.userAgentData;
  if (
    uad?.platform === "Android" &&
    uad.brands?.some(({ brand }) => brand.match(/Chrom/))
  ) {
    return true;
  }

  if (
    navigator.userAgent.match(/Android/) &&
    navigator.userAgent.match(/Chrome/) &&
    !navigator.userAgent.match(/(EdgA|Firefox)/)
  ) {
    return true;
  }

  return false;
}

export function isSafariiOS() {
  return (
    navigator.userAgent.match(/iP(ad|hone|od)/) &&
    navigator.userAgent.match(/Safari/) &&
    !navigator.userAgent.match(/(CriOS|FxiOS|OPiOS|mercury|EdgiOS)/)
  );
}

export function isAndroid() {
  return navigator.userAgent.match(/Android/);
}

export function isIOS() {
  return navigator.userAgent.match(/(iP(ad|hone|od)|Macintosh|Mac OS X)/);
}

export async function copyURL() {
  if (!navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard?.writeText?.(window.location.href);
    return true;
  } catch (e) {
    return false;
  }
}

/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { readable } from "svelte/store";
import { hasOwnProperty } from "../types/utility";

type ColorScheme = "light" | "dark";

const matchToScheme = (match: boolean): ColorScheme =>
  match ? "dark" : "light";

let initial = window.matchMedia("(prefers-color-scheme: dark)").matches;
export const colorScheme = readable<ColorScheme>(
  matchToScheme(initial),
  (set) => {
    let query = window.matchMedia("(prefers-color-scheme: dark)");
    set(matchToScheme(query.matches));
    function setScheme(queryList: MediaQueryListEvent) {
      set(matchToScheme(queryList.matches));
    }
    query.addEventListener("change", setScheme);
    return function stop() {
      query.removeEventListener("change", setScheme);
    };
  }
);

export type Schemable<T> = T | { light: T; dark: T };

export function fromSchemable<T>(
  schemable: Schemable<T>,
  theme: ColorScheme
): T {
  if (hasOwnProperty(schemable, "light") && hasOwnProperty(schemable, "dark")) {
    return schemable[theme];
  } else {
    return schemable;
  }
}

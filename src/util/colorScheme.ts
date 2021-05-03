import { readable } from "svelte/store";

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

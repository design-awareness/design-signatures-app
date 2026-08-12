/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * A minimal local replacement for the private `loop` helper that
 * `svelte-snappy-carousel` used to import from `svelte/internal`. Svelte 5
 * no longer exports that helper, so this reimplements just the behavior this
 * carousel relies on: run `callback(now)` on every animation frame until it
 * returns `false`, and allow the loop to be cancelled at any time.
 */

export interface LoopTask {
  /** Stops the loop. Safe to call multiple times, and safe to call after
   * the loop has already finished on its own. */
  abort(): void;
}

/**
 * Runs `callback` on every animation frame, passing the frame timestamp
 * (as given by `requestAnimationFrame`), until it returns a falsy value or
 * the returned task is aborted.
 */
export function loop(callback: (now: number) => boolean): LoopTask {
  let cancelled = false;

  function run(now: number) {
    if (cancelled) return;
    if (callback(now)) {
      requestAnimationFrame(run);
    } else {
      cancelled = true;
    }
  }

  requestAnimationFrame(run);

  return {
    abort() {
      cancelled = true;
    },
  };
}

/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * A minimal `requestAnimationFrame`-based loop used by the carousel to
 * animate its scroll position. Runs `callback(now)` on every animation
 * frame until it returns a falsy value, and allows the loop to be
 * cancelled at any time.
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

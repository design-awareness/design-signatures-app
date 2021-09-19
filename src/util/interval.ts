/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export default function useInterval(
  {
    start,
    tick,
    stop,
  }: {
    start: () => void;
    tick: () => void;
    stop: () => void;
  },
  duration: number,
  startImmediately = false
): [(active: boolean) => void, () => void] {
  let isActive = false;
  let isDestroyed = false;
  let handle: number;

  function _start() {
    start();
    isActive = true;
    handle = setInterval(tick, duration);
  }

  function _stop() {
    isActive = false;
    clearInterval(handle);
    stop();
  }

  if (startImmediately) {
    _start();
  }

  return [
    (active) => {
      if (!isDestroyed && active !== isActive) {
        if (active) {
          _start();
        } else {
          _stop();
        }
      }
    },
    () => {
      isDestroyed = true;
      if (isActive) {
        _stop();
      }
    },
  ];
}

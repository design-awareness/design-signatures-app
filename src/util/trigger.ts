/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { onMount, onDestroy } from "svelte";

export interface ITriggerPassable<T> {
  readonly register: (callback: (arg0: T) => void) => void;
  readonly unregister: (callback: (arg0: T) => void) => void;
}
export type TriggerInvoker<T> = (value: T) => void;

export function createTrigger<T>(): [TriggerInvoker<T>, ITriggerPassable<T>] {
  const handlers = new Set<(arg0: T) => void>();
  const trigger = function (value: T) {
    for (let handler of handlers) {
      handler(value);
    }
  };
  const passable = {
    register(callback: (arg0: T) => void) {
      handlers.add(callback);
    },
    unregister(callback: (arg0: T) => void) {
      handlers.delete(callback);
    },
  };
  return [trigger, passable as ITriggerPassable<T>];
}

export function onTrigger<T>(
  source: ITriggerPassable<T>,
  callback: (arg0: T) => void
) {
  onMount(() => {
    source.register(callback);
  });
  onDestroy(() => {
    source.unregister(callback);
  });
}

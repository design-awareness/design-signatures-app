/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { router } from "svelte-spa-router";
import type { Readable } from "svelte/store";
import { toStore } from "svelte/store";

/*
 * `svelte-spa-router` 5 replaced its `location` and `querystring` stores with
 * runes-backed getters on the `router` singleton. Our components still compile
 * in Svelte 5 legacy mode, where reading those getters from a `$:` block or
 * from markup does not subscribe to the underlying rune, so the value is
 * captured once and never updates.
 *
 * These adapters re-expose the same values as stores, restoring the
 * `$location` / `$querystring` semantics legacy-mode components rely on. Use
 * them wherever router state drives reactivity; reading `router.location` or
 * `router.querystring` directly is still fine inside event handlers, which
 * only need the value at the moment they run.
 */

/**
 * Wraps a router getter in a store that always reports the current route.
 *
 * `toStore` only watches its source while the store has subscribers, and it
 * decides whether to refresh by comparing against the value read when the
 * store was created. A store that loses every subscriber - which happens
 * whenever the components using it unmount - therefore replays its last cached
 * value to the next subscriber. Retaining one subscription for the lifetime of
 * the module keeps that cache live, so components that mount after a route
 * change see the route they actually mounted on.
 */
function routerStore<T>(read: () => T): Readable<T> {
  const store = toStore(read);
  store.subscribe(() => {});
  return { subscribe: store.subscribe };
}

/** The current route, excluding the querystring. */
export const location: Readable<string> = routerStore(() => router.location);

/** The current querystring, without the leading `?`. */
export const querystring: Readable<string | undefined> = routerStore(
  () => router.querystring
);

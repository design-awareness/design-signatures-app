/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { rawDatabaseOperations } from "./database";

const CONFIG_STORE = "_Config";

const configCache = new Map<String, any>();
const promiseCache = new Map<String, Promise<any>>();

async function getConfig<T>(
  key: string,
  defaultValue: T | null = null
): Promise<T> {
  if (configCache.has(key)) {
    return configCache.get(key);
  }
  if (promiseCache.has(key)) {
    return await promiseCache.get(key);
  }

  let data = await rawDatabaseOperations.get(CONFIG_STORE, key);
  return (data as any)?.value ?? defaultValue;
}

function setConfig(key: string, value: any): Promise<void> {
  configCache.set(key, value);
  return rawDatabaseOperations.update(CONFIG_STORE, { key, value });
}

const CONFIG = {
  getRecentProjects(): Promise<string[]> {
    return getConfig<string[]>("recent_projects", []);
  },
  setRecentProjects(v: string[]) {
    return setConfig("recent_projects", v);
  },

  getDevSuppressBeforeUnload(): Promise<boolean> {
    return getConfig<boolean>("dev__suppress_before_unload", false);
  },
  setDevSuppressBeforeUnload(v: boolean) {
    return setConfig("dev__suppress_before_unload", v);
  },

  getTextScalingFactor(): Promise<number> {
    return getConfig<number>("text_scaling_factor", 0);
  },
  setTextScalingFactor(v: number) {
    return setConfig("text_scaling_factor", v);
  },

  getEnablePinchToZoom(): Promise<boolean> {
    return getConfig<boolean>("enable_pinch_to_zoom", false);
  },
  setEnablePinchToZoom(v: boolean) {
    console.log("writing", v);
    return setConfig("enable_pinch_to_zoom", v);
  },
};

export default CONFIG;

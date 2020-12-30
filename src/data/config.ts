import { rawDatabaseOperations } from "./database";

const CONFIG_STORE = "_Config";

const configCache = new Map<String, any>();
const promiseCache = new Map<String, Promise<any>>();

async function getConfig<T>(key: string, defaultValue: T = null): Promise<T> {
  if (configCache.has(key)) {
    return configCache.get(key);
  }
  if (promiseCache.has(key)) {
    return await promiseCache.get(key);
  }

  let data = await rawDatabaseOperations.get(CONFIG_STORE, key);
  return data?.["value"] ?? defaultValue;
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
};

export default CONFIG;

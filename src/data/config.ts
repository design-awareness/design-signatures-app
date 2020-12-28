import { rawDatabaseOperations } from "./database";

const CONFIG_STORE = "_Config";

const configCache = new Map<String, any>();
const promiseCache = new Map<String, Promise<any>>();

async function getConfig(key: string): Promise<any> {
  if (configCache.has(key)) {
    return configCache.get(key);
  }
  if (promiseCache.has(key)) {
    return await promiseCache.get(key);
  }

  return (await rawDatabaseOperations.get(CONFIG_STORE, key))["value"];
}

function setConfig(key: string, value: any): Promise<void> {
  configCache.set(key, value);
  return rawDatabaseOperations.update(CONFIG_STORE, { key, value });
}

const CONFIG = {
  getRecentProjects(): Promise<string[]> {
    return getConfig("recent_projects");
  },
  setRecentProjects(v: string[]) {
    return setConfig("recent_projects", v);
  },

  getDevSuppressBeforeUnload(): Promise<boolean> {
    return getConfig("dev__suppress_before_unload");
  },
  setDevSuppressBeforeUnload(v: boolean) {
    return setConfig("dev__suppress_before_unload", v);
  },
};

export default CONFIG;

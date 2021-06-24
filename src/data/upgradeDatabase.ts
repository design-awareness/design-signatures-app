// upgrade database structure as needed

const CONFIG_STORE = "_Config";
interface RawDBOperations {
  add: (store: string, data: any) => Promise<void>;
  update: (store: string, data: any) => Promise<void>;
  remove: (store: string, id: string) => Promise<void>;
  get: (store: string, id: string) => Promise<object | null>;
}

export function upgradeDatabase(from: number, db: IDBDatabase) {
  if (from <= 2) {
    // Upgrade v2 to v3:
    // create object store for static configuration and saved data
  }
}

export async function initializeConfiguration(
  from = 0,
  rawDbOperations: RawDBOperations
) {
  const addConfig = (key: string, value: any) =>
    rawDbOperations.add(CONFIG_STORE, { key, value });
  const updateConfig = (key: string, value: any) =>
    rawDbOperations.update(CONFIG_STORE, { key, value });
  const removeConfig = (key: string) =>
    rawDbOperations.remove(CONFIG_STORE, key);
  const getConfig = (key: string) => rawDbOperations.get(CONFIG_STORE, key);

  if (from <= 2) {
    // Upgrade v2 to v3:
    // add recent_project
    // add dev__suppress_before_unload
    await addConfig("recent_projects", []);
    await addConfig(
      "dev__suppress_before_unload",
      localStorage["dev__suppressBeforeUnload"] === "1"
    );
    localStorage.removeItem("dev__suppressBeforeUnload");
  }
}

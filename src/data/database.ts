import defer from "../util/defer";
import { VERSION } from "./buildData";
import * as Schema from "./schema";
import { initializeConfiguration, upgradeDatabase } from "./upgradeDatabase";

const DB_NAME = "design-awareness-local-store";
const DEBUG_DELAY = 0;

type DBID = string;

/**
 * whether the database is open
 */
let dbOpen = false;

/**
 * promise resolving to the open database
 */
let dbPromise: Promise<IDBDatabase>;

/**
 * whether the database open has been started
 */
let dbOpenAttempted = false;

/**
 * @returns whether the database is open
 */
export function isOpen() {
  return dbOpen;
}

const [_onUpgradeNeeded, requestUpgrade] = defer<number>();
export const onUpgradeNeeded = _onUpgradeNeeded;

type ObjectStoreName = Schema.EntityName | "_Config" | string;

/**
 * Get the IDB Database, opening it if it isn't open yet.
 * @param onblocked function to run if the database open blocks.
 *                  (only works on the first call)
 * @returns promise resolving to the open idb database
 */
function getDb(onblocked?: (evt: any) => void) {
  if (!dbOpenAttempted) {
    dbOpenAttempted = true;
    dbPromise = new Promise((res, rej) => {
      const request = window.indexedDB.open(DB_NAME, Schema.DB_VERSION);
      if (onblocked) {
        request.onblocked = onblocked;
      }
      request.onerror = rej;
      request.onupgradeneeded = (event) => {
        const db = (event.target as any as { result: IDBDatabase }).result;
        if (event.oldVersion === 0) {
          console.log("First visit: setting up database!");
          db.createObjectStore("AsyncEntry", { keyPath: "id" });
          db.createObjectStore("AsyncProject", { keyPath: "id" });
          db.createObjectStore("DesignModel", { keyPath: "id" });
          db.createObjectStore("ProjectNote", { keyPath: "id" });
          db.createObjectStore("RealtimeProject", { keyPath: "id" });
          db.createObjectStore("RealtimeSession", { keyPath: "id" });
          db.createObjectStore("TimedNote", { keyPath: "id" });
          db.createObjectStore("_Config", { keyPath: "key" });
        } else {
          console.log("Database needs upgrading: ");
          upgradeDatabase(event.oldVersion, db);
          dbPromise?.then(() => {
            requestUpgrade(event.oldVersion);
          });
        }
        dbPromise?.then(() => {
          console.log("initializing config!");
          initializeConfiguration(event.oldVersion, rawDatabaseOperations);
        });
      };
      request.onsuccess = (event) => {
        dbOpen = true;
        // @ts-ignore
        const db = event.target.result;
        db.onversionchange = (/*event*/) => {
          db.close();
          alert(
            "A new version of this page is ready. Please reload or close this tab!"
          );
        };
        res(db);
      };
    });
  }
  return dbPromise;
}

/**
 * Create a new transaction in the database. Opens the database if it
 * is not open already.
 * @param store name of the database store
 * @param accessLevel IDB transaction access level
 * @returns a tuple with a promise which will resolve when the
 *          transaction is complete, and the database object store on which
 *          operations can be performed.
 */
async function transaction(
  store: ObjectStoreName,
  accessLevel = "readonly" as IDBTransactionMode
): Promise<{
  complete: Promise<Event>;
  objectStore: IDBObjectStore;
}> {
  const db = await getDb();
  const transaction = db.transaction(store, accessLevel);
  return {
    complete: new Promise((res, rej) => {
      transaction.oncomplete = res;
      transaction.onerror = rej;
    }),
    objectStore: transaction.objectStore(store),
  };
}

/**
 * Adds given new entry (data) to the given datastore. Resolves when the
 * transaction is complete. Use update to update an existing entry.
 */
async function add(store: ObjectStoreName, data: any) {
  const { complete, objectStore } = await transaction(store, "readwrite");
  objectStore.add(data);
  await complete;
}

/**
 * Updates given entry in the given datastore. Resolves when the transaction
 * is complete. Use to update an entry that is already saved.
 */
async function update(store: ObjectStoreName, data: any) {
  const { complete, objectStore } = await transaction(store, "readwrite");
  objectStore.put(data);
  await complete;
}

/**
 * Remove entry with given id from the given datastore.
 */
async function remove(store: ObjectStoreName, id: DBID) {
  const { complete, objectStore } = await transaction(store, "readwrite");
  objectStore.delete(id);
  await complete;
}

/**
 * Resolves to the stored data for the given id from the given datastore.
 */
async function get(store: ObjectStoreName, id: DBID): Promise<object | null> {
  const objectStore = (await transaction(store)).objectStore;
  const request = objectStore.get(id);
  return (
    (await new Promise((res, rej) => {
      request.onerror = rej;
      request.onsuccess = res;
    })) as any
  )["target"]["result"];
}

export const rawDatabaseOperations = {
  add,
  update,
  remove,
  get,
};

/**
 * keys are entry ids waiting to be loaded, mapping to promises that will
 * resolve when the database returns the object.
 *
 * to support resolving cyclic references without deadlocking,
 * note that references to other entries may not be resolved yet when the
 * promise completes. instead, use getEntry to obtain a fully resolved model.
 *
 * always check this map before attempting to load an entry directly from
 * the database, to prevent duplicate objects for one entry.
 * getEntry and the model-specific get methods perform this check.
 */
const resolving = new Map<DBID, Promise<void>>();

/**
 * internal object lookup containing already resolved objects.
 * always lookup here before loading something from the database
 * yourself, or you might end up with multiple objects for the same entry.
 */
const objStore = {
  // i like the typing here but the sad truth is that we're always
  // gonna pull from here in getEntry which will type them as IDBClientObjects
  // and then the specific model getter methods cast back to the right type
  // ...oh well.
  AsyncEntry: new Map<DBID, Schema.AsyncEntry>(),
  AsyncProject: new Map<DBID, Schema.AsyncProject>(),
  DesignModel: new Map<DBID, Schema.DesignModel>(),
  ProjectNote: new Map<DBID, Schema.ProjectNote>(),
  RealtimeProject: new Map<DBID, Schema.RealtimeProject>(),
  RealtimeSession: new Map<DBID, Schema.RealtimeSession>(),
  TimedNote: new Map<DBID, Schema.TimedNote>(),
};

/**
 * Resolves to the IDs of all entries in the given datastore.
 */
export function getAll(store: Schema.EntityName): Promise<DBID[]> {
  return new Promise(async (res, rej) => {
    const objectStore = (await transaction(store)).objectStore;
    const request = objectStore.getAllKeys();
    request.onerror = rej;
    request.onsuccess = function (evt) {
      if (DEBUG_DELAY) {
        // @ts-ignore
        setTimeout(() => res(evt.target.result), DEBUG_DELAY);
      } else {
        // @ts-ignore
        res(evt.target.result);
      }
    };
  });
}

export function saveAll(objects: Schema.Entity[]): Promise<void[]> {
  return Promise.all(objects.map((object) => object.save()));
}

/**
 * Resolves to the entry with the given id in the given datastore.
 * If there is no entry for the given id, resolves to null.
 *
 * This operation is fast if the entry has already been loaded.
 * If called multiple times with the same id, it will always
 * resolve to the same client object. This is to ensure there is
 * one source-of-truth object for each database entry, so you
 * shouldn't attempt to copy or mutate the object other than
 * the public interface provided.
 *
 * Entries are wrapped with appropriate database manipulation methods
 * and all children will be fully resolved, so they are ready to use,
 * though for safety, you should cast to the appropriate model interface,
 * or use the helper methods (getDesignModel, etc.) that do this for you.
 * (Type checking is no longer enforced at runtime, so using the interfaces
 * will help you ensure type correctness when setting properties.)
 *
 * ======
 * There is a weird timing condition here where it's possible to get
 * an entry which doesn't have children fully resolved here, if we call
 * this again between the call to resolver() and before childResolutionPromise
 * resolves. Since we put clientObj in the object store, later calls will
 * resolve instantly, even if the first one isn't done recursively resolving
 * children yet. Is there a better way to fix this than creating another
 * promise map for full resolution and adding an additional (optional)
 * parameter to request full resolution?
 */
async function getEntry(
  store: Schema.EntityName,
  id: DBID
): Promise<Schema.Entity | null> {
  if (id === null) return null;

  const typeStore = objStore[store] as Map<DBID, Schema.Entity>;
  if (!typeStore.has(id)) {
    if (resolving.has(id)) {
      await resolving.get(id);
    } else {
      // needs to be resolved!
      const [promise, resolver] = defer<void>();
      resolving.set(id, promise);

      // lookup entry from db;
      const obj = (await get(store, id)) as Schema.Entity;
      if (!obj) {
        resolving.delete(id);
        return null;
      }

      const [clientObj, childResolutionPromise] = createClientObject(
        store,
        obj,
        id
      );

      // resolve complete
      resolving.delete(id);
      typeStore.set(id, clientObj);
      resolver();

      await childResolutionPromise;
    }
  }
  return typeStore.get(id) ?? null;
}

/**
 * database entry wrapper for happier clients!
 *
 * allows listening for updates to fields, checking dirty status,
 * and saving back to the database.
 *
 * if you cast this thing right, typescript will hopefully
 * keep you from doing bad things
 *
 * @param store type of model
 * @param rawObj raw object retrieved from database
 * @param id object id
 */
function createClientObject(
  store: Schema.EntityName,
  rawObj: Record<string, any>,
  _id: DBID | null = null
): [Schema.Entity, Promise<any[]>] {
  const schema = Schema.Schema[store];
  const data: Record<string, any> = {};
  const obj = {};
  const childResolvers = [];

  // client obj private properties
  let dirty = !_id;
  let saving = false;
  let id = _id;
  let deleted = false;

  for (let [name, dbtype, repeated] of schema) {
    if (dbtype == null) {
      data[name] = rawObj[name];
    } else {
      let modelName = dbtype;
      // children need resolving!!
      if (!repeated) {
        const childID = rawObj[name];
        if (childID) {
          childResolvers.push(
            (async () => {
              data[name] = await getEntry(modelName, childID);
            })()
          );
        } else {
          data[name] = null;
        }
      } else {
        if (rawObj[name].length) {
          childResolvers.push(
            (async () => {
              data[name] = await Promise.all(
                rawObj[name].map((childID: string) =>
                  getEntry(modelName, childID)
                )
              );
            })()
          );
        } else {
          data[name] = [];
        }
      }
    }
    Object.defineProperty(obj, name, {
      get() {
        return data[name];
      },
      set(v) {
        if (deleted) {
          throw new Error("Attempted to modify a deleted entry!");
        }
        if (v !== data[name]) {
          data[name] = v;
          dirty = true;
        }
      },
    });
  }

  // add wrapper properties & methods
  Object.defineProperty(obj, "dirty", { get: () => dirty });
  Object.defineProperty(obj, "saving", { get: () => saving });
  Object.defineProperty(obj, "id", { get: () => id });
  Object.defineProperty(obj, "deleted", { get: () => deleted });

  let removing: Promise<void> | null = null;
  Object.assign(obj, {
    // save is typed as async () => void to prevent
    // setting ids unless you really, really
    // mean to!
    async save(newSaveId: string) {
      if (dirty && !saving) {
        saving = true;
        const isNewEntry = id === null;
        if (id === null) {
          id = newSaveId || idgen();
          objStore[store].set(id, obj as any);
        }

        const dbObj: Record<string, any> = { id };
        const savingChildren = [];
        // pack into db-friendly object
        for (let [name, dbtype, repeated] of schema) {
          if (dbtype === null) {
            dbObj[name] = data[name];
          } else {
            // child db entry - save this too!
            // no issues with cycles - save is instant if already saving
            // that's actually maybe not ideal. we can save the promise
            // and return that if it's still saving? (but then need to add
            // another parameter or something)
            if (repeated) {
              dbObj[name] = [];
              if (!data[name]) data[name] = [];
              savingChildren.push(
                Promise.all(
                  (data[name] as any[]).map((child, i) => {
                    if (child === null) {
                      return null; // await Promise.resolve([null]) -> [null]
                    }
                    const childPromise = child.save();
                    dbObj[name][i] = child.id;
                    return childPromise;
                  })
                )
              );
            } else {
              if (data[name] === null) {
                dbObj[name] = null;
              } else {
                const childPromise = data[name].save();
                dbObj[name] = data[name].id;
                savingChildren.push(childPromise);
              }
            }
          }
        }

        dirty = false;

        // dbObj should be well formed now
        // write to database...
        if (isNewEntry) {
          await add(store, dbObj);
        } else {
          await update(store, dbObj);
        }

        // in case any children haven't finished saving...
        await Promise.all(savingChildren);

        saving = false;
      }
    },
    remove() {
      if (id !== null) {
        objStore[store].delete(id);
        deleted = true;
        removing = remove(store, id);
        id = null;
      }
      if (removing) {
        return removing;
      }
    },

    toSerializable() {
      const rawObj: Record<string, any> = {};
      for (let [name, isEntityType, repeated] of schema) {
        if (isEntityType) {
          if (repeated) {
            rawObj[name] = data[name].map((member: Schema.Entity) =>
              member.toSerializable()
            );
          } else {
            rawObj[name] = data[name].toSerializable();
          }
        } else {
          rawObj[name] = data[name];
        }
      }
      rawObj.id = id;
      return rawObj;
    },

    serialize(): string {
      const entryData = this.toSerializable();
      return JSON.stringify({
        $format: "design-awareness",
        version: "1.0.0",
        type: store,
        data: entryData,
        meta: {
          encoder: "design-awareness-app@" + VERSION,
        },
      });
    },
  });

  return [obj as Schema.Entity, Promise.all(childResolvers)];
}

export function getAsyncEntry(id: DBID) {
  return getEntry("AsyncEntry", id) as Promise<Schema.AsyncEntry>;
}
export function getAsyncProject(id: DBID) {
  return getEntry("AsyncProject", id) as Promise<Schema.AsyncProject>;
}
export function getDesignModel(id: DBID) {
  return getEntry("DesignModel", id) as Promise<Schema.DesignModel>;
}
export function getProjectNote(id: DBID) {
  return getEntry("ProjectNote", id) as Promise<Schema.ProjectNote>;
}
export function getRealtimeProject(id: DBID) {
  return getEntry("RealtimeProject", id) as Promise<Schema.RealtimeProject>;
}
export function getRealtimeSession(id: DBID) {
  return getEntry("RealtimeSession", id) as Promise<Schema.RealtimeSession>;
}
export function getTimedNote(id: DBID) {
  return getEntry("TimedNote", id) as Promise<Schema.TimedNote>;
}

export function getEntityOrFail<T>(promise: Promise<T>): Promise<T> {
  return new Promise((res, rej) =>
    promise.then((object) => {
      if (object !== null) res(object);
      rej(null);
    })
  );
}

function newEntity(type: Schema.EntityName) {
  const schema = Schema.Schema[type];
  const defaults = Object.fromEntries(
    schema.map(([prop, entityType, def]) => [
      prop,
      entityType === null
        ? typeof def === "function"
          ? def()
          : def
        : def
        ? []
        : null,
    ])
  );
  return createClientObject(type, defaults);
}

export function newAsyncEntry() {
  return newEntity("AsyncEntry")[0] as Schema.AsyncEntry;
}
export function newAsyncProject() {
  return newEntity("AsyncProject")[0] as Schema.AsyncProject;
}
export function newDesignModel() {
  return newEntity("DesignModel")[0] as Schema.DesignModel;
}
export function newRealtimeProjectNote() {
  return newEntity("ProjectNote")[0] as Schema.ProjectNote;
}
export function newRealtimeProject() {
  return newEntity("RealtimeProject")[0] as Schema.RealtimeProject;
}
export function newRealtimeSession() {
  return newEntity("RealtimeSession")[0] as Schema.RealtimeSession;
}
export function newTimedNote() {
  return newEntity("TimedNote")[0] as Schema.TimedNote;
}

/**
 * Returns a unique* 24 character alphanumeric id.
 * The first 16 characters are random, and the last 8
 * are derived from the current millisecond.
 *
 * *The chance of collision is somewhere around 1:10^24 for ids
 * generated in the same millisecond. That *should* be fine...
 */
function idgen() {
  return (
    Date.now().toString(36).substring(-8) +
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
  );
}

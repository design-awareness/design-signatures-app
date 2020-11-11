import * as Schema from "./schema";
import defer from "../util/defer";

const DB_NAME = "design-awareness-local-store";

type DBID = string;

/**
 * whether the database is open
 */
let dbOpen = false;

/**
 * promise resolving to the open database
 */
let dbPromise: Promise<IDBDatabase> = null;

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
        console.log("Setting up database...");
        const db = ((event.target as unknown) as { result: IDBDatabase })
          .result;
        db.createObjectStore("ActivitySet", { keyPath: "id" });
        db.createObjectStore("Note", { keyPath: "id" });
        db.createObjectStore("Project", { keyPath: "id" });
        db.createObjectStore("Session", { keyPath: "id" });
      };
      request.onsuccess = (event) => {
        dbOpen = true;
        // @ts-ignore
        const db = event.target.result;
        db.onversionchange = (event) => {
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
  store: Schema.DBModelName,
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
async function add(store: Schema.DBModelName, data) {
  const { complete, objectStore } = await transaction(store, "readwrite");
  objectStore.add(data);
  await complete;
}

/**
 * Updates given entry in the given datastore. Resolves when the transaction
 * is complete. Use to update an entry that is already saved.
 */
async function update(store: Schema.DBModelName, data) {
  const { complete, objectStore } = await transaction(store, "readwrite");
  objectStore.put(data);
  await complete;
}

/**
 * Remove entry with given id from the given datastore.
 */
async function remove(store: Schema.DBModelName, id: DBID) {
  const { complete, objectStore } = await transaction(store, "readwrite");
  objectStore.delete(id);
  await complete;
}

/**
 * Resolves to the stored data for the given id from the given datastore.
 */
async function get(
  store: Schema.DBModelName,
  id: DBID
): Promise<object | null> {
  const objectStore = (await transaction(store)).objectStore;
  const request = objectStore.get(id);
  return (
    await new Promise((res, rej) => {
      request.onerror = rej;
      request.onsuccess = res;
    })
  )["target"]["result"];
}

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
  ActivitySet: new Map<DBID, Schema.ActivitySet>(),
  Note: new Map<DBID, Schema.Note>(),
  Project: new Map<DBID, Schema.Project>(),
  Session: new Map<DBID, Schema.Session>(),
};

/**
 * Resolves to the IDs of all entries in the given datastore.
 */
export function getAll(store: Schema.DBModelName): Promise<DBID[]> {
  return new Promise(async (res, rej) => {
    const objectStore = (await transaction(store)).objectStore;
    const request = objectStore.getAllKeys();
    request.onerror = rej;
    request.onsuccess = function (evt) {
      // @ts-ignore
      res(evt.target.result);
    };
  });
}

export function saveAll(
  objects: (
    | Schema.ActivitySet
    | Schema.Note
    | Schema.Project
    | Schema.Session
  )[]
): Promise<void[]> {
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
 * or use the helper methods (getActivitySet, etc.) that do this for you.
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
  store: Schema.DBModelName,
  id: DBID
): Promise<Schema.IDBObj> {
  if (id === null) return null;

  const typeStore = objStore[store] as Map<DBID, Schema.IDBObj>;
  if (!typeStore.has(id)) {
    if (resolving.has(id)) {
      await resolving.get(id);
    } else {
      // needs to be resolved!
      const [promise, resolver] = defer<void>();
      resolving.set(id, promise);

      // lookup entry from db;
      const obj = (await get(store, id)) as Schema.IDBObj;
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
  return typeStore.get(id);
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
  store: Schema.DBModelName,
  // ugh we probably should type raw and wrapped objects differently!
  rawObj: Schema.IDBObj,
  _id: DBID | null = null
): [Schema.IDBObj, Promise<any[]>] {
  const schema = Schema.Schema[store];
  const data = {};
  const obj = {};
  const childResolvers = [];
  const subscriptions = new Set();

  // client obj private properties
  let dirty = !_id;
  let saving = false;
  let id = _id;
  let deleted = false;

  for (let [name, dbtype] of schema) {
    if (dbtype == null) {
      data[name] = rawObj[name];
    } else {
      // children need resolving!!
      const [modelName, repeated] = dbtype;
      if (!repeated) {
        const childID = rawObj[name];
        childResolvers.push(
          (async () => {
            data[name] = await getEntry(modelName, childID);
          })()
        );
      } else {
        childResolvers.push(
          (async () => {
            data[name] = await Promise.all(
              rawObj[name].map((childId) => getEntry(modelName, childId))
            );
          })()
        );
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
          // @ts-ignore
          subscriptions.forEach((k) => k.call(obj, name, v));
        }
      },
    });
  }

  // add wrapper properties & methods
  Object.defineProperty(obj, "dirty", { get: () => dirty });
  Object.defineProperty(obj, "saving", { get: () => saving });
  Object.defineProperty(obj, "id", { get: () => id });
  Object.defineProperty(obj, "deleted", { get: () => deleted });

  let removing: Promise<void> = null;
  Object.assign(obj, {
    subscribe(fn) {
      subscriptions.add(fn);
    },
    unsubscribe(fn) {
      subscriptions.delete(fn);
    },
    async save() {
      if (dirty && !saving) {
        saving = true;
        const isNewEntry = id === null;
        if (id === null) {
          id = idgen();
          objStore[store].set(id, obj as any);
        }

        const dbObj = { id };
        const savingChildren = [];
        // pack into db-friendly object
        for (let [name, dbtype] of schema) {
          if (dbtype === null) {
            dbObj[name] = data[name];
          } else {
            // child db entry - save this too!
            // no issues with cycles - save is instant if already saving
            // that's actually maybe not ideal. we can save the promise
            // and return that if it's still saving? (but then need to add
            // another parameter or something)
            const repeated = dbtype[1];
            if (repeated) {
              dbObj[name] = [];
              if (!data[name]) data[name] = [];
              savingChildren.push(
                Promise.all(
                  data[name].map((child, i) => {
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
                if (data[name]) {
                  const childPromise = data[name].save();
                  dbObj[name] = data[name].id;
                  savingChildren.push(childPromise);
                } else {
                  dbObj[name] = null;
                }
              }
            }
          }
        }

        dirty = false;

        // dbObj should be well formed now
        // write to database...
        await (isNewEntry ? add : update)(store, dbObj);

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
  });

  // this cast isn't really right but... i dont want to add a type
  // parameter to this function or export the interface from schema.ts :[
  // the model specific get methods will take care of it
  // i'll do typescript right in the svelte components (lmao)
  return [obj as Schema.IDBObj, Promise.all(childResolvers)];
}

export function getActivitySet(id: DBID) {
  return getEntry("ActivitySet", id) as Promise<Schema.ActivitySet>;
}
export function getNote(id: DBID) {
  return getEntry("Note", id) as Promise<Schema.Note>;
}
export function getProject(id: DBID) {
  return getEntry("Project", id) as Promise<Schema.Project>;
}
export function getSession(id: DBID) {
  return getEntry("Session", id) as Promise<Schema.Session>;
}

export function newActivitySet() {
  return createClientObject(
    "ActivitySet",
    {
      name: "",
      description: "",
      activityNames: [],
      activityCodes: [],
      activityDescriptions: [],
      colors: [],
    },
    null
  )[0] as Schema.ActivitySet;
}
export function newNote() {
  return createClientObject(
    "Note",
    {
      contents: "",
      created: new Date(),
      timed: false,
      timestamp: 0,
      session: null,
      project: null,
    },
    null
  )[0] as Schema.Note;
}
export function newProject() {
  return createClientObject(
    "Project",
    {
      name: "",
      description: "",
      active: true,
      created: new Date(),
      lastModified: new Date(),
      activitySet: null,
      notes: [],
      sessions: [],
    },
    null
  )[0] as Schema.Project;
}
export function newSession() {
  return createClientObject(
    "Session",
    {
      label: "",
      startTime: new Date(),
      duration: 0,
      data: [],
      project: null,
    },
    null
  )[0] as Schema.Session;
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
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36).substring(-8)
  );
}

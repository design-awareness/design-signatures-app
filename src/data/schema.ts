export const DB_VERSION = 4;
export const WELL_KNOWN_ENTITY_PREFIX = "well-known:";

// Raw datatypes from design-awareness/data
import type * as DataType from "design-awareness-data-types";
import type {
  DeepReadonly,
  DeepRequired,
  SetPropertyTypes,
} from "../types/utility";

/**
 * Base methods available on database entity objects
 */
export interface Entity extends DataType.Entity {
  readonly id: string;
  readonly dirty: boolean;
  readonly saving: boolean;
  readonly deleted: boolean;
  save(): Promise<void>;
  remove(): Promise<void>;
  toSerializable(): object;
  serialize(): string;
}

// [key, model name, array?]
// [key, null, default]
type SchemaDefn<I extends Entity> = {
  [K in keyof Omit<I, keyof Entity>]: I[K] extends Entity
    ? [EntityName, false]
    : I[K] extends readonly Entity[]
    ? [EntityName, true]
    : [null, I[K] | (() => I[K])];
};

type NonStrictSchemaDefn = {
  [key: string]: [EntityName, boolean] | [null, any | (() => any)];
};

function makeSchema<I extends Entity>(
  definition: SchemaDefn<I>
): ([string, EntityName, boolean] | [string, null, (() => any) | any])[] {
  return Object.entries(definition as NonStrictSchemaDefn).map(
    ([prop, [p1, p2]]) => [prop, p1, p2]
  );
}

export type EntityName =
  | "AsyncEntry"
  | "AsyncProject"
  | "DesignModel"
  | "ProjectNote"
  | "RealtimeProject"
  | "RealtimeSession"
  | "TimedNote";

function currentDate() {
  return new Date();
}
function emptyArr() {
  return [];
}

type Prepare<I> = Omit<DeepReadonly<DeepRequired<I>>, "id">;

///// INTERFACE DEFINITIONS

export interface AsyncEntry extends Entity, Prepare<DataType.AsyncEntry> {}

const AsyncEntrySchema = makeSchema<AsyncEntry>({
  created: [null, currentDate],
  data: [null, emptyArr],
  modified: [null, currentDate],
  note: [null, ""],
  period: [null, currentDate],
});

export interface AsyncProject
  extends Entity,
    SetPropertyTypes<
      Prepare<DataType.AsyncProject>,
      [
        ["designModel", DesignModel],
        ["entries", readonly AsyncEntry[]],
        ["notes", readonly ProjectNote[]]
      ]
    > {}

const AsyncProjectSchema = makeSchema<AsyncProject>({
  active: [null, true],
  created: [null, currentDate],
  description: [null, ""],
  designModel: ["DesignModel", false],
  entries: ["AsyncEntry", true],
  modified: [null, currentDate],
  name: [null, ""],
  notes: ["ProjectNote", true],
  periodAlignment: [null, 0],
  reportingPeriod: [null, "day"],
});

export interface DesignModel extends Entity, Prepare<DataType.DesignModel> {}

const DesignModelSchema = makeSchema<DesignModel>({
  activities: [null, emptyArr],
  description: [null, null],
  name: [null, ""],
  wellKnown: [null, false],
});

export interface ProjectNote extends Entity, Prepare<DataType.ProjectNote> {}

const ProjectNoteSchema = makeSchema<ProjectNote>({
  content: [null, ""],
  created: [null, currentDate],
});

export interface RealtimeProject
  extends Entity,
    SetPropertyTypes<
      Prepare<DataType.RealtimeProject>,
      [
        ["designModel", DesignModel],
        ["notes", readonly ProjectNote[]],
        ["sessions", readonly RealtimeSession[]]
      ]
    > {}

const RealtimeProjectSchema = makeSchema<RealtimeProject>({
  active: [null, true],
  created: [null, currentDate],
  description: [null, ""],
  designModel: ["DesignModel", false],
  modified: [null, currentDate],
  name: [null, ""],
  notes: ["ProjectNote", true],
  sessions: ["RealtimeSession", true],
});

export interface RealtimeSession
  extends Entity,
    SetPropertyTypes<
      Prepare<DataType.RealtimeSession>,
      [["notes", TimedNote[]]]
    > {}

const RealtimeSessionSchema = makeSchema<RealtimeSession>({
  data: [null, emptyArr],
  duration: [null, 0],
  notes: ["TimedNote", true],
  start: [null, currentDate],
});

export interface TimedNote extends Entity, Prepare<DataType.TimedNote> {}

const TimedNoteSchema = makeSchema<TimedNote>({
  content: [null, ""],
  created: [null, currentDate],
  time: [null, 0],
});

export const Schema: Record<
  EntityName,
  ([string, EntityName, boolean] | [string, null, any])[]
> = {
  AsyncEntry: AsyncEntrySchema,
  AsyncProject: AsyncProjectSchema,
  DesignModel: DesignModelSchema,
  ProjectNote: ProjectNoteSchema,
  RealtimeProject: RealtimeProjectSchema,
  RealtimeSession: RealtimeSessionSchema,
  TimedNote: TimedNoteSchema,
};

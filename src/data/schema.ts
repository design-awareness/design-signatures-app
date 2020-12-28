export const DB_VERSION = 3;

export interface IDBObj {}

type SubscriptionHandler<T> = (this: T, field: string, value: any) => void;
interface IDBClientObj<T> {
  readonly id: string;
  subscribe(handler: SubscriptionHandler<T>): void;
  unsubscribe(handler: SubscriptionHandler<T>): void;
  readonly dirty: boolean;
  readonly saving: boolean;
  readonly deleted: boolean;
  save(): Promise<void>;
  remove(): Promise<void>;
}
//               name    dbtype, repeated?
type DBSchema = [string, [DBModelName, boolean] | null][];

export interface ActivitySet extends IDBObj, IDBClientObj<ActivitySet> {
  name: string;
  description: string;
  activityNames: readonly string[];
  activityCodes: readonly string[];
  activityDescriptions: readonly string[];
  colors: readonly string[];
  wellKnown: boolean;
}
const ActivitySetSchema: DBSchema = [
  ["name", null],
  ["description", null],
  ["activityNames", null],
  ["activityCodes", null],
  ["activityDescriptions", null],
  ["colors", null],
  ["wellKnown", null],
];

export interface Note extends IDBObj, IDBClientObj<Note> {
  contents: string;
  created: Date;
  timed: boolean;
  timestamp: number;
  session: Session;
  project: Project;
}
const NoteSchema: DBSchema = [
  ["contents", null],
  ["created", null],
  ["timed", null],
  ["timestamp", null],
  ["session", ["Session", false]],
  ["project", ["Project", false]],
];

export interface Project extends IDBObj, IDBClientObj<Project> {
  name: string;
  description: string;
  active: boolean;
  created: Date;
  lastModified: Date;
  activitySet: ActivitySet;
  notes: readonly Note[];
  sessions: readonly Session[];
}
const ProjectSchema: DBSchema = [
  ["name", null],
  ["description", null],
  ["active", null],
  ["created", null],
  ["lastModified", null],
  ["activitySet", ["ActivitySet", false]],
  ["notes", ["Note", true]],
  ["sessions", ["Session", true]],
];

export interface Session extends IDBObj, IDBClientObj<Session> {
  label: string; // reserved for future use
  startTime: Date;
  duration: number;
  data: readonly [number, number][][];
  project: Project;
}
const SessionSchema: DBSchema = [
  ["label", null],
  ["startTime", null],
  ["duration", null],
  ["data", null],
  ["project", ["Project", false]],
];

export type DBModelName = "ActivitySet" | "Note" | "Project" | "Session";
export const Schema = {
  ActivitySet: ActivitySetSchema,
  Note: NoteSchema,
  Project: ProjectSchema,
  Session: SessionSchema,
};

import { VERSION } from "./buildData";
import type { ActivitySet, Note, Project, Session } from "./schema";

export function serialize(project: Project) {
  return JSON.stringify(wrap(serializeProject(project)));
}

function serializeProject(project: Project) {
  let {
    active,
    activitySet,
    created,
    description,
    id,
    lastModified,
    name,
    notes,
    sessions,
  } = project;
  return {
    active,
    created,
    description,
    designModel: serializeActivitySet(activitySet),
    id,
    modified: lastModified,
    name,
    notes: notes.map(serializeNote),
    sessions: sessions.map(serializeSession),
  };
}

function serializeActivitySet(activitySet: ActivitySet) {
  let {
    activityCodes,
    activityDescriptions,
    activityNames,
    colors,
    description,
    id,
    name,
  } = activitySet;
  return {
    activities: activityCodes.map((code, i) => ({
      code,
      color: colors[i],
      description: activityDescriptions[i],
      name: activityNames[i],
    })),
    description: description ? { description } : null,
    id: "@@legacy/" + id,
    name,
  };
}

function serializeNote(note: Note) {
  let { contents, created, id } = note;
  return {
    content: contents,
    created,
    id,
  };
}

function serializeSession(session: Session) {
  let { data, duration, id, startTime } = session;
  return {
    data,
    duration,
    id,
    start: startTime,
  };
}

function wrap(data: any) {
  return {
    $format: "design-awareness",
    version: "1.0.0",
    type: "RealtimeProject",
    data,
    meta: {
      encoder: "design-awareness-app/legacy@" + VERSION,
    },
  };
}

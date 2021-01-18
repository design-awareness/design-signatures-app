import { sortBy, sortWith } from "../util/sort";

export function toEventTimeline(
  data: readonly [number, number][][]
): [number, number, boolean][] {
  let timeline: [number, number, boolean][] = [];

  data.forEach((activityEvents, i) => {
    activityEvents.forEach(([timeOn, timeOff]) => {
      timeline.push([i, timeOn, true]);
      if (timeOff !== -1) {
        timeline.push([i, timeOff, false]);
      }
    });
  });

  return sortWith((d) => d[1], timeline);
}

export function toStateTimeline(
  data: readonly [number, number][][],
  coalesceThreshold: number = 0,
  startOffset: number = 0
): [number, boolean[]][] {
  const eventTimeline = toEventTimeline(data);
  let lastState: [number, boolean[]] = [
    startOffset,
    new Array<boolean>(data.length).fill(false),
  ];
  let states = [lastState];

  eventTimeline.forEach(([idx, time, val]) => {
    let newState = lastState[1].slice();
    newState[idx] = val;
    if (time - lastState[0] <= coalesceThreshold) {
      lastState[1] = newState;
    } else {
      let newPair = [time, newState] as [number, boolean[]];
      lastState = newPair;
      states.push(newPair);
    }
  });

  return states;
}

export function toStateDurationTimeline(
  data: readonly [number, number][][],
  duration: number,
  coalesceThreshold: number = 0,
  startOffset: number = 0
): [[number, number], boolean[]][] {
  let stateTimeline = toStateTimeline(data, coalesceThreshold, startOffset);
  let lastEvent = stateTimeline.length - 1;
  return stateTimeline.map(([startTime, state], i) =>
    i < lastEvent
      ? [[startTime, stateTimeline[i + 1][0]], state]
      : [[startTime, duration], state]
  );
}

export function toActiveActivitiesTimeline<T>(
  data: readonly [T, boolean[]][]
): readonly [T, number[]][] {
  return data.map(([a, b]) => [a, toActiveActivities(b)]);
}

export function toActiveActivities(data: readonly boolean[]): number[] {
  let result = [];
  data.forEach((b, i) => b && result.push(i));
  return result;
}

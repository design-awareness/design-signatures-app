import type { Weekday } from "design-awareness-data-types";
import type { AsyncEntry, AsyncProject } from "../data/schema";
import type { DateString } from "./date";
import { floorDateToWeekday, toDateString } from "./date";

// week -> date -> entry
export type EntryTable = Map<DateString, Map<DateString, AsyncEntry>>;

export function makeEntryTable({
  entries,
  periodAlignment,
  reportingPeriod,
}: AsyncProject): EntryTable {
  let table = new Map<DateString, Map<DateString, AsyncEntry>>();
  entries.forEach((entry) =>
    insertIntoEntryTable(table, entry, reportingPeriod, periodAlignment)
  );
  return table;
}

export function insertIntoEntryTable(
  table: EntryTable,
  entry: AsyncEntry,
  reportingPeriod: AsyncProject["reportingPeriod"],
  periodAlignment: Weekday
): void {
  let week = toDateString(floorDateToWeekday(entry.period, periodAlignment));
  let day = reportingPeriod === "week" ? week : toDateString(entry.period);

  let weekTable = table.get(week);
  if (!weekTable) {
    weekTable = new Map<DateString, AsyncEntry>();
    table.set(week, weekTable);
  }

  weekTable.set(day, entry);
}

export function removeFromEntryTable(
  table: EntryTable,
  entry: AsyncEntry,
  reportingPeriod: AsyncProject["reportingPeriod"],
  periodAlignment: Weekday
): void {
  let week = toDateString(floorDateToWeekday(entry.period, periodAlignment));
  let day = reportingPeriod === "week" ? week : toDateString(entry.period);

  let weekTable = table.get(week);
  if (weekTable) {
    weekTable.delete(day);
    if (weekTable.size === 0) {
      table.delete(week);
    }
  }
}

export function sumActivityTimes(
  entries: Iterable<AsyncEntry>,
  activityCount: number
): AsyncEntry["data"] {
  let resultData: number[] = new Array(activityCount).fill(0);
  for (let entry of entries) {
    entry.data.forEach(({ value }, i) => {
      resultData[i] += value;
    });
  }
  return resultData.map((value) => ({
    value,
    note: "",
  }));
}

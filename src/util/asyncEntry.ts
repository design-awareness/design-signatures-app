import type { Weekday } from "design-awareness-data-types";
import type { AsyncEntry, AsyncProject } from "../data/schema";
import type { DateString } from "./date";
import { floorDateToWeekday, toDateString } from "./date";

// week -> date -> entry
type DailyEntryTable = Map<DateString, Map<DateString, AsyncEntry>>;

export function makeEntryTable({
  entries,
  periodAlignment,
  reportingPeriod,
}: AsyncProject): DailyEntryTable {
  let table = new Map<DateString, Map<DateString, AsyncEntry>>();
  entries.forEach((entry) =>
    insertIntoEntryTable(table, entry, reportingPeriod, periodAlignment)
  );
  return table;
}

export function insertIntoEntryTable(
  table: DailyEntryTable,
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

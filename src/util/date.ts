/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { Weekday } from "design-awareness-data-types";
import { pad } from "./time";

export type DateString = `${number}-${string}-${string}`;

export interface SimpleDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Convert a date to its ISO date string representation
 * @param date Date to convert
 * @returns ISO string representing that date
 */
export function toDateString(date: SimpleDate | Date): DateString {
  if (date instanceof Date) {
    date = fromDate(date);
  }
  let { year, month, day } = date;
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/**
 * Month names
 */
export const MONTH_NAME = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Abbreviated month names
 */
export const MONTH_SHORT_NAME = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Get a Date with a timezone-agnostic (UTC) representation of the current date
 */
export function getToday(): Date {
  const today = new Date();
  return makeDate({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  });
}

/**
 * Create a Date with a given UTC year, month, and day.
 * @param param0 year/month/day object
 * @returns the Date with that year, month, and day
 */
export function makeDate({ year, month, day }: SimpleDate): Date {
  const date = new Date();
  date.setTime(0);
  date.setUTCFullYear(year, month, day);
  return date;
}

/**
 * Convert a Date to a SimpleDate
 * @param date
 * @returns the SimpleDate with the year, month, and day
 */
export function fromDate(date: Date): SimpleDate {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}

/**
 * Modifies a date by a certain number of days
 * @param date Date to modify
 * @param days number of days to add (negative to subtract)
 */
export function addDays(date: Date, days: number): void {
  date.setUTCDate(date.getUTCDate() + days);
}

/**
 * "Rounds" a date down to the given weekday.
 *
 * @param date date object to be floored
 * @param weekday target day of the week
 * @returns a new Date object, representing the latest day <= the given `date`
 *          whose UTCDay is `weekday`
 */
export function floorDateToWeekday(date: Date, weekday: Weekday): Date {
  let dateCopy = new Date(date);
  while (dateCopy.getUTCDay() !== weekday) {
    addDays(dateCopy, -1);
  }
  return dateCopy;
}

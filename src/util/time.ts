/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export function splitDuration(total: number) {
  let seconds = Math.floor(total / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  let hours = Math.floor(minutes / 60);
  minutes %= 60;
  return { seconds, minutes, hours };
}

export function shortDuration(total: number) {
  let { seconds, minutes, hours } = splitDuration(total);
  if (hours) {
    return hours + ":" + pad(minutes) + ":" + pad(seconds);
  } else {
    return minutes + ":" + pad(seconds);
  }
}

export function timelineDuration(t: number) {
  let { seconds, minutes, hours } = splitDuration(t);
  if (hours && seconds) {
    return hours + ":" + pad(minutes) + ":" + pad(seconds);
  }
  let str = "";
  if (hours) str += hours + "h ";
  if (minutes) str += minutes + "m ";
  if (seconds) str += seconds + "s";
  return str;
}

export function expressiveDuration(t: number) {
  let { seconds, minutes, hours } = splitDuration(t);
  if (hours) {
    let str = hours + "h";
    if (minutes) {
      str += " " + pad(minutes) + "m";
    }
    return str;
  } else if (minutes) {
    return minutes + "m";
  } else {
    return seconds + "s";
  }
}

export function expressiveDurationM(mins: number) {
  return expressiveDuration(mins * 60 * 1000);
}

export function pad(n: number) {
  return ("0" + n).substr(-2);
}

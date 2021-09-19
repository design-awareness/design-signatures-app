/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const knownCodes = new Map([
  ["PROBLEM DEFINITION", "PD"], // PROB
  // ["GATHER INFORMATION", "GATH"],
  // ["GENERATE IDEAS", "GEN"],
  // ["MODEL", "MOD"],
  // ["FEASIBILITY ANALYSIS", "FEAS"],
  // ["EVALUATION", "EVAL"],
  // ["DECISION", "DEC"],
  ["COMMUNICATION", "COM"], // COMM
  ["IDENTIFY A NEED", "ID"], // IDEN
  // ["IMPLEMENTATION", "IMPL"],
]) as ReadonlyMap<string, string>;

const vowels = ["A", "E", "I", "O", "U"];

export default function abbreviateActivityName(name: string): string {
  name = name.toUpperCase().trim();
  if (knownCodes.has(name)) {
    return knownCodes.get(name) as string;
  }

  const normalized = name.replace(/[^\w\s]+/g, "");

  // 4 chars or less - use as is
  if (normalized.length < 5) {
    return normalized;
  }

  if (~vowels.indexOf(normalized.charAt(3))) {
    // 4th character is a vowel
    return normalized.substr(0, 3);
  } else {
    return normalized.substr(0, 4);
  }
}

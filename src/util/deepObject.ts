/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { hasOwnProperty } from "../types/utility";

/**
 * Creates a deep clone of an object. Do not use with objects that contain
 * circular references or functions!
 * @throws if the object contains any functions
 * @param source object to clone
 * @returns clone of the given object
 */
export function deepClone<T>(source: T): T {
  let type = typeof source;
  if (type === "function") {
    throw new Error("Cannot deep clone objects containing functions!");
  }
  if (type === "object" && source !== null) {
    if (Array.isArray(source)) {
      return source.map(deepClone) as unknown as T;
    }
    let clone: Record<any, any> = {};
    for (let prop in source) {
      if (hasOwnProperty(source, prop)) {
        clone[prop] = deepClone(source[prop]);
      }
    }
    return clone;
  } else {
    // value will be copied.
    return source;
  }
}

export function deepEquals<T>(a: T, b: T): boolean {
  let aType = typeof a;
  let bType = typeof b;
  if (aType !== bType) return false;
  if (aType === "object" && a !== null && b !== null) {
    let aIsArray = Array.isArray(a);
    let bIsArray = Array.isArray(b);
    if (aIsArray !== bIsArray) return false;
    if (aIsArray) {
      let aAsArray = a as unknown as any[];
      let bAsArray = a as unknown as any[];
      if (aAsArray.length !== bAsArray.length) return false;
      return aAsArray.every((v, i) => deepEquals(v, bAsArray[i]));
    }
    let aIsDate = a instanceof Date;
    let bIsDate = b instanceof Date;
    if (aIsDate !== bIsDate) return false;
    if (aIsDate) {
      let aAsDate = a as unknown as Date;
      let bAsDate = b as unknown as Date;
      return aAsDate.getTime() === bAsDate.getTime();
    }
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (let prop in a) {
      if (hasOwnProperty(a, prop) && !deepEquals(a[prop], b[prop])) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}

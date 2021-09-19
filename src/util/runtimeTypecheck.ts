/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { hasOwnProperty } from "../types/utility";

export function typeIsNull(value: any): value is null {
  return value === null;
}
export function typeIsNumber(value: any): value is number {
  return typeof value === "number";
}
export function typeIsBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}
export function typeIsString(value: any): value is string {
  return typeof value === "string";
}
export function typeIsNonemptyString(value: any): value is Exclude<string, ""> {
  return typeof value === "string" && value !== "";
}
export function typeIsDate(value: any): value is Date {
  return value instanceof Date;
}
export function typeIsRecord(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function typeIsArrayOf<T>(test: (value: any) => value is T) {
  return (value: any): value is T[] => {
    if (Array.isArray(value)) {
      return value.every(test);
    }
    return false;
  };
}
export function typeIsEnum<T extends string | number | symbol>(members: T[]) {
  return (value: any): value is T => members.includes(value);
}
export function typeIsNumberPair(
  value: any
): value is readonly [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeIsNumber(value[0]) &&
    typeIsNumber(value[1])
  );
}
export function typeIsColorTuple(
  value: any
): value is readonly [string, string] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeIsString(value[0]) &&
    typeIsString(value[1]) &&
    value[0].length === 6 &&
    value[1].length === 6
  );
}

export function typeSatisfiesAll<S>(
  ...tests: ((value: any) => value is Partial<S>)[]
) {
  return (value: any): value is S => tests.every((test) => test(value));
}

export function typeSatisfiesAny<S>(...tests: ((value: any) => value is S)[]) {
  return (value: any): value is S => tests.some((test) => test(value));
}

export function checkProperty<P extends string | number | symbol, T>(
  property: P,
  propertyTypeTest: (value: any) => value is T
) {
  return <V extends Record<any, any>>(
    value: Record<any, any>
  ): value is V & Record<P, T> =>
    hasOwnProperty(value, property) && propertyTypeTest(value[property]);
}

export function checkOptionalProperty<P extends string | number | symbol, T>(
  property: P,
  propertyTypeTest: (value: any) => value is T
) {
  return <V extends Record<any, any>>(
    value: Record<any, any>
  ): value is V & Record<P, T | undefined> =>
    !hasOwnProperty(value, property) || propertyTypeTest(value[property]);
}

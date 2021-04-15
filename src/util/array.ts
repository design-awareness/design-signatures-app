/**
 * Set an element in an immutable array by making a copy
 * with that element changed
 * @param arr readonly array to modify
 * @param i index of element to change
 * @param v new value that should go at index i
 * @returns a copy arrCopy of arr, with arrCopy[i] === v
 */
export function setInArray<T>(arr: readonly T[], i: number, v: T): T[] {
  const newArr = arr.slice();
  newArr[i] = v;
  return newArr;
}

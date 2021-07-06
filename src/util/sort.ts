export function sortBy<P extends Record<string, any>>(
  key: keyof P,
  list: readonly P[],
  ascending = true
): P[] {
  return sortWith((el) => el[key], list, ascending);
}

export function sortWith<P, Q>(
  transformer: (arg0: P) => Q,
  list: readonly P[],
  ascending = true
): P[] {
  let newList = [...list]; // copy - sort() mutates!
  const sign = ascending ? 1 : -1;
  newList.sort((a, b) => {
    const _a = transformer(a);
    const _b = transformer(b);
    if (_a > _b) {
      return sign;
    } else if (_a < _b) {
      return -sign;
    } else {
      return 0;
    }
  });
  return newList;
}

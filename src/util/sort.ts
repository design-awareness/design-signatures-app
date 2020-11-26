export function sortBy<P>(key: string, list: P[], ascending = true): P[] {
  return sortWith((el) => el[key], list, ascending);
}

export function sortWith<P, Q>(
  transformer: (arg0: P) => Q,
  list: P[],
  ascending = true
): P[] {
  list = [...list]; // copy - sort() mutates!
  const sign = ascending ? 1 : -1;
  list.sort((a, b) => {
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
  return list;
}

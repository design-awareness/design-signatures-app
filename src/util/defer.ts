export default function defer<T>(): [Promise<T>, (value: T) => void] {
  let res: (value: T) => void;
  const promise = new Promise((_res) => {
    res = _res;
  }) as Promise<T>;
  // @ts-expect-error
  return [promise, res];
}

export default function defer<T>(): [Promise<T>, (arg0: T) => void] {
  let res: () => any;
  const promise = new Promise((_res) => {
    res = _res;
  }) as Promise<T>;
  return [promise, res];
}

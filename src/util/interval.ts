export default function interval(
  node: HTMLElement,
  {
    start,
    duration,
    tick,
    stop,
  }: {
    duration: number;
    start: () => {};
    tick: () => {};
    stop: () => {};
  }
): {
  update: (arg0: {
    duration: number;
    start: () => {};
    tick: () => {};
    stop: () => {};
  }) => void;
  destroy: () => void;
} {
  start();
  let _stop = stop;
  let handle = setInterval(tick, duration);
  return {
    update({ duration, tick, stop }) {
      clearInterval(handle);
      handle = setInterval(tick, duration);
      _stop = stop;
    },
    destroy() {
      clearInterval(handle);
      _stop();
    },
  };
}

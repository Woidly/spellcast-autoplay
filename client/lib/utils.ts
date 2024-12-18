/**
 * Interruptable version of basic async sleep implementation.
 * We all know it, we all love it.
 * @param duration Sleep duration in milliseconds
 */
export function sleep(duration: number): [Promise<void>, () => void] {
  let resolve: (_: void) => void;
  let reject: (error: Error) => void;
  let promise: Promise<void> = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  let timer = setTimeout(() => resolve(), duration);
  return [
    promise,
    () => {
      reject(new Error("Interrupted"));
      clearTimeout(timer);
    },
  ];
}

/**
 * Interruptable version of basic waitFor implementation with added return value.
 * @param predicate Predicate to call
 * @param interval Interval between predicate calls
 * @returns Non-false return value of predicate
 */
export function waitForValue<T>(
  predicate: () => T | void | undefined | null | false,
  interval: number = 100
): [Promise<T>, () => void] {
  let resolve: (value: T) => void;
  let reject: (error: Error) => void;
  let promise: Promise<T> = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  let value;
  let timer = setInterval(() => {
    if ((value = predicate())) {
      resolve(value);
      clearInterval(timer);
    }
  }, interval);
  return [
    promise,
    () => {
      reject(new Error("Interrupted"));
      clearInterval(timer);
    },
  ];
}

/**
 * Wrapper that allows to use interruptable functions as promises.
 * As of now, interrupt callback is assigned to global window so user can trigger it in console.
 * In future there will be interrupt button in UI.
 * @param interruptable The return value of interruptable function
 * @returns Promise that can be awaited
 */
export function awaitWrapper<T>(interruptable: [Promise<T>, () => void]): Promise<T> {
  let [promise, interrupt] = interruptable;
  // TODO: When UI is implemented, make interrupt button in there. For now just letting user interrupt via console.
  // @ts-ignore
  unsafeWindow._interrupt = interrupt;
  // @ts-ignore
  promise.then(() => (unsafeWindow._interrupt = null));
  return promise;
}

/**
 * Pauses execution for a specified duration.
 *
 * @param ms - The number of milliseconds to pause.
 * @returns A promise that resolves after the specified time.
 *
 * @example
 * ```
 * async function exampleFunction() {
 *   console.log("Start");
 *   await sleep(2000); // Pauses for 2 seconds
 *   console.log("End");
 * }
 * ```
 */
export declare const sleep: (ms: number) => Promise<void>;

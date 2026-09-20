"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySum = void 0;
/**
 * Sums two numbers, handling numeric strings or undefined values gracefully.
 *
 * @param a - The first number to sum.
 * @param b - The second number to sum.
 * @returns The sum of the two values as a number.
 *
 * @example
 * ```typescript
 * // Using ArraySum directly
 * const result = ArraySum("3.5", 4.5);
 * // result: 8
 *
 * // Using ArraySum in a reduce function to sum values
 * const values = [{ duration: '3.5' }, { duration: 4.5 }, { duration: '2' }];
 * const durations = values.map(item => item.duration);
 * const totalDuration = durations.reduce(ArraySum, 0);
 * // totalDuration: 10
 * ```
 */
const ArraySum = (a = 0, b = 0) => {
    const numA = typeof a === 'number' ? a : parseFloat(a) || 0;
    const numB = typeof b === 'number' ? b : parseFloat(b) || 0;
    return numA + numB;
};
exports.ArraySum = ArraySum;
//# sourceMappingURL=array-sum.js.map
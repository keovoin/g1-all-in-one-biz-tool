"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToBoolean = void 0;
/**
 * Converts a given input into a boolean value.
 * Handles strings like 'true', '1', 'false', '0', and also actual booleans and numbers.
 *
 * @param value - The input to convert to a boolean.
 * @returns A boolean representation of the given input.
 */
const parseToBoolean = (value) => {
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    if (typeof value === 'string') {
        const normalized = value.toLowerCase().trim();
        if (normalized === 'true' || normalized === '1') {
            return true;
        }
        if (normalized === 'false' || normalized === '0') {
            return false;
        }
    }
    // Fallback
    return false;
};
exports.parseToBoolean = parseToBoolean;
//# sourceMappingURL=parse-to-boolean.js.map
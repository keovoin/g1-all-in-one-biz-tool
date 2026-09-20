"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnakeCase = void 0;
/**
 * Convert a camelCase string to snake_case.
 *
 * @param string - The camelCase string to convert.
 * @returns The converted snake_case string.
 */
const camelToSnakeCase = (string) => string.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
exports.camelToSnakeCase = camelToSnakeCase;
//# sourceMappingURL=camel-to-snake-case.js.map
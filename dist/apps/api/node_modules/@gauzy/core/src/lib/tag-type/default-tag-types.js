"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TAG_TYPES = void 0;
/**
 * Represents the default tag types used throughout the application.
 * Each tag type corresponds to a specific category or grouping.
 *
 * @constant DEFAULT_TAG_TYPES
 * @type {ITagType[]}
 *
 * @description
 * This constant defines an array of objects that represent default tag types.
 * Each object contains a `type` property, which is a string describing the tag type.
 * These tags can be used to classify various entities such as equipment, income,
 * invoices, and more.
 *
 * Example Usage:
 * ```typescript
 * console.log(DEFAULT_TAG_TYPES);
 * ```
 *
 */
exports.DEFAULT_TAG_TYPES = [
    { type: 'Equipment' },
    { type: 'Income' },
    { type: 'Invoice' },
    { type: 'Payment' },
    { type: 'Task' },
    { type: 'Proposals' },
    { type: 'Organization Contact' },
    { type: 'Employee Level' },
    { type: 'Organization Department' },
    { type: 'Warehouse' },
    { type: 'Employee' },
    { type: 'User' }
];
//# sourceMappingURL=default-tag-types.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UI_PREFERENCES_BYTES = void 0;
exports.isPlainObject = isPlainObject;
exports.normalizeUiPreferences = normalizeUiPreferences;
exports.sanitizeUiPreferencesPatch = sanitizeUiPreferencesPatch;
exports.mergeUiPreferences = mergeUiPreferences;
exports.assertUiPreferencesSize = assertUiPreferencesSize;
/**
 * Upper bound (bytes of the serialized JSON) for one user's UI preferences blob.
 * The blob is free-form per feature, so this is what keeps a misbehaving client
 * from turning the `user` row into a dumping ground.
 */
exports.MAX_UI_PREFERENCES_BYTES = 16 * 1024;
/**
 * Keys that must never be copied from client input into a stored object
 * (prototype pollution).
 */
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/**
 * True for a plain JSON object (not null, not an array).
 */
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Coerces whatever is stored on the row (object, JSON string on SQLite, null)
 * into a plain preferences object. Unparseable input yields `{}` rather than
 * throwing so one corrupt row cannot break the user's session.
 */
function normalizeUiPreferences(stored) {
    if (typeof stored === 'string') {
        try {
            return normalizeUiPreferences(JSON.parse(stored));
        }
        catch {
            return {};
        }
    }
    return isPlainObject(stored) ? { ...stored } : {};
}
/**
 * Validates a `PUT /user/ui-preferences` body beyond what the DTO can express:
 * every top-level entry must map a feature name to a plain object (or `null`,
 * which removes that feature's stored state), and no key may be a prototype
 * accessor. Returns a sanitized copy or throws a plain `Error` with a message
 * suitable for a 400 response.
 */
function sanitizeUiPreferencesPatch(patch) {
    if (!isPlainObject(patch)) {
        throw new Error('uiPreferences patch must be an object keyed by feature');
    }
    const clean = {};
    for (const [feature, value] of Object.entries(patch)) {
        if (FORBIDDEN_KEYS.has(feature)) {
            throw new Error(`Illegal feature key "${feature}"`);
        }
        if (value === null) {
            clean[feature] = null;
            continue;
        }
        if (!isPlainObject(value)) {
            throw new Error(`Feature "${feature}" must be an object`);
        }
        clean[feature] = assertNoForbiddenKeys(value, feature);
    }
    return clean;
}
/** Deepest container (object OR array) level a feature value may have below the feature key. */
const MAX_NESTING_DEPTH = 8;
function assertDepth(feature, depth) {
    if (depth > MAX_NESTING_DEPTH) {
        throw new Error(`Feature "${feature}" is nested too deeply`);
    }
}
/**
 * Arrays are walked too: an object nested inside an array is still an object we will store —
 * and every array level counts towards the depth bound, so a `[[[[…]]]]` payload is rejected
 * with a 400 instead of exhausting the call stack.
 */
function sanitizeNested(item, feature, depth) {
    assertDepth(feature, depth);
    if (Array.isArray(item)) {
        return item.map((element) => sanitizeNested(element, feature, depth + 1));
    }
    return isPlainObject(item) ? assertNoForbiddenKeys(item, feature, depth) : item;
}
/**
 * Walks a feature object (bounded depth) and rejects `__proto__` / `constructor` / `prototype`
 * at ANY level — a nested polluting key would survive a shallow check and reach the JSON column,
 * from where a later deep merge could pick it up. Returns a fresh copy (own enumerable keys only).
 */
function assertNoForbiddenKeys(value, feature, depth = 0) {
    assertDepth(feature, depth);
    const copy = {};
    for (const [key, item] of Object.entries(value)) {
        if (FORBIDDEN_KEYS.has(key)) {
            throw new Error(`Illegal key "${key}" in feature "${feature}"`);
        }
        copy[key] = sanitizeNested(item, feature, depth + 1);
    }
    return copy;
}
/**
 * Shallow merge per top-level feature key: each key present in `patch`
 * REPLACES the whole stored feature object (a `null` value removes it); keys
 * absent from `patch` are kept untouched. Nested fields are deliberately not
 * deep-merged — a feature persists its full state in one write, so a stale
 * nested field can never linger under a newer object.
 *
 * @example
 * merge({ aiChat: { expanded: true, width: 400 }, docs: { zoom: 2 } }, { aiChat: { expanded: false } })
 * // → { aiChat: { expanded: false }, docs: { zoom: 2 } }
 */
function mergeUiPreferences(current, patch) {
    const merged = { ...normalizeUiPreferences(current) };
    for (const [feature, value] of Object.entries(patch ?? {})) {
        if (FORBIDDEN_KEYS.has(feature)) {
            continue;
        }
        if (value === null || value === undefined) {
            delete merged[feature];
        }
        else {
            merged[feature] = value;
        }
    }
    return merged;
}
/**
 * Serialized size guard for the merged blob.
 */
function assertUiPreferencesSize(preferences) {
    const bytes = Buffer.byteLength(JSON.stringify(preferences), 'utf8');
    if (bytes > exports.MAX_UI_PREFERENCES_BYTES) {
        throw new Error(`uiPreferences exceed ${exports.MAX_UI_PREFERENCES_BYTES} bytes (${bytes})`);
    }
}
//# sourceMappingURL=ui-preferences.util.js.map
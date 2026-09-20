import { IUserUiPreferences, IUserUiPreferencesUpdateInput } from '@gauzy/contracts';
/**
 * Upper bound (bytes of the serialized JSON) for one user's UI preferences blob.
 * The blob is free-form per feature, so this is what keeps a misbehaving client
 * from turning the `user` row into a dumping ground.
 */
export declare const MAX_UI_PREFERENCES_BYTES: number;
/**
 * True for a plain JSON object (not null, not an array).
 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
/**
 * Coerces whatever is stored on the row (object, JSON string on SQLite, null)
 * into a plain preferences object. Unparseable input yields `{}` rather than
 * throwing so one corrupt row cannot break the user's session.
 */
export declare function normalizeUiPreferences(stored: unknown): IUserUiPreferences;
/**
 * Validates a `PUT /user/ui-preferences` body beyond what the DTO can express:
 * every top-level entry must map a feature name to a plain object (or `null`,
 * which removes that feature's stored state), and no key may be a prototype
 * accessor. Returns a sanitized copy or throws a plain `Error` with a message
 * suitable for a 400 response.
 */
export declare function sanitizeUiPreferencesPatch(patch: unknown): IUserUiPreferencesUpdateInput;
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
export declare function mergeUiPreferences(current: unknown, patch: IUserUiPreferencesUpdateInput): IUserUiPreferences;
/**
 * Serialized size guard for the merged blob.
 */
export declare function assertUiPreferencesSize(preferences: IUserUiPreferences): void;

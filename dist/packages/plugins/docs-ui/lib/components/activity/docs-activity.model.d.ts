import { IActivityLog } from '@gauzy/contracts';
/**
 * i18n key for the label of a changed document column.
 *
 * The writer (`plugins/docs/.../activity/document-activity-log.subscriber.ts`) only ever names
 * `status`, `knowledgeStatus`, `reviewStatus` (per phase) or an explicit `parentId` / `isArchived` /
 * `version` — everything else in this map is defensive, and an unmapped field falls back to its raw
 * column name rather than rendering a translation key at the user.
 */
export declare const DOCS_ACTIVITY_FIELD_LABEL_KEYS: Readonly<Record<string, string>>;
/**
 * i18n key prefix that turns a field's stored enum value into a label (`DOCS.STATUS.READY`, …).
 * A field with no prefix renders its raw value.
 */
export declare const DOCS_ACTIVITY_VALUE_KEY_PREFIXES: Readonly<Record<string, string>>;
/**
 * Fields whose stored value is meaningless to a reader.
 *
 * `parentId` is the only one today: a move records the old and new **ids**, and printing a bare
 * uuid pair is worse than printing nothing — the row still says the document moved, which is the
 * fact the timeline is there to carry.
 */
export declare const DOCS_ACTIVITY_OPAQUE_FIELDS: readonly string[];
/** One before/after pair of a single document column. */
export interface IDocumentActivityChange {
    field: string;
    /** `null` when the field is not in the label map — the raw column name is rendered instead. */
    labelKey: string | null;
    previous?: unknown;
    next?: unknown;
    /** False for `parentId` and friends: the row names the field but prints no values. */
    showValues: boolean;
    /** i18n prefix for the values, when they are enum members. */
    valueKeyPrefix: string | null;
}
/** One rendered timeline row. */
export interface IDocumentActivityEntry {
    id: string;
    createdAt?: Date;
    /** Raw action as stored — rendered verbatim when the label key is unknown. */
    action: string;
    /** `null` for an action outside `ActionTypeEnum` (spec 04 §4.6: fall back to raw enum text). */
    actionLabelKey: string | null;
    /** True for pipeline-owned transitions; the row is attributed to "System". */
    isSystem: boolean;
    /** Author display name; empty when the row carries no employee (system rows, deleted authors). */
    actorName: string;
    changes: IDocumentActivityChange[];
}
/**
 * Reads one of the activity log's json array columns.
 *
 * 🛑 Three shapes really occur. Postgres/mysql return arrays. On sqlite the columns are written
 * as **strings** (`serializeActivityLogForSqlite()`) and `ActivityLogSubscriber.afterEntityLoad`
 * parses them back — but only when the subscriber runs, and when its parse throws it resets the
 * fields to `{}`, an **object where an array is expected**. Every branch below is one of those.
 */
export declare function parseActivityJsonArray(value: unknown): Record<string, unknown>[];
/**
 * Projects an `ActivityLog` row onto the timeline view model.
 *
 * Pure by design: every branch here (unknown action, unknown field, sqlite-serialized json,
 * missing author) is a real shape the API can return, and a pure function is the only way to
 * cover them without booting the Angular graph.
 */
export declare function toDocumentActivityEntry(log: IActivityLog): IDocumentActivityEntry;
/**
 * Appends a freshly fetched page to the rows already on screen, dropping ids that are already
 * there.
 *
 * The API paginates by **page number**, so a row written between two "Show more" clicks shifts
 * the whole window down by one and re-serves the last row of the previous page. Without this the
 * timeline would show that row twice and `trackBy` would key two elements identically.
 */
export declare function mergeActivityEntries(existing: IDocumentActivityEntry[], incoming: IDocumentActivityEntry[]): IDocumentActivityEntry[];

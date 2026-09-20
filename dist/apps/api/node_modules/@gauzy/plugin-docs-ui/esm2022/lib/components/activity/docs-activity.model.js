import { ActionTypeEnum, ActorTypeEnum } from '@gauzy/contracts';
import { employeeMentionLabel } from '../comments/document-comments.model';
/**
 * i18n key for the label of a changed document column.
 *
 * The writer (`plugins/docs/.../activity/document-activity-log.subscriber.ts`) only ever names
 * `status`, `knowledgeStatus`, `reviewStatus` (per phase) or an explicit `parentId` / `isArchived` /
 * `version` — everything else in this map is defensive, and an unmapped field falls back to its raw
 * column name rather than rendering a translation key at the user.
 */
export const DOCS_ACTIVITY_FIELD_LABEL_KEYS = {
    name: 'DOCS.TABLE.COLUMNS.NAME',
    status: 'DOCS.TABLE.COLUMNS.STATUS',
    knowledgeStatus: 'DOCS.TABLE.COLUMNS.KNOWLEDGE',
    reviewStatus: 'DOCS.ACTIVITY.FIELD.REVIEW_STATUS',
    visibility: 'DOCS.VISIBILITY.LABEL',
    parentId: 'DOCS.DETAIL.LOCATION',
    isArchived: 'DOCS.ACTIVITY.FIELD.ARCHIVED',
    version: 'DOCS.ACTIVITY.FIELD.VERSION'
};
/**
 * i18n key prefix that turns a field's stored enum value into a label (`DOCS.STATUS.READY`, …).
 * A field with no prefix renders its raw value.
 */
export const DOCS_ACTIVITY_VALUE_KEY_PREFIXES = {
    status: 'DOCS.STATUS.',
    knowledgeStatus: 'DOCS.KNOWLEDGE.',
    reviewStatus: 'DOCS.REVIEW.',
    visibility: 'DOCS.VISIBILITY.'
};
/**
 * Fields whose stored value is meaningless to a reader.
 *
 * `parentId` is the only one today: a move records the old and new **ids**, and printing a bare
 * uuid pair is worse than printing nothing — the row still says the document moved, which is the
 * fact the timeline is there to carry.
 */
export const DOCS_ACTIVITY_OPAQUE_FIELDS = ['parentId'];
/** i18n key of an `ActionTypeEnum` member, or `null` when the action is not one. */
function actionLabelKeyOf(action) {
    const known = Object.values(ActionTypeEnum);
    return known.includes(action) ? `DOCS.ACTIVITY.ACTION.${action.toUpperCase()}` : null;
}
/**
 * Reads one of the activity log's json array columns.
 *
 * 🛑 Three shapes really occur. Postgres/mysql return arrays. On sqlite the columns are written
 * as **strings** (`serializeActivityLogForSqlite()`) and `ActivityLogSubscriber.afterEntityLoad`
 * parses them back — but only when the subscriber runs, and when its parse throws it resets the
 * fields to `{}`, an **object where an array is expected**. Every branch below is one of those.
 */
export function parseActivityJsonArray(value) {
    const raw = typeof value === 'string' ? safeParse(value) : value;
    return Array.isArray(raw) ? raw.filter((entry) => !!entry && typeof entry === 'object') : [];
}
function safeParse(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
/** Same tolerance for `updatedFields`, which is a `string[]` (or its sqlite serialization). */
function parseFieldNames(value) {
    const raw = typeof value === 'string' ? safeParse(value) : value;
    return Array.isArray(raw) ? raw.filter((entry) => typeof entry === 'string') : [];
}
/**
 * Projects an `ActivityLog` row onto the timeline view model.
 *
 * Pure by design: every branch here (unknown action, unknown field, sqlite-serialized json,
 * missing author) is a real shape the API can return, and a pure function is the only way to
 * cover them without booting the Angular graph.
 */
export function toDocumentActivityEntry(log) {
    const action = String(log?.action ?? '');
    const fields = parseFieldNames(log?.updatedFields);
    const previous = parseActivityJsonArray(log?.previousValues);
    const next = parseActivityJsonArray(log?.updatedValues);
    return {
        id: String(log?.id ?? ''),
        createdAt: log?.createdAt,
        action,
        actionLabelKey: actionLabelKeyOf(action),
        isSystem: log?.actorType === ActorTypeEnum.System,
        actorName: employeeMentionLabel(log?.employee),
        changes: fields.map((field, index) => ({
            field,
            labelKey: DOCS_ACTIVITY_FIELD_LABEL_KEYS[field] ?? null,
            previous: previous[index]?.[field],
            next: next[index]?.[field],
            showValues: !DOCS_ACTIVITY_OPAQUE_FIELDS.includes(field),
            valueKeyPrefix: DOCS_ACTIVITY_VALUE_KEY_PREFIXES[field] ?? null
        }))
    };
}
/**
 * Appends a freshly fetched page to the rows already on screen, dropping ids that are already
 * there.
 *
 * The API paginates by **page number**, so a row written between two "Show more" clicks shifts
 * the whole window down by one and re-serves the last row of the previous page. Without this the
 * timeline would show that row twice and `trackBy` would key two elements identically.
 */
export function mergeActivityEntries(existing, incoming) {
    const seen = new Set(existing.map((entry) => entry.id));
    return [...existing, ...incoming.filter((entry) => !seen.has(entry.id))];
}
//# sourceMappingURL=docs-activity.model.js.map
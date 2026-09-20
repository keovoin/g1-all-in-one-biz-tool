"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPAQUE_EXPORT_MASK = exports.EXPORT_REDACT_METADATA = void 0;
exports.ExportRedacted = ExportRedacted;
exports.exportRedacted = exportRedacted;
exports.getExportRedactedProperties = getExportRedactedProperties;
exports.maskEmbeddedSecret = maskEmbeddedSecret;
exports.omitExportRedactionPlaceholders = omitExportRedactionPlaceholders;
exports.redactForExport = redactForExport;
const utils_1 = require("@gauzy/utils");
const is_secret_1 = require("../core/decorators/is-secret");
/**
 * Reflect metadata key carrying the per-class list of "mask this column in an export archive" marks.
 */
exports.EXPORT_REDACT_METADATA = 'exportRedact';
/** What an `opaque` mark writes in place of the value. Matches the shape {@link maskSecret} produces. */
exports.OPAQUE_EXPORT_MASK = '********';
/**
 * Marks an entity column as **redacted on export**: present in the archive, never in cleartext.
 *
 * ## Why this exists
 *
 * Two serialization paths leave this application, and they do not share a masking mechanism. The
 * JSON API path runs `instanceToPlain` through `TransformInterceptor`, so `@Exclude({ toPlainOnly:
 * true })` and the `@Expose`d `wrapSecret*` mirrors hide credentials there. The CSV export path
 * (`ExportService.csvWriter`) hands raw entity objects to `csv-writer`, which reads
 * `object[property]` directly and knows nothing about class-transformer — so every one of those
 * protections is bypassed and OAuth tokens, API keys, SMTP passwords and object-storage secret keys
 * were written to the archive verbatim (GHSA-j5h5-r956-rxc3).
 *
 * This marker is the declarative seam for the export path, the sibling of `@SkipExport()`, which
 * does the same job one level up (a whole entity rather than one column). Marking the column at its
 * declaration is the point: a hand-maintained list of secret columns inside the export service
 * cannot see a plugin's entities and goes stale the first time somebody adds a column.
 *
 * The column itself is kept in the archive with a masked value rather than dropped, so the CSV
 * header stays stable and a round-trip import still sees the table's shape.
 *
 * @example
 * ```ts
 * // always a secret
 * @ExportRedacted()
 * @MultiORMColumn()
 * password: string;
 *
 * // a secret unless the row's name says otherwise
 * @ExportRedacted<IntegrationSetting>({ when: (it) => !nonSecretSettingKeys.includes(it.settingsName) })
 * @MultiORMColumn()
 * settingsValue: string;
 * ```
 *
 * @see exportRedacted for the imperative form.
 */
function ExportRedacted(options = {}) {
    return (target, propertyKey) => {
        if (typeof propertyKey !== 'string') {
            return;
        }
        // Property decorators on instance members receive the PROTOTYPE; the marks belong to the class.
        defineExportRedactMark(target.constructor, propertyKey, options);
    };
}
/**
 * Imperative equivalent of {@link ExportRedacted} — marks a column from outside the entity's file.
 *
 * Useful where the entity class cannot be decorated in place (a third-party class, or a plugin that
 * registers entities it does not own), mirroring `skipExport()`.
 *
 * @param entity - The entity class owning the column.
 * @param property - The property name to redact.
 * @param options - Redaction options, see {@link IExportRedactOptions}.
 */
function exportRedacted(entity, property, options = {}) {
    if ((0, utils_1.isFunction)(entity) && typeof property === 'string' && property) {
        defineExportRedactMark(entity, property, options);
    }
}
/**
 * Stores (or replaces) one mark in the entity class's OWN metadata.
 */
function defineExportRedactMark(entity, property, options) {
    const own = Reflect.getOwnMetadata(exports.EXPORT_REDACT_METADATA, entity) ?? [];
    const marks = [...own.filter((mark) => mark.property !== property), { ...options, property }];
    Reflect.defineMetadata(exports.EXPORT_REDACT_METADATA, marks, entity);
}
/**
 * Every redaction mark that applies to an entity class, including the ones it inherits.
 *
 * 🛑 Inheritance is deliberate here, and it is the OPPOSITE call from `isExportSkipped()`, which
 * reads own-metadata only. Inheriting a *skip* would silently drop a subclass's rows out of the
 * archive — quiet data loss. Inheriting a *redaction* only ever masks more: a subclass of an entity
 * with a credential column has that same column, so it needs the same mask. The safe default for
 * each marker is the one that cannot be wrong in the dangerous direction.
 *
 * A mark declared on the subclass wins over the base class's mark for the same property.
 *
 * @param entity - The entity class to inspect.
 * @returns The marks keyed by property name; empty when the entity carries none.
 */
function getExportRedactedProperties(entity) {
    const marks = new Map();
    if (!(0, utils_1.isFunction)(entity)) {
        return marks;
    }
    // Walk the constructor chain base-first so a subclass's mark overwrites the base's.
    const chain = [];
    for (let cursor = entity; (0, utils_1.isFunction)(cursor); cursor = Object.getPrototypeOf(cursor)) {
        chain.unshift(cursor);
    }
    for (const ancestor of chain) {
        const own = Reflect.getOwnMetadata(exports.EXPORT_REDACT_METADATA, ancestor) ?? [];
        for (const { property, ...options } of own) {
            marks.set(property, options);
        }
    }
    return marks;
}
/**
 * Whether a value is a secret for this row, according to the mark.
 *
 * Fail closed in every direction that is not an explicit "no": a predicate that throws, or returns
 * anything other than `false`, means "treat it as a secret".
 */
function isSecretValue(mark, row) {
    if (!mark.when) {
        return true;
    }
    try {
        return mark.when(row) !== false;
    }
    catch {
        return true;
    }
}
/**
 * The value an export writes in place of a secret, per the mark's options.
 */
function redactValue(mark, value, row) {
    if (mark.blank) {
        return '';
    }
    if (mark.mask) {
        try {
            return mark.mask(value, row);
        }
        catch {
            return (0, is_secret_1.maskSecret)(value);
        }
    }
    return mark.opaque ? exports.OPAQUE_EXPORT_MASK : (0, is_secret_1.maskSecret)(value);
}
/**
 * Masks every occurrence of a secret inside a larger value, leaving the rest readable.
 *
 * Fails closed: when the secret is absent or does not occur in the value, the WHOLE value is masked,
 * because nothing then shows which part of it is safe to keep.
 *
 * @param value - The value embedding the secret (e.g. `docs-<token>@inbound.example.com`).
 * @param secret - The secret embedded in it (e.g. the token).
 * @returns The value with each occurrence of the secret masked.
 */
function maskEmbeddedSecret(value, secret) {
    const text = String(value ?? '');
    const embedded = typeof secret === 'string' ? secret : '';
    if (!embedded || !text.toLowerCase().includes(embedded.toLowerCase())) {
        return (0, is_secret_1.maskSecret)(text);
    }
    const masked = (0, is_secret_1.maskSecret)(embedded);
    let result = '';
    let cursor = 0;
    const haystack = text.toLowerCase();
    const needle = embedded.toLowerCase();
    for (let index = haystack.indexOf(needle); index !== -1; index = haystack.indexOf(needle, cursor)) {
        result += text.slice(cursor, index) + masked;
        cursor = index + embedded.length;
    }
    return result + text.slice(cursor);
}
/**
 * Whether a value is genuinely absent: `null`, `undefined` or the empty string — and nothing else.
 *
 * @param value - The column value.
 * @returns `true` only for a value there is nothing to mask in.
 */
function isAbsentValue(value) {
    return value === null || value === undefined || value === '';
}
/**
 * The exact shape {@link maskSecret} produces: one or more mask characters, then at most the four
 * characters of trailing hint.
 */
const MASKED_VALUE_PATTERN = /^\*+[^*]{0,4}$/;
/** A run of mask characters inside a larger value, as {@link maskEmbeddedSecret} writes it. */
const EMBEDDED_MASK_PATTERN = /\*{4,}/;
/**
 * Removes the placeholders an export archive carries in place of redacted values, so a re-import does
 * not write them over the live values they stand for.
 *
 * An archive produced by {@link redactForExport} holds `****abcd` where an invoice's public-link token
 * was, and an empty cell where a password digest was. Importing that archive back into the tenant it
 * came from UPDATES the rows it already mapped (`ImportEntityFieldMapOrCreateHandler`), so without this
 * step every such row would lose its working credential: public invoice links stop verifying, and every
 * user's password digest is replaced with `null`.
 *
 * A property is dropped only when BOTH hold, so a real value supplied in a hand-built CSV still imports:
 *
 * - the column carries a mark that applies to this row (the same `when` predicate the export used), and
 * - the value is what the export writes for it — empty for a `blank` mark, a value containing a run
 *   of mask characters for a `mask` mark, and a bare mask for any other.
 *
 * @param entity - The entity class the row belongs to. When it is not a class nothing can be known
 *                 about its marks, and the row is returned unchanged.
 * @param row - The mapped import row.
 * @returns A shallow copy of `row` without the redaction placeholders.
 */
function omitExportRedactionPlaceholders(entity, row) {
    const copy = { ...row };
    if (!(0, utils_1.isFunction)(entity)) {
        return copy;
    }
    for (const [property, mark] of getExportRedactedProperties(entity)) {
        if (!(property in copy) || !isSecretValue(mark, row)) {
            continue;
        }
        const value = copy[property];
        const isPlaceholder = mark.blank
            ? isAbsentValue(value)
            : mark.mask
                ? typeof value === 'string' && EMBEDDED_MASK_PATTERN.test(value)
                : typeof value === 'string' && MASKED_VALUE_PATTERN.test(value);
        if (isPlaceholder) {
            delete copy[property];
        }
    }
    return copy;
}
/**
 * Projects one entity row onto the plain object that is written into an export CSV.
 *
 * Two things happen here, and both are security-relevant:
 *
 * 1. **Marked columns are masked.** See {@link ExportRedacted}.
 * 2. **Anything that is not a persisted column is dropped** when `columns` is supplied. Entity
 *    instances carry more than their columns by the time they reach the writer: TypeORM subscribers
 *    attach derived properties (`IntegrationSettingSubscriber` adds `wrapSecretValue`), and
 *    `@VirtualMultiOrmColumn` properties are computed rather than stored. None of it belongs in an
 *    archive whose purpose is to round-trip the tables, and each one is a way for a future
 *    subscriber to put a cleartext credential back into the CSV behind the column marks' back.
 *
 * @param entity - The entity class the row belongs to. Required: without it there is no way to know
 *                 which columns are secret, and guessing would be the permissive answer. Throws.
 * @param row - The hydrated entity (or any plain row object) to project.
 * @param columns - Property names of the persisted columns. Omit to keep every own property.
 * @returns A plain object safe to hand to `csv-writer`.
 */
function redactForExport(entity, row, columns) {
    if (!(0, utils_1.isFunction)(entity)) {
        // Fail closed: an unknown entity class means unknown secrets, so refuse to write the row
        // rather than write it in cleartext.
        throw new TypeError('redactForExport() requires the entity class the row belongs to');
    }
    const marks = getExportRedactedProperties(entity);
    const allowed = columns ? new Set(columns) : null;
    const redacted = {};
    for (const property of Object.keys(row)) {
        if (allowed && !allowed.has(property)) {
            continue;
        }
        const value = row[property];
        const mark = marks.get(property);
        // Absent values (null/undefined/'') stay as they are: masking one would invent a non-null value
        // and make an empty column look populated. Deliberately NOT `isNotEmpty`, which also treats the
        // literal strings 'null' and 'undefined' as empty and would export such a credential verbatim.
        if (mark && !isAbsentValue(value) && isSecretValue(mark, row)) {
            redacted[property] = redactValue(mark, value, row);
            continue;
        }
        redacted[property] = value;
    }
    return redacted;
}
//# sourceMappingURL=export-redact.decorator.js.map
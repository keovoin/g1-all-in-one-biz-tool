"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUBLIC_EMPLOYEE_HTML_FIELDS = exports.PUBLIC_ORGANIZATION_HTML_FIELDS = void 0;
exports.sanitizePublicRichTextFields = sanitizePublicRichTextFields;
const html_sanitizer_1 = require("../core/html-sanitizer");
/**
 * Sanitize-on-read for the unauthenticated `/public/*` endpoints.
 *
 * The rich-text HTML fields these endpoints serve — `Organization.overview`,
 * `Employee.description` — are sanitized on write (`OrganizationService`, `EmployeeService`), but
 * write-path sanitization only protects rows written after it shipped. These responses are
 * rendered with `[innerHtml]` on `/public/:profile_link`, a page served to ANONYMOUS visitors, so
 * a payload persisted before that — or by any future write path that forgets the policy — must not
 * be able to reach a client. Running the same shared allowlist on the way out makes the public
 * response safe regardless of what the database holds.
 *
 * It also closes the one gap the client-side pass leaves: Angular's URL check is a DENYLIST of a
 * single scheme (`javascript:`), so `data:text/html;base64,…` and `vbscript:…` survive it, while
 * `RICH_HTML_SANITIZE_OPTIONS.allowedSchemes` is an allowlist of `http`/`https`/`mailto`/`tel`.
 *
 * Kept as a standalone pure helper rather than inlined in the two services for the same reason as
 * `assertContentSearchQueryLength` in `@gauzy/plugin-docs`: it is unit-testable without importing
 * `core/entities/internal`, which drags the whole entity graph (and its ESM-only transitive deps)
 * into the test run.
 *
 * @param record - The loaded row, already field-projected and visibility-filtered.
 * @param fields - The rich-text HTML field names to sanitize on this row.
 * @returns The same object, mutated in place, with its HTML fields sanitized.
 */
function sanitizePublicRichTextFields(record, fields) {
    if (!record) {
        return record;
    }
    const row = record;
    for (const field of fields) {
        // Only touch a field that is actually present and non-empty: `sanitizeRichHtml` is a
        // no-op on empty input, but skipping the assignment keeps an absent field absent rather
        // than materializing it as `undefined` on the serialized response.
        if (row[field]) {
            row[field] = (0, html_sanitizer_1.sanitizeRichHtml)(row[field]);
        }
    }
    return record;
}
/** Rich-text HTML columns of `Organization` exposed by `GET /public/organization/:profile_link`. */
exports.PUBLIC_ORGANIZATION_HTML_FIELDS = ['overview'];
/** Rich-text HTML columns of `Employee` exposed by the `GET /public/employee` endpoints. */
exports.PUBLIC_EMPLOYEE_HTML_FIELDS = ['description'];
//# sourceMappingURL=public-html-sanitizer.js.map
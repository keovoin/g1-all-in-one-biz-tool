"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertContentSearchQueryLength = assertContentSearchQueryLength;
const common_1 = require("@nestjs/common");
const docs_constants_1 = require("../docs.constants");
/**
 * The one place the content-search minimum is enforced (`GET /documents?searchIn=content`).
 *
 * Kept as a standalone pure guard rather than inlined in `DocumentService` for two reasons:
 * it is the single definition the client mirrors (`DOCUMENT_CONTENT_SEARCH_MIN_CHARS` in
 * `@gauzy/plugin-docs-ui`), and it is unit-testable without booting the `@gauzy/core`
 * application graph that importing the service would pull in.
 *
 * @param q The raw `q` query param (already trimmed by every client, never trimmed here so
 *          the guard measures exactly what the LIKE predicate below it will use).
 * @throws BadRequestException `DOCS_QUERY_TOO_SHORT` when `q` is shorter than the minimum.
 */
function assertContentSearchQueryLength(q) {
    if ((q ?? '').length < docs_constants_1.DOCS_CONTENT_SEARCH_MIN_CHARS) {
        throw new common_1.BadRequestException({
            message: `Content search requires at least ${docs_constants_1.DOCS_CONTENT_SEARCH_MIN_CHARS} characters`,
            code: docs_constants_1.DOCS_QUERY_TOO_SHORT
        });
    }
}
//# sourceMappingURL=content-search.guard.js.map
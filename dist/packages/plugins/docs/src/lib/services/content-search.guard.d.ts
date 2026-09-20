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
export declare function assertContentSearchQueryLength(q: string): void;

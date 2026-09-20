/**
 * Rejects `update` / `delete` / `softDelete` criteria that carry no usable predicate.
 *
 * TypeORM refuses `undefined`, `null`, `''`, `[]` and `{}` itself, but it does NOT refuse an object
 * whose leaves are all `undefined` — and, because an `undefined` where value is (and must remain)
 * omitted from the SQL, `{ employeeId: undefined }` — or the nested `{ employee: { id: undefined } }` —
 * produced an UNFILTERED `DELETE FROM ...` / `UPDATE ... SET ...` over the whole table. A missing
 * request field or an absent RequestContext id is all it took (GHSA-44pv-34gx-q9p4 class). Fail
 * closed instead. The check is recursive: relation / embedded objects and OR-arrays are only accepted
 * when at least one leaf survives.
 *
 * `null` values are left alone: under TYPEORM_INVALID_WHERE_VALUES_BEHAVIOR they are a real
 * predicate (`IS NULL`).
 *
 * @param criteria - The id / where-object handed to the write method.
 * @param method - Name of the calling method, for the error message.
 */
export declare function assertCriteriaHasPredicate(criteria: unknown, method: string): void;

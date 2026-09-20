/**
 * Keeping database internals out of HTTP responses.
 *
 * `throw new BadRequestException(error)` with a caught TypeORM error looks harmless, but Nest puts
 * the object straight into the response body, and `JSON.stringify` of a `QueryFailedError` emits its
 * ENUMERABLE own properties — which are exactly `query`, `parameters` and `driverError`. (`message`
 * and `name` live on `Error.prototype` and are non-enumerable, so the one part that would have been
 * safe to show is the part that gets dropped.)
 *
 * The observed shape, from `PUT /api/goals/<unknown-uuid>` on a local API:
 *
 * ```json
 * { "query": "INSERT INTO \"goal\"(\"deletedAt\", \"createdAt\", ...) VALUES (?, ?, ...)",
 *   "parameters": ["...", "..."], "driverError": {} }
 * ```
 *
 * That hands any caller who can trip a constraint the statement text and every bound value — which
 * can include other users' data echoed back from the payload, and the exact column layout.
 */
/** What the client is told instead, when nothing more specific is known. */
export declare const GENERIC_DATABASE_ERROR_MESSAGE = "The request could not be completed.";
/**
 * Whether a message string is a database driver's own text rather than something a developer wrote.
 *
 * @param value - The candidate message.
 * @returns The safe replacement when the text is driver output, otherwise undefined.
 */
export declare function safeMessageForDatabaseText(value: unknown): string | undefined;
/**
 * Whether a value carries database internals that must never reach a client.
 *
 * Deliberately shape-based rather than `instanceof QueryFailedError`: the same properties arrive
 * from MikroORM's `DriverException`, from raw driver errors, and from an error that has already
 * been spread into a plain object somewhere up the stack.
 *
 * @param value - Any caught error or response payload.
 * @returns True when the value exposes query text, bound parameters or a driver error.
 */
export declare function isDatabaseErrorPayload(value: unknown): boolean;
/**
 * Whether a value looks like a database driver's error code.
 *
 * @param code - The candidate code.
 */
export declare function looksLikeDriverCode(code: unknown): boolean;
/**
 * The client-safe message for a database error: specific where the driver code is recognized,
 * generic otherwise. Never derived from the driver's own message text, which embeds column names,
 * constraint names and sometimes the offending value.
 *
 * @param error - The caught error.
 * @returns A message that is safe to return to the caller.
 */
export declare function describeDatabaseError(error: unknown): string;
/**
 * The message to show for a caught error, safe in both directions.
 *
 * A database error is described by its driver code; anything else keeps its own message, because
 * flattening every failure to one generic string would throw away the useful half — a missing
 * record and a constraint violation are not the same thing to the caller.
 *
 * @param error - The caught error.
 * @returns A message that is safe to return to the caller.
 */
export declare function safeErrorMessage(error: unknown): string;
/**
 * A view of a caught error that is safe to write to the application log.
 *
 * The response is sanitized, but stdout usually ships to a retained log store, and a
 * `QueryFailedError`'s `parameters` holds the values the caller submitted — emails, names, tokens.
 * Everything that helps diagnose the failure is kept (statement text, driver code, driver message);
 * only the bound values are dropped, replaced by their count so the shape is still visible.
 *
 * @param error - The caught error.
 * @returns A value suitable for logging.
 */
export declare function redactDatabaseError(error: unknown): unknown;
/**
 * Produces the value to hand to an `HttpException` for a caught error.
 *
 * Non-database errors are passed through untouched — a `BadRequestException` raised deliberately
 * with a message, and class-validator's array of constraint messages, both have to keep working.
 * Only payloads carrying database internals are replaced.
 *
 * @param error - The caught error.
 * @returns Either the original value, or a safe message string replacing it.
 */
export declare function toClientSafeError(error: unknown): unknown;

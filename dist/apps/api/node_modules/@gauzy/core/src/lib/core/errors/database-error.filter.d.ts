import { ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
/**
 * Keeps database internals out of HTTP responses.
 *
 * ~120 sites across the API re-throw a caught ORM error as `new BadRequestException(error)`, and
 * Nest serializes that object's ENUMERABLE properties — which on a TypeORM `QueryFailedError` are
 * exactly `query`, `parameters` and `driverError`. A further ~160 throw `error.message`, which is
 * the driver's own text and names tables, columns and constraints (and on MySQL, the offending
 * value). Fixing those one at a time leaves the next one to be written unguarded, so the guarantee
 * is enforced here as well, at the single point every HTTP error passes through.
 *
 * Everything that is not a database leak is delegated to {@link BaseExceptionFilter} — Nest's own
 * handler — rather than reimplemented, so response shapes stay byte-for-byte identical. That
 * matters more than it looks: `new HttpException('msg', 404).getResponse()` returns a bare string,
 * which Nest wraps as `{ statusCode, message }`, while `new BadRequestException('msg')` already
 * returns the full object. Replicating that by hand is how a filter quietly changes every error
 * response in the app.
 *
 * Only `HttpException` is caught. A raw error that never got wrapped still reaches Nest's default
 * handling and answers 500 `{"message":"Internal server error"}`, which leaks nothing.
 *
 * Status codes are never changed: a failed write stays 400, a conflict stays 409.
 */
export declare class DatabaseErrorFilter extends BaseExceptionFilter {
    /** How deep the nested-payload scrub walks before giving up (driver errors can hold cycles). */
    private static readonly MAX_SANITIZE_DEPTH;
    private readonly logger;
    /**
     * @param exception - The thrown HTTP exception.
     * @param host - The arguments host for the current context.
     */
    catch(exception: HttpException, host: ArgumentsHost): void;
    /**
     * Drops any nested value that is itself a driver error, at ANY depth.
     *
     * The spread branch preserves the caller's own body structure, but a handler that throws
     * `{ message: error?.message, error }` puts the whole driver object one level down — and
     * `{ error: { cause: queryFailure } }` puts it two down. Removing only direct children left
     * `error.cause.query` and its bound parameters in the response.
     *
     * Depth is bounded and visited objects are tracked, because a driver error can hold a reference
     * back to the connection: an unbounded walk would recurse forever inside an exception filter.
     *
     * @param value - The value being rebuilt.
     * @param seen - Objects already visited on this path (cycle guard).
     * @param depth - Current depth.
     */
    private withoutNestedDatabaseFields;
    /**
     * A loggable description of the payload that cannot throw.
     *
     * @param payload - The exception's response payload.
     */
    private describeForLog;
    /**
     * Recursively redacts a payload for logging.
     *
     * `redactDatabaseError` only handles the case where the payload IS the driver error. A driver
     * error arriving as a message STRING, or wrapped one or more levels down, would otherwise be
     * written to the log with its bound values intact — and logs are usually retained far longer
     * than a response.
     *
     * @param value - The value being logged.
     * @param seen - Objects already visited (cycle guard).
     * @param depth - Current depth.
     */
    private redactForLog;
    /**
     * The replacement message when the payload exposes the database, or undefined to leave it alone.
     *
     * @param payload - The exception's response payload.
     */
    private resolveSafeMessage;
}

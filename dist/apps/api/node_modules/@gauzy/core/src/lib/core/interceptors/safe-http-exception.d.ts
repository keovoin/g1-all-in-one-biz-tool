import { HttpException } from '@nestjs/common';
/**
 * Turns whatever escaped a controller into the `HttpException` the response should carry —
 * ONE rule for every interceptor that catches errors:
 *
 * - `BadRequestException` → re-issued with its own body (validation arrays intact);
 * - any other `HttpException` → its body is kept STRUCTURED (clients branch on `code`, …) but
 *   passed through {@link sanitizeErrorBody}: many throw sites do
 *   `new HttpException({ message, error }, 400)` with the raw caught error object in `error`, and
 *   a TypeORM `QueryFailedError` / Axios error serialises with the SQL statement, the bound
 *   parameters, the driver fields or the request headers — none of which may leave the server;
 * - a non-HTTP error (TypeORM, a plain `Error`, a thrown object) → `500` (or its own numeric
 *   4xx/5xx `status`). It must NOT become `new HttpException(message, undefined)`: with an
 *   undefined status Express kept the default **200** and clients received `{ message }` as a
 *   successful response.
 */
export declare function toSafeHttpException(error: unknown): HttpException;
/**
 * A JSON-safe copy of an error body: `Error` instances collapse to their message, the
 * transport/driver internals in {@link UNSAFE_BODY_KEYS} are dropped, arrays and plain objects are
 * walked (bounded depth), everything else passes through.
 */
export declare function sanitizeErrorBody(value: unknown, depth?: number): unknown;

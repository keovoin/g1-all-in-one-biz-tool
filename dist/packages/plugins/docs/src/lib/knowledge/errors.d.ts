/**
 * Typed error classification for the `docs-processing` pipeline.
 *
 * Handlers throw `DocsTransientError` (retry through the BullMQ backoff policy) or
 * `DocsPermanentError` (mark the terminal state and complete — no useless retries).
 * `isTransientError` walks a cause chain for errors thrown by third-party libraries.
 */
/**
 * A transient pipeline failure: network/socket/timeout errors, HTTP 408/429/5xx from
 * providers, and storage-read hiccups. Rethrown so BullMQ retries with backoff.
 */
export declare class DocsTransientError extends Error {
    readonly cause?: unknown;
    constructor(message: string, cause?: unknown);
}
/**
 * A permanent pipeline failure: corrupt/password-protected files, unsupported formats,
 * validation failures. The job marks the terminal state and is never retried.
 * Only `DocsPermanentError` messages are user-facing (`statusMessage`).
 */
export declare class DocsPermanentError extends Error {
    readonly cause?: unknown;
    constructor(message: string, cause?: unknown);
}
/**
 * Classifies an arbitrary error as transient (retry) or permanent (terminal), walking
 * the `cause` chain. `DocsTransientError`/`DocsPermanentError` are authoritative;
 * network error codes and provider 408/429/5xx statuses are transient; everything else
 * defaults to permanent (a deterministic extraction failure will not fix itself).
 *
 * @param error The thrown error.
 * @returns True when the error should be retried.
 */
export declare function isTransientError(error: unknown): boolean;

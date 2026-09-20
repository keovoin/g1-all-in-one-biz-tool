/** Header GitHub signs every App webhook delivery with. */
export declare const GITHUB_SIGNATURE_HEADER = "x-hub-signature-256";
/**
 * Verify GitHub's `X-Hub-Signature-256` header against the raw request bytes.
 *
 * The scheme is `sha256=<hex hmac>`, where the HMAC is SHA-256 over the EXACT body GitHub sent,
 * keyed by the webhook secret configured in the GitHub App. Implemented here rather than through
 * `@octokit/webhooks`' `verifyAndReceive` so a bad signature produces a clean 403 instead of the
 * `AggregateError` that receiver turns failures into, and so the check is unit-testable without a
 * Probot instance.
 *
 * Two properties matter and are easy to lose:
 *
 * - **The raw bytes, never a re-serialization.** `JSON.stringify(request.body)` is not what GitHub
 *   hashed: key order, whitespace, number formatting and unicode escaping all survive the wire but
 *   not a parse/re-serialize round trip. The caller must pass `request.rawBody` (captured globally
 *   by `captureRawBody` in the API bootstrap).
 * - **Constant-time comparison, with a length check first.** `timingSafeEqual` throws on unequal
 *   lengths, so the length is compared in the clear (it leaks nothing — the digest length is fixed).
 *
 * @param payload - The raw request body bytes, exactly as received.
 * @param header - The value of the `x-hub-signature-256` request header.
 * @param secret - The webhook secret configured in the GitHub App (`GAUZY_GITHUB_WEBHOOK_SECRET`).
 * @returns `true` only when the header is a well-formed `sha256=` signature that matches.
 */
export declare function verifyGithubWebhookSignature(payload: Buffer, header: string, secret: string): boolean;

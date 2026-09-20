/**
 * Rate-limit (HTTP 429) detection for provider errors, and the envelope used to tell the chat client
 * about it.
 *
 * This exists because a 429 is the DEFINING failure of a free tier, and by default none of it
 * survives the server boundary: `toUIMessageStream` masks every error as the SDK's constant
 * `"An error occurred."` unless an `onError` mapper is supplied. Widening that mask generally would
 * leak provider internals to the browser, so only classified rate limits get a structured envelope
 * and everything else keeps the generic string.
 */
import { AI_CHAT_RATE_LIMIT_CODE, IAiChatRateLimitEnvelope } from '@gauzy/contracts';
/**
 * Re-exported for backend callers. The definitions live in @gauzy/contracts because the browser
 * needs the same runtime constant, and it must not import this plugin (that would pull NestJS into
 * the web bundle).
 */
export { AI_CHAT_RATE_LIMIT_CODE as RATE_LIMIT_CODE };
export type { IAiChatRateLimitEnvelope };
/**
 * Is this error a provider rate limit?
 *
 * Handles the three shapes a 429 actually arrives in:
 *  - a real `APICallError` with `statusCode: 429` (checked structurally, NOT with `instanceof` —
 *    provider packages bundle their own copy of `@ai-sdk/provider`, so prototypes differ);
 *  - that same error wrapped in a `RetryError` after the SDK's automatic retries;
 *  - an HTTP 200 response carrying `{ error: { code: 429 } }` in-stream, which OpenRouter does and
 *    which has no status code or headers at all.
 */
export declare const isRateLimitError: (error: unknown) => boolean;
/** Seconds until reset, if any provider in the chain reported one. */
export declare const rateLimitRetryAfter: (error: unknown) => number | undefined;
/**
 * Build the JSON string handed to the stream's error channel.
 *
 * A string is the only thing that channel carries, so the structure rides inside it and the client
 * parses it back out.
 */
export declare const buildRateLimitEnvelope: (envelope: IAiChatRateLimitEnvelope) => string;

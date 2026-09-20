"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechProviderError = void 0;
exports.isSpeechProviderError = isSpeechProviderError;
/**
 * Error thrown by speech-to-text provider hooks.
 *
 * The `message` is user-facing (the chat panel shows it verbatim) and MUST already be scrubbed of
 * secrets — see `redactSecret` in `openai-compatible-transcribe.ts`.
 */
class SpeechProviderError extends Error {
    constructor(message, 
    /** Machine-readable failure class. */
    kind, 
    /** Provider that failed (registry id), for logs and the `attemptedProviders` list. */
    providerId, 
    /** Upstream HTTP status, when there was one. */
    status) {
        super(message);
        this.kind = kind;
        this.providerId = providerId;
        this.status = status;
        this.name = 'SpeechProviderError';
        // Restore the prototype chain: TS targets below ES2015-class semantics for Error subclasses
        // otherwise make `instanceof SpeechProviderError` false on the thrown value.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.SpeechProviderError = SpeechProviderError;
/** `true` when `error` is a {@link SpeechProviderError} (duck-typed, so copies across bundles count). */
function isSpeechProviderError(error) {
    return (error instanceof SpeechProviderError ||
        (typeof error === 'object' &&
            error !== null &&
            error.name === 'SpeechProviderError' &&
            typeof error.kind === 'string'));
}
//# sourceMappingURL=speech-provider-error.js.map
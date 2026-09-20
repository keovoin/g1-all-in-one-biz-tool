"use strict";
/**
 * Token counting for the markdown chunker (§6 of the AI-knowledge spec).
 *
 * `js-tiktoken` with the `cl100k_base` encoding — the tokenizer family of the default
 * embedding model. If the tokenizer fails to load (exotic runtime), fall back to the
 * `ceil(chars / 4)` heuristic; the counter actually used is reported per run so drift is
 * diagnosable (`metadata.indexing.tokenCounter`).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.heuristicTokenCounter = void 0;
exports.getTokenCounter = getTokenCounter;
exports.resetTokenCounterCache = resetTokenCounterCache;
let cached = null;
/**
 * The `ceil(chars / 4)` fallback counter.
 */
exports.heuristicTokenCounter = {
    kind: 'chars/4',
    count: (text) => Math.ceil((text ?? '').length / 4)
};
/**
 * Resolves the process-wide token counter: `cl100k_base` when `js-tiktoken` loads,
 * else the chars/4 heuristic. The result is cached — encoder construction is expensive.
 */
function getTokenCounter() {
    if (cached) {
        return cached;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getEncoding } = require('js-tiktoken');
        const encoding = getEncoding('cl100k_base');
        cached = {
            kind: 'cl100k_base',
            count: (text) => encoding.encode(text ?? '').length
        };
    }
    catch {
        cached = exports.heuristicTokenCounter;
    }
    return cached;
}
/**
 * Test seam: resets the cached counter.
 */
function resetTokenCounterCache() {
    cached = null;
}
//# sourceMappingURL=token-counter.js.map
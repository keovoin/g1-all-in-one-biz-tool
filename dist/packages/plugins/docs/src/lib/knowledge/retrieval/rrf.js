"use strict";
/**
 * Reciprocal Rank Fusion (§9.4 of the AI-knowledge spec) — pure functions.
 *
 * `score(chunk) = Σ over legs that ranked it: 1 / (K + rank)` with K = 60, rank 1-based.
 * Fusion is client-side over the ranked lists, deduped by chunk id, sorted by fused
 * score, truncated to `topK`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RRF_CONFIDENCE_FLOOR = exports.RRF_K = void 0;
exports.fuseRrf = fuseRrf;
exports.RRF_K = 60;
/** ≈ 0.0154 — "top-5 of at least one leg". Below it, results carry a low-confidence caveat. */
exports.RRF_CONFIDENCE_FLOOR = 1 / (exports.RRF_K + 5);
/**
 * Fuses ranked lists with Reciprocal Rank Fusion.
 *
 * @param legs The ranked lists (already sorted best-first), one per retrieval leg.
 * @param topK Result cap after fusion.
 * @param k The RRF constant (default 60).
 * @returns Fused hits sorted by fused score descending, deduped by `chunkId`.
 */
function fuseRrf(legs, topK, k = exports.RRF_K) {
    const fused = new Map();
    legs.forEach((leg, legIndex) => {
        leg.forEach((hit, position) => {
            const rank = position + 1; // 1-based
            const contribution = 1 / (k + rank);
            const existing = fused.get(hit.chunkId);
            if (existing) {
                existing.score += contribution;
                existing.legs.push(legIndex);
            }
            else {
                fused.set(hit.chunkId, { hit, score: contribution, legs: [legIndex] });
            }
        });
    });
    return [...fused.values()].sort((a, b) => b.score - a.score).slice(0, Math.max(0, topK));
}
//# sourceMappingURL=rrf.js.map